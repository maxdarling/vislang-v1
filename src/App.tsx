import { useCallback, useRef } from "react";
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
import { AddNode } from "./nodes/AddNode";
import { SubNode } from "./nodes/SubNode";
import { MulNode } from "./nodes/MulNode";
import { DivNode } from "./nodes/DivNode";
import { DataNode } from "./nodes/DataNode";
import { DisplayNode } from "./nodes/DisplayNode";
import Sidebar from "./Sidebar";
import { useDnD, DnDProvider } from "./DnDContext";

const nodeTypes = {
  add: AddNode,
  sub: SubNode,
  mul: MulNode,
  div: DivNode,
  data: DataNode,
  display: DisplayNode,
};

const initialNodes: Node[] = [
  {
    id: "n1",
    type: "data",
    position: { x: 0, y: 0 },
    data: { val: 1 },
  },
  {
    id: "n2",
    type: "data",
    position: { x: 0, y: 100 },
    data: { val: 2 },
  },
  {
    id: "n3",
    type: "mul",
    position: { x: 100, y: 50 },
    data: {},
  },
  {
    id: "n4",
    type: "data",
    position: { x: 100, y: 150 },
    data: { val: 3 },
  },
  {
    id: "n5",
    type: "add",
    position: { x: 200, y: 100 },
    data: {},
  },
  {
    id: "n6",
    type: "display",
    position: { x: 300, y: 100 },
    data: {},
  },
];

const initialEdges: Edge[] = [
  { id: "n1-n3", source: "n1", target: "n3" },
  { id: "n2-n3", source: "n2", target: "n3" },
  { id: "n3-n5", source: "n3", target: "n5" },
  { id: "n4-n5", source: "n4", target: "n5" },
  { id: "n5-n6", source: "n5", target: "n6" },
];

let id = 0;
const getId = () => `dndnode_${id++}`;

function DnDFlow() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { screenToFlowPosition } = useReactFlow();
  const [type] = useDnD();

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      // check if the dropped element is valid
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
        data: type === "data" ? { val: 0 } : {},
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
          nodeTypes={nodeTypes}
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
      <DnDProvider>
        <DnDFlow />
      </DnDProvider>
    </ReactFlowProvider>
  );
}
