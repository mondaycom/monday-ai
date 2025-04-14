import { z } from 'zod';
import {
  CreateCustomActivityMutation,
  CreateCustomActivityMutationVariables,
  CustomActivityColor,
  CustomActivityIcon,
} from '../../monday-graphql/generated/graphql';
import { ToolOutputType } from '../tool';
import { ToolInputType } from '../tool';
import { BaseMondayApiTool } from './base-monday-api-tool';
import { ToolType } from '../tool';
import { createCustomActivity } from '../../monday-graphql/queries.graphql';

export const createCustomActivityToolSchema = {
  color: z.nativeEnum(CustomActivityColor).describe('The color of the custom activity'),
  icon_id: z.nativeEnum(CustomActivityIcon).describe('The icon ID of the custom activity'),
  name: z.string().describe('The name of the custom activity'),
};

export class CreateCustomActivityTool extends BaseMondayApiTool<typeof createCustomActivityToolSchema> {
  name = 'create_custom_activity';
  type = ToolType.MUTATION;

  getDescription(): string {
    return 'Create a new custom activity in the E&A app';
  }

  getInputSchema(): typeof createCustomActivityToolSchema {
    return createCustomActivityToolSchema;
  }

  async execute(input: ToolInputType<typeof createCustomActivityToolSchema>): Promise<ToolOutputType<never>> {
    const variables: CreateCustomActivityMutationVariables = {
      color: input.color as CustomActivityColor,
      icon_id: input.icon_id as CustomActivityIcon,
      name: input.name,
    };

    const res = await this.mondayApi.request<CreateCustomActivityMutation>(createCustomActivity, variables);

    return {
      content: `Custom activity '${input.name}' with color ${input.color} and icon ${input.icon_id} successfully created`,
    };
  }
}
