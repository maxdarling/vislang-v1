import React, { useCallback, useRef } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  Background,
  Controls,
  type Node,
  type Edge,
  type Connection,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { AddNode } from "./nodes/arith/AddNode";
import { SubNode } from "./nodes/arith/SubNode";
import { MulNode } from "./nodes/arith/MulNode";
import { DivNode } from "./nodes/arith/DivNode";
import { DataNode } from "./nodes/DataNode";
import { ParamNode } from "./nodes/ParamNode";
import { DisplayNode } from "./nodes/DisplayNode";
import { ReturnNode } from "./nodes/ReturnNode";
import { FunctionNode } from "./nodes/FunctionNode";
import { CallNode } from "./nodes/CallNode";
import Sidebar from "./Sidebar";
import { useDnD, DnDProvider } from "./DnDContext";
import { FunctionNamespaceProvider } from "./FunctionNamespaceContext";
import { withDetachToolbar } from "./components/DetachToolbar";

// master node type list
export const nodeTypesByCategory = {
  data: [DataNode],
  arith: [AddNode, SubNode, MulNode, DivNode],
  function: [FunctionNode, ParamNode, ReturnNode, CallNode],
  other: [DisplayNode],
} as const;

export const nodeTypes = [
  // todo: better name
  ...nodeTypesByCategory.data,
  ...nodeTypesByCategory.arith,
  ...nodeTypesByCategory.function,
  ...nodeTypesByCategory.other,
] as const;

// magic format for Flow. ignore. defined outside component to prevent re-render.
/* eslint-disable @typescript-eslint/no-explicit-any */
const reactFlowNodeTypes: Record<string, any> = Object.fromEntries(
  nodeTypes.map((NodeComponent) => [
    NodeComponent.type,
    withDetachToolbar(NodeComponent as any),
  ]),
);
/* eslint-enable @typescript-eslint/no-explicit-any */

const initialNodes: Node[] = [
  {
    id: "n1",
    type: DataNode.type,
    position: { x: 0, y: 0 },
    data: { val: 1 },
  },
  {
    id: "n2",
    type: DataNode.type,
    position: { x: 0, y: 100 },
    data: { val: 2 },
  },
  {
    id: "n3",
    type: MulNode.type,
    position: { x: 100, y: 50 },
    data: {},
  },
  {
    id: "n4",
    type: DataNode.type,
    position: { x: 100, y: 150 },
    data: { val: 3 },
  },
  {
    id: "n5",
    type: AddNode.type,
    position: { x: 200, y: 100 },
    data: {},
  },
  {
    id: "n6",
    type: FunctionNode.type,
    position: { x: 300, y: -150 },
    data: {},
  },
  {
    id: "n7",
    type: CallNode.type,
    position: { x: 350, y: 100 },
    data: {},
  },
  {
    id: "n8",
    type: DisplayNode.type,
    position: { x: 575, y: 112 },
    data: {},
  },
];

const initialEdges: Edge[] = [
  { id: "n1-n3", source: "n1", target: "n3" },
  { id: "n2-n3", source: "n2", target: "n3" },
  { id: "n3-n5", source: "n3", target: "n5" },
  { id: "n4-n5", source: "n4", target: "n5" },
  { id: "n7-n8", source: "n7", target: "n8" },
];

let id = 0;
const getId = () => `dndnode_${id++}`;

/**
 * Find the first FunctionNode whose bounding box contains the given flow-coordinate
 * point. Returns undefined if the point is not inside any function node.
 */
function findFunctionAtPosition(
  nodes: Node[],
  x: number,
  y: number,
): Node | undefined {
  return nodes.find((n) => {
    if (n.type !== FunctionNode.type) return false;
    const w = n.measured?.width ?? n.width ?? 0;
    const h = n.measured?.height ?? n.height ?? 0;
    return (
      x >= n.position.x &&
      x <= n.position.x + w &&
      y >= n.position.y &&
      y <= n.position.y + h
    );
  });
}

// "drag and drop" flow: a wrapper that includes a drag-and-drop sidebar and a flow instance.
function DnDFlow() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const {
    screenToFlowPosition,
    getIntersectingNodes,
    updateNodeData,
    getNodes,
  } = useReactFlow();
  const [type] = useDnD();

  // Track which FunctionNode is currently highlighted so we only update when it changes.
  const highlightedRef = useRef<string | null>(null);

  const setHighlight = useCallback(
    (targetId: string | null) => {
      if (targetId === highlightedRef.current) return;
      if (highlightedRef.current) {
        updateNodeData(highlightedRef.current, { highlighted: false });
      }
      if (targetId) {
        updateNodeData(targetId, { highlighted: true });
      }
      highlightedRef.current = targetId;
    },
    [updateNodeData],
  );

  const clearHighlight = useCallback(() => {
    setHighlight(null);
  }, [setHighlight]);

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [setEdges],
  );

  // --- Canvas node drag: highlight target function ---
  const onNodeDrag = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      if (node.type === FunctionNode.type) {
        clearHighlight();
        return;
      }
      const intersecting = getIntersectingNodes(node);
      const target = intersecting.find(
        (n) => n.type === FunctionNode.type && n.id !== node.parentId,
      );
      setHighlight(target?.id ?? null);
    },
    [getIntersectingNodes, setHighlight, clearHighlight],
  );

  // --- Canvas node drop: adopt into function ---
  const onNodeDragStop = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      clearHighlight();

      if (node.type === FunctionNode.type) return;

      const intersecting = getIntersectingNodes(node);
      const target = intersecting.find(
        (n) => n.type === FunctionNode.type && n.id !== node.parentId,
      );

      if (!target) return;

      setNodes((nds) =>
        nds.map((n) => {
          if (n.id !== node.id) return n;
          return {
            ...n,
            position: {
              x: n.position.x - target.position.x,
              y: n.position.y - target.position.y,
            },
            parentId: target.id,
            extent: "parent" as const,
          };
        }),
      );
    },
    [getIntersectingNodes, setNodes, clearHighlight],
  );

  // --- Sidebar drag over: highlight target function ---
  const onDragOver = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const target = findFunctionAtPosition(getNodes(), position.x, position.y);
      setHighlight(target?.id ?? null);
    },
    [screenToFlowPosition, getNodes, setHighlight],
  );

  const onDragLeave = useCallback(() => {
    clearHighlight();
  }, [clearHighlight]);

  // --- Sidebar drop: create node (possibly as child of function) ---
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      clearHighlight();

      if (!type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const target = findFunctionAtPosition(getNodes(), position.x, position.y);

      const newNode: Node = {
        id: getId(),
        type,
        position: target
          ? {
              x: position.x - target.position.x,
              y: position.y - target.position.y,
            }
          : position,
        data: {}, // nodes should init themselves. node-specific logic here leads to complexity.
        ...(target && {
          parentId: target.id,
          extent: "parent" as const,
        }),
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, type, setNodes, getNodes, clearHighlight],
  );

  return (
    <div className="dndflow">
      <div className="reactflow-wrapper" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={reactFlowNodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onNodeDrag={onNodeDrag}
          onNodeDragStop={onNodeDragStop}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
      <Sidebar />
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <FunctionNamespaceProvider>
        <DnDProvider>
          <DnDFlow />
        </DnDProvider>
      </FunctionNamespaceProvider>
    </ReactFlowProvider>
  );
}
