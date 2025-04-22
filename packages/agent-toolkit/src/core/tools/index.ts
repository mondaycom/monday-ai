import { allGraphqlApiTools, BaseMondayApiTool } from './platform-api-tools';
import { allMondayAppsTools } from './monday-apps-tools';

export const allTools = [...allGraphqlApiTools, ...allMondayAppsTools];

export { allGraphqlApiTools, BaseMondayApiTool, allMondayAppsTools };
