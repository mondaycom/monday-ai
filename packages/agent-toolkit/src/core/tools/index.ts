import { allGraphqlApiTools, BaseMondayApiTool } from './platform-api-tools';
import { allMondayAppsTools, MondayAppsToolType } from './monday-apps-tools';

export const allTools = [...allGraphqlApiTools, ...allMondayAppsTools];

export { allGraphqlApiTools, BaseMondayApiTool, MondayAppsToolType, allMondayAppsTools };
