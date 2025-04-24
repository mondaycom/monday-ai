import { ApiClient } from '@mondaydotcomorg/api';
import { BaseMondayAppsTool } from 'src/core/tools/monday-apps-tools/base-tool/monday-apps-tool';
import { BaseMondayApiTool } from 'src/core/tools/platform-api-tools/base-monday-api-tool';
import { Tool } from 'src/core/tool';

export const createToolInstance = (
  tool: new (...args: any[]) => Tool<any, any>,
  instanceOptions: { apiClient: ApiClient; apiToken: string },
) => {
  if (tool.prototype instanceof BaseMondayApiTool) {
    return new tool(instanceOptions.apiClient);
  } else if (tool.prototype instanceof BaseMondayAppsTool) {
    return new tool(instanceOptions.apiToken);
  }
  return new tool();
};
