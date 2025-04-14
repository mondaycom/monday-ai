import { ApiClient, ApiClientConfig } from '@mondaydotcomorg/api';
import type {
  ChatCompletionMessageToolCall,
  ChatCompletionTool,
  ChatCompletionToolMessageParam,
} from 'openai/resources';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { Tool } from '../core/tool';
import { allGraphqlApiTools, allMondayAppsTools } from '../core/tools';
import { ApiToolsConfiguration, filterApiTools } from '../core/tools/platform-api-tools/utils';

export type MondayAgentToolkitConfig = {
  mondayApiToken: ApiClientConfig['token'];
  mondayApiVersion?: ApiClientConfig['apiVersion'];
  mondayApiRequestConfig?: ApiClientConfig['requestConfig'];
  toolsConfiguration?: ApiToolsConfiguration;
};

export class MondayAgentToolkit {
  private readonly mondayApi: ApiClient;
  private readonly mondayApiToken?: string;
  tools: Tool<any, any>[];

  constructor(config: MondayAgentToolkitConfig) {
    // Initialize the Monday API client
    this.mondayApi = new ApiClient({
      token: config.mondayApiToken,
      apiVersion: config.mondayApiVersion,
      requestConfig: config.mondayApiRequestConfig,
    });

    // Store token for CLI tools
    this.mondayApiToken = config.mondayApiToken;

    // Initialize tools
    this.tools = this.initializeTools(config);
  }

  /**
   * Initialize both API and CLI tools
   */
  private initializeTools(config: MondayAgentToolkitConfig): Tool<any, any>[] {
    const tools: Tool<any, any>[] = [];

    // Initialize API tools
    const filteredApiTools = filterApiTools(allGraphqlApiTools, this.mondayApi, config.toolsConfiguration);
    for (const ToolClass of filteredApiTools) {
      try {
        // Using any to bypass type checking during instantiation
        const tool = new (ToolClass as any)(this.mondayApi);
        tools.push(tool);
      } catch (error) {
        console.warn(
          `Failed to initialize API tool ${ToolClass.name}: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }

    // Initialize Monday Apps tools
    for (const ToolClass of allMondayAppsTools) {
      try {
        // Using any to bypass type checking during instantiation
        const tool = new ToolClass(this.mondayApiToken);
        tools.push(tool);
      } catch (error) {
        console.warn(
          `Failed to initialize Monday Apps tool ${ToolClass.name}: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }

    return tools;
  }

  /**
   * Returns the tools that are available to be used in the OpenAI API.
   *
   * @returns {ChatCompletionTool[]} The tools that are available to be used in the OpenAI API.
   */
  getTools(): ChatCompletionTool[] {
    return this.tools.map((tool) => {
      const inputSchema = tool.getInputSchema();
      return {
        type: 'function',
        function: {
          name: tool.name,
          description: tool.getDescription(),
          parameters: inputSchema ? zodToJsonSchema(z.object(inputSchema)) : undefined,
        },
      };
    });
  }

  /**
   * Processes a single OpenAI tool call by executing the requested function.
   *
   * @param {ChatCompletionMessageToolCall} toolCall - The tool call object from OpenAI containing
   *   function name, arguments, and ID.
   * @returns {Promise<ChatCompletionToolMessageParam>} A promise that resolves to a tool message
   *   object containing the result of the tool execution with the proper format for the OpenAI API.
   */
  async handleToolCall(toolCall: ChatCompletionMessageToolCall) {
    const { name, arguments: stringifiedArgs } = toolCall.function;
    const args = JSON.parse(stringifiedArgs);

    const tool = this.tools.find((t) => t.name === name);
    if (!tool) {
      throw new Error(`Unknown tool: ${name}`);
    }

    const inputSchema = tool.getInputSchema();
    if (inputSchema) {
      const parsedResult = z.object(inputSchema).safeParse(args);
      if (!parsedResult.success) {
        throw new Error(`Invalid arguments: ${parsedResult.error.message}`);
      }

      const result = await tool.execute(parsedResult.data);
      return {
        role: 'tool',
        tool_call_id: toolCall.id,
        content: result.content,
      } as ChatCompletionToolMessageParam;
    } else {
      // Handle tools without input schema
      const result = await tool.execute();
      return {
        role: 'tool',
        tool_call_id: toolCall.id,
        content: result.content,
      } as ChatCompletionToolMessageParam;
    }
  }
}
