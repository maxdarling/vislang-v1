import { AddNode } from "./nodes/arith/AddNode";
import { SubNode } from "./nodes/arith/SubNode";
import { MulNode } from "./nodes/arith/MulNode";
import { DivNode } from "./nodes/arith/DivNode";
import { NumberNode } from "./nodes/NumberNode";
import { TrueNode } from "./nodes/literals/TrueNode";
import { FalseNode } from "./nodes/literals/FalseNode";
import { ParamNode } from "./nodes/ParamNode";
import { ReturnNode } from "./nodes/ReturnNode";
import { FunctionNode } from "./nodes/FunctionNode";
import { CallNode } from "./nodes/CallNode";
import { IfNode } from "./nodes/IfNode";
import { LtNode } from "./nodes/logic/LtNode";
import { GtNode } from "./nodes/logic/GtNode";
import { EqualNode } from "./nodes/logic/EqualNode";
import { AndNode } from "./nodes/logic/AndNode";
import { OrNode } from "./nodes/logic/OrNode";
import { NotNode } from "./nodes/logic/NotNode";
import { withDetachToolbar } from "./components/DetachToolbar";

// master node type list
export const nodeTypesByCategory = {
  literals: [NumberNode, TrueNode, FalseNode],
  arith: [AddNode, SubNode, MulNode, DivNode],
  logic: [IfNode, LtNode, GtNode, EqualNode, AndNode, OrNode, NotNode],
  function: [FunctionNode, ParamNode, ReturnNode, CallNode],
} as const;

export const nodeTypes = [
  ...nodeTypesByCategory.literals,
  ...nodeTypesByCategory.arith,
  ...nodeTypesByCategory.logic,
  ...nodeTypesByCategory.function,
] as const;

// magic format for Flow. ignore. defined outside component to prevent re-render.
/* eslint-disable @typescript-eslint/no-explicit-any */
export const reactFlowNodeTypes: Record<string, any> = Object.fromEntries(
  ([...nodeTypes] as any[]).map((NodeComponent) => [
    NodeComponent.type,
    withDetachToolbar(NodeComponent),
  ]),
);
/* eslint-enable @typescript-eslint/no-explicit-any */
