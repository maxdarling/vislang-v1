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
import { RuntimeReturnNode } from "./nodes/RuntimeReturnNode";
import { CallInstanceNode } from "./nodes/CallInstanceNode";
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
export const reactFlowNodeTypes: Record<string, any> = Object.fromEntries(
  ([...nodeTypes, RuntimeReturnNode, CallInstanceNode] as any[]).map(
    (NodeComponent) => [NodeComponent.type, withDetachToolbar(NodeComponent)],
  ),
);
/* eslint-enable @typescript-eslint/no-explicit-any */
