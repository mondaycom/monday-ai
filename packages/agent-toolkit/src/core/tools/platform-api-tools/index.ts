import { DeleteItemTool } from './delete-item-tool';
import { GetBoardItemsTool } from './get-board-items-tool';
import { CreateItemTool } from './create-item-tool';
import { CreateUpdateTool } from './create-update-tool';
import { GetBoardSchemaTool } from './get-board-schema-tool';
import { GetUsersTool } from './get-users-tool';
import { ChangeItemColumnValuesTool } from './change-item-column-values-tool';
import { MoveItemToGroupTool } from './move-item-to-group-tool';
import { CreateBoardTool } from './create-board-tool';
import { CreateColumnTool } from './create-column-tool';
import { DeleteColumnTool } from './delete-column-tool';
import { AllMondayApiTool } from './all-monday-api-tool';
import { GetGraphQLSchemaTool } from './get-graphql-schema-tool';
import { GetTypeDetailsTool } from './get-type-details-tool';
import { filterApiTools } from './utils';

export const allGraphqlApiTools = [
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
];

export { filterApiTools };
