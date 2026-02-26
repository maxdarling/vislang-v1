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
const reactFlowNodeTypes = Object.fromEntries(
  nodeTypes.map((NodeComponent) => [NodeComponent.type, NodeComponent]),
) as Record<(typeof nodeTypes)[number]["type"], (typeof nodeTypes)[number]>;

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

// "drag and drop" flow: a wrapper that includes a drag-and-drop sidebar and a flow canvas.
function DnDFlow() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { screenToFlowPosition } = useReactFlow();
  const [type] = useDnD();

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [setEdges],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: getId(),
        type,
        position,
        data: {}, // nodes should init themselves. logic here leads to complexity.
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, type, setNodes],
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
