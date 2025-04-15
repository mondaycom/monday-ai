import { ToolInputType, ToolOutputType } from '../../../tool';
import { BaseMondayAppsTool } from '../base-tool/monday-apps-tool';
import { MondayAppsToolCategory } from '../consts/apps.consts';
import { API_ENDPOINTS, HttpMethod } from '../consts/routes.consts';
import { CreateAppFeatureResponse, createAppFeatureSchema } from './schemas/app-feature-schemas';

export class CreateAppFeatureTool extends BaseMondayAppsTool<
  typeof createAppFeatureSchema.shape,
  CreateAppFeatureResponse
> {
  name = 'monday_apps_create_app_feature';
  category = MondayAppsToolCategory.APP_FEATURE;

  getDescription(): string {
    return 'Create a new app feature for an app version';
  }

  getInputSchema() {
    return createAppFeatureSchema.shape;
  }

  async execute(
    input: ToolInputType<typeof createAppFeatureSchema.shape>,
  ): Promise<ToolOutputType<CreateAppFeatureResponse>> {
    try {
      const { appId, appVersionId, name, type, data } = input;

      // Prepare the request body
      const requestBody = {
        name,
        type,
        data: data || {},
      };

      const response = await this.executeApiRequest<CreateAppFeatureResponse>(
        HttpMethod.POST,
        API_ENDPOINTS.APP_FEATURES.CREATE(appId, appVersionId),
        { data: requestBody },
      );

      return {
        content: `Successfully created app feature '${name}' of type ${type} for app ID ${appId}, version ID ${appVersionId}.`,
        metadata: response,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: `Failed to create app feature: ${errorMessage}`,
        metadata: {
          statusCode: 500,
          error: errorMessage,
          id: 0,
          app_id: input.appId,
          app_version_id: input.appVersionId,
          name: input.name,
          type: input.type,
        } as CreateAppFeatureResponse,
      };
    }
  }
}
