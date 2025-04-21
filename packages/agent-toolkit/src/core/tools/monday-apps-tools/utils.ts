import { ToolsConfiguration } from 'src/mcp/toolkit';
import { Tool, ToolSubType } from '../../tool';

export function filterMondayAppsTools<T extends new (...args: any[]) => Tool<any, any>>(
  tools: T[],
  mondayApiToken: string,
  config?: ToolsConfiguration,
): T[] {
  if (!config) {
    return tools;
  }

  if (!config.enableMondayAppsTools) {
    return [];
  }
  let filteredTools = tools;

  if (config.include) {
    filteredTools = tools.filter((tool) => {
      const toolInstance = new tool(mondayApiToken);
      return config.include?.includes(toolInstance.name);
    });
  } else if (config.exclude) {
    filteredTools = tools.filter((tool) => {
      const toolInstance = new tool(mondayApiToken);
      return !config.exclude?.includes(toolInstance.name);
    });
  }

  if (config.readOnlyMode) {
    filteredTools = filteredTools.filter((tool) => {
      const toolInstance = new tool(mondayApiToken);
      return toolInstance.subType === ToolSubType.READ;
    });
  }

  return filteredTools;
}
