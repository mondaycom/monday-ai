import { allGraphqlApiTools, filterApiTools } from './platform-api-tools';
import { allMondayAppsTools, mondayAppsTools } from './monday-apps-tools';

// Export all tools for use in the toolkit
export const allTools = [...allGraphqlApiTools, ...allMondayAppsTools];

export { allGraphqlApiTools, filterApiTools, allMondayAppsTools, mondayAppsTools };
