import { ZodRawShape } from 'zod';
import { ApiClient } from '@mondaydotcomorg/api';
import { ToolInputType, ToolOutputType, Tool, ToolType, ToolSubType } from '../../tool';

export type MondayApiToolContext = {
  boardId?: number;
};

export type MondayApiToolType = new (api: ApiClient) => BaseMondayApiTool<any>;

export abstract class BaseMondayApiTool<
  Input extends ZodRawShape | undefined,
  Output extends Record<string, unknown> = never,
> implements Tool<Input, Output>
{
  abstract name: string;
  type = ToolType.API;
  abstract subType: ToolSubType;

  constructor(
    protected readonly mondayApi: ApiClient,
    protected readonly context?: MondayApiToolContext,
  ) {}

  abstract getDescription(): string;
  abstract getInputSchema(): Input;
  abstract execute(input?: ToolInputType<Input>): Promise<ToolOutputType<Output>>;
}
