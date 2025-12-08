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
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { AddNode } from "./nodes/AddNode";
import { SubNode } from "./nodes/SubNode";
import { MulNode } from "./nodes/MulNode";
import { DivNode } from "./nodes/DivNode";
import { DataNode } from "./nodes/DataNode";
import { DisplayNode } from "./nodes/DisplayNode";

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

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes); // todo: understand this and delete below
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // const onNodesChange = useCallback((changes: NodeChange[]) => {
  //   setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot));
  // }, []);
  // const onEdgesChange = useCallback(
  //   (changes: EdgeChange[]) =>
  //     setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
  //   []
  // );
  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
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
