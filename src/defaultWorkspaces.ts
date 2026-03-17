import type { Node, Edge } from "@xyflow/react";
import { FunctionNode } from "./nodes/FunctionNode";

export interface DefaultWorkspace {
  id: string;
  name: string;
  isMain: boolean;
  paramCount: number;
  initialNodes: Node[];
  initialEdges: Edge[];
}

export const DEFAULT_ACTIVE_WORKSPACE_ID = "main";

const defaultWorkspaceDefinitions: DefaultWorkspace[] = [
  {
    id: "main",
    name: "Main",
    isMain: true,
    paramCount: 0,
    initialNodes: [
      {
        id: "main-fn",
        type: FunctionNode.type,
        position: { x: 0, y: 0 },
        data: { name: "main" },
      },
    ],
    initialEdges: [],
  },
];

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
