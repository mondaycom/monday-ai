import { GetDeploymentStatusTool } from './get-deployment-status';
import { GetTunnelTokenTool } from './get-tunnel-token';
import { SetEnvironmentVariableTool } from './set-environment-variable';
import { DeleteEnvironmentVariableTool } from './delete-environment-variable';
import { ListEnvironmentVariableKeysTool } from './list-environment-variable-keys';

export const codeTools = [
  GetDeploymentStatusTool,
  GetTunnelTokenTool,
  SetEnvironmentVariableTool,
  DeleteEnvironmentVariableTool,
  ListEnvironmentVariableKeysTool,
];
