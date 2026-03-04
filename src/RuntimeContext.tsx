import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
} from "@xyflow/react";
import { ParamNode } from "./nodes/ParamNode";
import { ReturnNode } from "./nodes/ReturnNode";
import { DataNode } from "./nodes/DataNode";
import { CallInstanceNode } from "./nodes/CallInstanceNode";

export const RUNTIME_RETURN_TYPE = "runtimeReturn" as const;

interface InvokeParams {
  functionNodeId: string;
  args: Record<number, number>;
  sourceNodes: Node[];
  sourceEdges: Edge[];
}

interface RuntimeContextValue {
  runtimeNodes: Node[];
  runtimeEdges: Edge[];
  onRuntimeNodesChange: OnNodesChange;
  onRuntimeEdgesChange: OnEdgesChange;
  returnValues: Record<string, number | undefined>;
  setReturnValue: (functionNodeId: string, value: number | undefined) => void;
  invoke: (params: InvokeParams) => void;
}

const RuntimeContext = createContext<RuntimeContextValue>({
  runtimeNodes: [],
  runtimeEdges: [],
  onRuntimeNodesChange: () => {},
  onRuntimeEdgesChange: () => {},
  returnValues: {},
  setReturnValue: () => {},
  invoke: () => {},
});

function getRuntimePrefix(functionNodeId: string) {
  return `rt-${functionNodeId}`;
}

function getRuntimeNodeId(functionNodeId: string, originalId: string) {
  return `${getRuntimePrefix(functionNodeId)}-${originalId}`;
}

export function RuntimeProvider({ children }: { children: ReactNode }) {
  const [runtimeNodes, setRuntimeNodes, onRuntimeNodesChange] = useNodesState(
    [] as Node[],
  );
  const [runtimeEdges, setRuntimeEdges, onRuntimeEdgesChange] = useEdgesState(
    [] as Edge[],
  );
  const [returnValues, setReturnValues] = useState<
    Record<string, number | undefined>
  >({});

  const setReturnValue = useCallback(
    (functionNodeId: string, value: number | undefined) => {
      setReturnValues((prev) => {
        if (prev[functionNodeId] === value) return prev;
        return { ...prev, [functionNodeId]: value };
      });
    },
    [],
  );

  const invoke = useCallback(
    ({ functionNodeId, args, sourceNodes, sourceEdges }: InvokeParams) => {
      const prefix = getRuntimePrefix(functionNodeId);
      const instanceNodeId = `${prefix}-instance`;

      const functionNode = sourceNodes.find((n) => n.id === functionNodeId);
      const funcName =
        (functionNode?.data as { name?: string })?.name ?? "instance";
      const funcWidth = functionNode?.measured?.width ?? 250;
      const funcHeight = functionNode?.measured?.height ?? 200;

      // Use the function node's main-flow position so runtime instances
      // are spatially separated similarly to the definitions.
      const offsetX = functionNode?.position.x ?? 0;
      const offsetY = functionNode?.position.y ?? 0;

      // --- Container node (analogous to FunctionNode) ---
      const instanceNode: Node = {
        id: instanceNodeId,
        type: CallInstanceNode.type,
        position: { x: offsetX, y: offsetY },
        style: { width: funcWidth, height: funcHeight },
        data: { name: funcName },
      };

      // --- Clone child nodes as children of the instance ---
      const childNodes = sourceNodes.filter(
        (n) => n.parentId === functionNodeId,
      );
      const childIds = new Set(childNodes.map((n) => n.id));

      const internalEdges = sourceEdges.filter(
        (e) => childIds.has(e.source) && childIds.has(e.target),
      );

      const childBase = {
        parentId: instanceNodeId,
        extent: "parent" as const,
      };

      const clonedNodes: Node[] = childNodes.map((node) => {
        const newId = getRuntimeNodeId(functionNodeId, node.id);

        if (node.type === ParamNode.type) {
          const paramIndex = parseInt(node.id.split("-param-")[1] ?? "0", 10);
          return {
            id: newId,
            type: DataNode.type,
            position: { ...node.position },
            data: { val: args[paramIndex] ?? DataNode.defaultVal },
            draggable: node.draggable,
            ...childBase,
          };
        }

        if (node.type === ReturnNode.type) {
          return {
            id: newId,
            type: RUNTIME_RETURN_TYPE,
            position: { ...node.position },
            data: { functionNodeId },
            draggable: node.draggable,
            ...childBase,
          };
        }

        return {
          id: newId,
          type: node.type,
          position: { ...node.position },
          data: { ...node.data },
          draggable: node.draggable,
          ...childBase,
        };
      });

      const clonedEdges: Edge[] = internalEdges.map((edge) => ({
        id: `${prefix}-${edge.id}`,
        source: getRuntimeNodeId(functionNodeId, edge.source),
        target: getRuntimeNodeId(functionNodeId, edge.target),
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
      }));

      // Remove old instance, add new (container first, then children)
      setRuntimeNodes((prev) => [
        ...prev.filter((n) => !n.id.startsWith(`${prefix}-`)),
        instanceNode,
        ...clonedNodes,
      ]);
      setRuntimeEdges((prev) => [
        ...prev.filter((e) => !e.id.startsWith(`${prefix}-`)),
        ...clonedEdges,
      ]);

      setReturnValue(functionNodeId, undefined);
    },
    [setRuntimeNodes, setRuntimeEdges, setReturnValue],
  );

  const value = useMemo(
    () => ({
      runtimeNodes,
      runtimeEdges,
      onRuntimeNodesChange,
      onRuntimeEdgesChange,
      returnValues,
      setReturnValue,
      invoke,
    }),
    [
      runtimeNodes,
      runtimeEdges,
      onRuntimeNodesChange,
      onRuntimeEdgesChange,
      returnValues,
      setReturnValue,
      invoke,
    ],
  );

  return (
    <RuntimeContext.Provider value={value}>{children}</RuntimeContext.Provider>
  );
}

export function useRuntime() {
  return useContext(RuntimeContext);
}
