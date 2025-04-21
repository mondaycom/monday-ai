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
import { filterApiTools } from '../core/tools/platform-api-tools/utils';
import { filterMondayAppsTools } from 'src/core/tools/monday-apps-tools/utils';

export type ToolsConfiguration = {
  include?: string[];
  exclude?: string[];
  readOnlyMode?: boolean;
  enableDynamicApiTools?: boolean;
  enableMondayAppsTools?: boolean;
};
export type MondayAgentToolkitConfig = {
  mondayApiToken: ApiClientConfig['token'];
  mondayApiVersion?: ApiClientConfig['apiVersion'];
  mondayApiRequestConfig?: ApiClientConfig['requestConfig'];
  toolsConfiguration?: ToolsConfiguration;
};

export class MondayAgentToolkit {
  private readonly mondayApi: ApiClient;
  private readonly mondayApiToken: string;
  tools: Tool<any, any>[];

  constructor(config: MondayAgentToolkitConfig) {
    this.mondayApi = new ApiClient({
      token: config.mondayApiToken,
      apiVersion: config.mondayApiVersion,
      requestConfig: config.mondayApiRequestConfig,
    });
    this.mondayApiToken = config.mondayApiToken;

    this.tools = this.initializeTools(config);
  }

  /**
   * Initialize both API and CLI tools
   */
  private initializeTools(config: MondayAgentToolkitConfig): Tool<any, any>[] {
    const tools: Tool<any, any>[] = [];

    const filteredApiTools = filterApiTools(allGraphqlApiTools, this.mondayApi, config.toolsConfiguration);
    for (const ToolClass of filteredApiTools) {
      try {
        const tool = new ToolClass(this.mondayApi);
        tools.push(tool);
      } catch (error) {
        console.warn(
          `Failed to initialize API tool ${ToolClass.name}: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }

    const filteredMondayAppsTools = filterMondayAppsTools(
      allMondayAppsTools,
      this.mondayApiToken,
      config.toolsConfiguration,
    );
    for (const ToolClass of filteredMondayAppsTools) {
      try {
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
