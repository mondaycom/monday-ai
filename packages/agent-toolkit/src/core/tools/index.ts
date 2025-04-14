import { allGraphqlApiTools, filterApiTools } from './platform-api-tools';
import { allMondayAppsTools } from './monday-apps-tools';

export const allTools = [...allGraphqlApiTools, ...allMondayAppsTools];

export { allGraphqlApiTools, filterApiTools, allMondayAppsTools };
