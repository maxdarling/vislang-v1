import { useState, useCallback } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Background,
  Controls,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { PlusNode } from "./PlusNode";
import { DataNode } from "./DataNode";

const nodeTypes = {
  plus: PlusNode,
  data: DataNode,
};

const initialNodes: Node[] = [
  {
    id: "n1",
    type: "data",
    position: { x: 0, y: 0 },
    data: {},
  },
  {
    id: "n2",
    type: "data",
    position: { x: 0, y: 100 },
    data: {},
  },
  {
    id: "n3",
    type: "plus",
    position: { x: 100, y: 50 },
    data: {},
  },
  {
    id: "n4",
    type: "display",
    position: { x: 200, y: 50 },
    data: {},
  },
];

const initialEdges: Edge[] = [
  { id: "n1-n3", source: "n1", target: "n3" },
  { id: "n2-n3", source: "n2", target: "n3" },
  { id: "n3-n4", source: "n3", target: "n4" },
];

export default function App() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot));
  }, []);
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );
  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
