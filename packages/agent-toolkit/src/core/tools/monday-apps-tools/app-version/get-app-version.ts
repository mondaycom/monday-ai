import { ToolInputType, ToolOutputType } from '../../../tool';
import { BaseMondayAppsTool } from '../base-tool/monday-apps-tool';
import { MondayAppsToolCategory } from '../consts/apps.consts';
import { API_ENDPOINTS, HttpMethod } from '../consts/routes.consts';
import { AppVersionApiData, getAppVersionSchema } from './schemas/app-version-schemas';

export class GetAppVersionTool extends BaseMondayAppsTool<typeof getAppVersionSchema.shape, AppVersionApiData> {
  name = 'monday_apps_get_app_version';
  category = MondayAppsToolCategory.APP_VERSION;

  getDescription(): string {
    return 'Retrieve the app version data';
  }

  getInputSchema() {
    return getAppVersionSchema.shape;
  }

  async execute(input: ToolInputType<typeof getAppVersionSchema.shape>): Promise<ToolOutputType<AppVersionApiData>> {
    try {
      const { versionId } = input;

      const response = await this.executeApiRequest<AppVersionApiData>(
        HttpMethod.GET,
        API_ENDPOINTS.APP_VERSIONS.GET_BY_ID(versionId),
      );

      return {
        content: `Successfully retrieved details for app version ID ${versionId}.`,
        metadata: response,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: `Failed to retrieve app version: ${errorMessage}`,
        metadata: {
          statusCode: 500,
          error: errorMessage,
          id: input.versionId, // Fix the reference to versionId
          name: '',
          appId: 0,
          versionNumber: '',
          status: '',
        } as AppVersionApiData,
      };
    }
  }
}
