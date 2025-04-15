import { ToolInputType, ToolOutputType } from '../../../tool';
import { BaseMondayAppsTool } from '../base-tool/monday-apps-tool';
import { MondayAppsToolCategory } from '../consts/apps.consts';
import { API_ENDPOINTS, HttpMethod } from '../consts/routes.consts';
import { DeploymentStatusResponse, getDeploymentStatusSchema } from './schemas/code-schemas';

export class GetDeploymentStatusTool extends BaseMondayAppsTool<
  typeof getDeploymentStatusSchema.shape,
  DeploymentStatusResponse
> {
  name = 'monday_apps_get_deployment_status';
  category = MondayAppsToolCategory.MONDAY_CODE;

  getDescription(): string {
    return 'Get the deployment status for a specific app version';
  }

  getInputSchema() {
    return getDeploymentStatusSchema.shape;
  }

  async execute(
    input: ToolInputType<typeof getDeploymentStatusSchema.shape>,
  ): Promise<ToolOutputType<DeploymentStatusResponse>> {
    try {
      const { appVersionId } = input;

      const response = await this.executeApiRequest<DeploymentStatusResponse>(
        HttpMethod.GET,
        API_ENDPOINTS.CODE.GET_DEPLOYMENT_STATUS(appVersionId),
      );

      return {
        content: `Deployment status for app version ID ${appVersionId}: ${response.status || 'Unknown'}`,
        metadata: response,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: `Failed to get deployment status: ${errorMessage}`,
        metadata: {
          statusCode: 500,
          error: errorMessage,
        } as DeploymentStatusResponse,
      };
    }
  }
}
