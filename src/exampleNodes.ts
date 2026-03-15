import type { Node, Edge } from "@xyflow/react";
import { DataNode } from "./nodes/DataNode";
import { MulNode } from "./nodes/arith/MulNode";
import { AddNode } from "./nodes/arith/AddNode";
import { FunctionNode } from "./nodes/FunctionNode";
import { CallNode } from "./nodes/CallNode";

export const exampleNodes: Node[] = [
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
];

export const exampleEdges: Edge[] = [
  { id: "n1-n3", source: "n1", target: "n3" },
  { id: "n2-n3", source: "n2", target: "n3" },
  { id: "n3-n5", source: "n3", target: "n5" },
  { id: "n4-n5", source: "n4", target: "n5" },
];
