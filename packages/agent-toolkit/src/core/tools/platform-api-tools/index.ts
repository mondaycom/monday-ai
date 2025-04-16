import { AllMondayApiTool } from './all-monday-api-tool';
import { MondayApiToolType } from './base-monday-api-tool';
import { ChangeItemColumnValuesTool } from './change-item-column-values-tool';
import { CreateBoardTool } from './create-board-tool';
import { CreateColumnTool } from './create-column-tool';
import { CreateItemTool } from './create-item-tool';
import { CreateUpdateTool } from './create-update-tool';
import { DeleteColumnTool } from './delete-column-tool';
import { DeleteItemTool } from './delete-item-tool';
import { GetBoardItemsTool } from './get-board-items-tool';
import { GetBoardSchemaTool } from './get-board-schema-tool';
import { GetGraphQLSchemaTool } from './get-graphql-schema-tool';
import { GetTypeDetailsTool } from './get-type-details-tool';
import { GetUsersTool } from './get-users-tool';
import { MoveItemToGroupTool } from './move-item-to-group-tool';
import { CreateCustomActivityTool } from './create-custom-activity-tool';
import { CreateTimelineItemTool } from './create-timeline-item-tool';
import { FetchCustomActivityTool } from './fetch-custom-activity-tool';
import { filterApiTools } from './utils';

export const allGraphqlApiTools: MondayApiToolType[] = [
  DeleteItemTool,
  GetBoardItemsTool,
  CreateItemTool,
  CreateUpdateTool,
  GetBoardSchemaTool,
  GetUsersTool,
  ChangeItemColumnValuesTool,
  MoveItemToGroupTool,
  CreateBoardTool,
  CreateColumnTool,
  DeleteColumnTool,
  AllMondayApiTool,
  GetGraphQLSchemaTool,
  GetTypeDetailsTool,
  CreateCustomActivityTool,
  CreateTimelineItemTool,
  FetchCustomActivityTool,
];

export { filterApiTools };
