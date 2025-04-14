import { z } from 'zod';
import { ToolOutputType } from '../tool';
import { ToolInputType } from '../tool';
import { BaseMondayApiTool } from './base-monday-api-tool';
import { ToolType } from '../tool';
import { CreateTimelineItemMutation, CreateTimelineItemMutationVariables } from 'src/monday-graphql/generated/graphql';
import { createTimelineItem } from 'src/monday-graphql/queries.graphql';

export const createTimelineItemToolSchema = {
  item_id: z.number().describe('The ID of the item to create the new timeline item on'),
  custom_activity_id: z.string().describe('The ID of the custom activity for the timeline item'),
  title: z.string().describe('The title of the new timeline item'),
  summary: z.string().optional().describe('The summary of the new timeline item (max 255 characters)'),
  content: z.string().optional().describe('The content of the new timeline item'),
  timestamp: z
    .string()
    .describe('The creation time of the new timeline item in ISO8601 format (e.g., 2024-06-06T18:00:30Z)'),
  start_timestamp: z.string().optional().describe('The start time of the timeline item in ISO8601 format'),
  end_timestamp: z.string().optional().describe('The end time of the timeline item in ISO8601 format'),
  location: z.string().optional().describe('The location to add to the new timeline item'),
  phone: z.string().optional().describe('The phone number to add to the new timeline item'),
  url: z.string().optional().describe('The URL to add to the new timeline item'),
};

// Create the tool class
export class CreateTimelineItemTool extends BaseMondayApiTool<typeof createTimelineItemToolSchema> {
  name = 'create_timeline_item';
  type = ToolType.MUTATION;

  getDescription(): string {
    return 'Create a new timeline item in a monday.com board';
  }

  getInputSchema(): typeof createTimelineItemToolSchema {
    return createTimelineItemToolSchema;
  }

  async execute(input: ToolInputType<typeof createTimelineItemToolSchema>): Promise<ToolOutputType<never>> {
    const variables: CreateTimelineItemMutationVariables = {
      item_id: input.item_id.toString(),
      custom_activity_id: input.custom_activity_id,
      title: input.title,
      timestamp: input.timestamp,
    };

    if (input.summary) variables.summary = input.summary;
    if (input.content) variables.content = input.content;
    if (input.location) variables.location = input.location;
    if (input.phone) variables.phone = input.phone;
    if (input.url) variables.url = input.url;

    if (input.start_timestamp && input.end_timestamp) {
      variables.time_range = {
        start_timestamp: input.start_timestamp,
        end_timestamp: input.end_timestamp,
      };
    }

    const res = await this.mondayApi.request<CreateTimelineItemMutation>(createTimelineItem, variables);

    return {
      content: `Timeline item '${input.title}' with ID ${res.create_timeline_item?.id} successfully created on item ${input.item_id}`,
    };
  }
}
