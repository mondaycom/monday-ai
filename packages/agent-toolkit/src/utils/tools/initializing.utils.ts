import { ApiClient } from '@mondaydotcomorg/api';
import { BaseMondayApiTool } from 'src/core/tools/platform-api-tools/base-monday-api-tool';

export const createToolInstance = (tool: any, instanceOptions: { apiClient: ApiClient; apiToken: string }) => {
  if (tool.prototype instanceof BaseMondayApiTool) {
    return new tool(instanceOptions.apiClient);
  }
  return new tool();
};
