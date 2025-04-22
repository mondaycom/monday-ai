import { ApiClient } from '@mondaydotcomorg/api';
import { ToolSubType } from 'src/core';
import { BaseMondayApiTool, MondayAppsToolType } from 'src/core/tools';
import { ToolsConfiguration } from 'src/mcp';

export function filterApiTools<T extends new (api: ApiClient) => BaseMondayApiTool<any>>(
  tools: T[],
  apiClient: ApiClient,
  config?: ToolsConfiguration,
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
    return toolInstance.subType !== ToolSubType.ALL_API;
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
      return toolInstance.subType === ToolSubType.READ;
    });
  }

  return filteredTools;
}

export function filterMondayAppsTools(
  tools: MondayAppsToolType[],
  mondayApiToken: string,
  config?: ToolsConfiguration,
): MondayAppsToolType[] {
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
