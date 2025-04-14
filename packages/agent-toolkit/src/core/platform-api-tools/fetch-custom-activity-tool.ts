import { ToolOutputType } from '../tool';
import { ToolInputType } from '../tool';
import { BaseMondayApiTool } from './base-monday-api-tool';
import { ToolType } from '../tool';
import { FetchCustomActivityQuery } from 'src/monday-graphql/generated/graphql';
import { fetchCustomActivity } from 'src/monday-graphql/queries.graphql';

export const fetchCustomActivityToolSchema = {};

export class FetchCustomActivityTool extends BaseMondayApiTool<typeof fetchCustomActivityToolSchema> {
  name = 'fetch_custom_activity';
  type = ToolType.QUERY;

  getDescription(): string {
    return 'Get custom activities from the E&A app';
  }

  getInputSchema(): typeof fetchCustomActivityToolSchema {
    return fetchCustomActivityToolSchema;
  }

  async execute(input: ToolInputType<typeof fetchCustomActivityToolSchema>): Promise<ToolOutputType<never>> {
    const res = await this.mondayApi.request<FetchCustomActivityQuery>(fetchCustomActivity);

    if (!res.custom_activity || res.custom_activity.length === 0) {
      return {
        content: 'No custom activities found',
      };
    }

    const activities = res.custom_activity.map((activity) => {
      return {
        id: activity.id,
        name: activity.name,
        color: activity.color,
        icon_id: activity.icon_id,
        type: activity.type,
      };
    });

    return {
      content: `Found ${activities.length} custom activities: ${JSON.stringify(activities, null, 2)}`,
    };
  }
}
