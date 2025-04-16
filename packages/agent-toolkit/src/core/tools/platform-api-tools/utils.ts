import { ApiClient } from '@mondaydotcomorg/api';
import { ToolType } from '../../tool';
import { BaseMondayApiTool } from './base-monday-api-tool';

export type ApiToolsConfiguration = {
  include?: string[];
  exclude?: string[];
  readOnlyMode?: boolean;
  enableDynamicApiTools?: boolean;
};

export function filterApiTools<T extends new (api: ApiClient) => BaseMondayApiTool<any>>(
  tools: T[],
  apiClient: ApiClient,
  config?: ApiToolsConfiguration,
): T[] {
  if (!config) {
    return tools;
  }

  // If dynamic API tools are enabled and read-only mode is not enabled, return all tools
  let filteredTools = tools;
  if (config.enableDynamicApiTools && !config.readOnlyMode) {
    return filteredTools;
  }

  filteredTools = filteredTools.filter((tool) => {
    const toolInstance = new tool(apiClient);
    return toolInstance.type !== ToolType.ALL_API;
  });

  if (config.include) {
    filteredTools = tools.filter((tool) => {
      const toolInstance = new tool(apiClient);
      return config.include?.includes(toolInstance.name);
    });
  } else if (config.exclude) {
    filteredTools = tools.filter((tool) => {
      const toolInstance = new tool(apiClient);
      return !config.exclude?.includes(toolInstance.name);
    });
  }

  if (config.readOnlyMode) {
    filteredTools = filteredTools.filter((tool) => {
      const toolInstance = new tool(apiClient);
      return toolInstance.type === ToolType.QUERY;
    });
  }

  return filteredTools;
}
