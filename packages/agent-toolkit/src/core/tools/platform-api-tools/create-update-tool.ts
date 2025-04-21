import { z } from 'zod';
import { BaseMondayApiTool } from './base-monday-api-tool';
import { ToolInputType, ToolOutputType, ToolSubType, ToolType } from '../../tool';
import { createUpdate } from '../../../monday-graphql/queries.graphql';
import { CreateUpdateMutation, CreateUpdateMutationVariables } from '../../../monday-graphql/generated/graphql';

export const createUpdateToolSchema = {
  itemId: z.number().describe('The id of the item to which the update will be added'),
  body: z.string().describe("The update to be created, must be relevant to the user's request"),
};

export class CreateUpdateTool extends BaseMondayApiTool<typeof createUpdateToolSchema> {
  name = 'create_update';
  type = ToolType.API;
  subType = ToolSubType.WRITE;

  getDescription(): string {
    return 'Create a new update in a monday.com board';
  }

  getInputSchema(): typeof createUpdateToolSchema {
    return createUpdateToolSchema;
  }

  async execute(input: ToolInputType<typeof createUpdateToolSchema>): Promise<ToolOutputType<never>> {
    const variables: CreateUpdateMutationVariables = {
      itemId: input.itemId.toString(),
      body: input.body,
    };

    const res = await this.mondayApi.request<CreateUpdateMutation>(createUpdate, variables);

    return {
      content: `Update ${res.create_update?.id} successfully created on item ${input.itemId}`,
    };
  }
}
