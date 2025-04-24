import { ApiClient } from '@mondaydotcomorg/api';
import { allGraphqlApiTools, allMondayAppsTools, Tool, ToolType } from 'src/core';
import { ToolsConfiguration } from 'src/types';
import { createToolInstance } from './initializing.utils';

export const getFilteredTools = (
  instanceOptions: { apiClient: ApiClient; apiToken: string },
  config?: ToolsConfiguration,
) => {
  const allTools: Array<new (...args: any[]) => Tool<any, any>> = [...allGraphqlApiTools];
  if (!config) {
    return allTools;
  }

  if (config.enableMondayAppsTools) {
    allTools.push(...allMondayAppsTools);
  }

  return allTools.filter((tool) => {
    const toolInstance = createToolInstance(tool, instanceOptions);
    let shouldFilter = false;
    if (!config.enableDynamicApiTools) {
      shouldFilter = shouldFilter || toolInstance.type === ToolType.ALL_API;
    }
    if (config.readOnlyMode) {
      shouldFilter = shouldFilter || toolInstance.type !== ToolType.READ;
    }
    if (config.include) {
      shouldFilter = shouldFilter || !config.include?.includes(toolInstance.name);
    } else if (config.exclude) {
      shouldFilter = shouldFilter || config.exclude?.includes(toolInstance.name);
    }
    return !shouldFilter;
  });
};
