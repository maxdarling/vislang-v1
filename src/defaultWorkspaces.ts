import type { Node, Edge } from "@xyflow/react";
import defaultWorkspacesData from "./defaultWorkspacesData.json";

export interface DefaultWorkspace {
  id: string;
  name: string;
  isMain: boolean;
  paramCount: number;
  initialNodes: Node[];
  initialEdges: Edge[];
}

export const DEFAULT_ACTIVE_WORKSPACE_ID = "main";

const defaultWorkspaceDefinitions: DefaultWorkspace[] =
  defaultWorkspacesData.map(({ nodes, edges, ...workspace }) => ({
    ...workspace,
    initialNodes: nodes,
    initialEdges: edges,
  }));

function cloneGraph<T>(value: T): T {
  return structuredClone(value);
}

export function getDefaultWorkspaces(): DefaultWorkspace[] {
  return defaultWorkspaceDefinitions.map((workspace) => ({
    ...workspace,
    initialNodes: cloneGraph(workspace.initialNodes),
    initialEdges: cloneGraph(workspace.initialEdges),
  }));
}
