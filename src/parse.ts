import type { Node, Edge } from "@xyflow/react";
import { loadWorkspaceList, loadWorkspaceData } from "./persistence";
import { getParamNodeIndex, getReturnNodeId } from "./nodes/FunctionNode";
import { SubNode } from "./nodes/arith/SubNode";
import { AddNode } from "./nodes/arith/AddNode";
import { MulNode } from "./nodes/arith/MulNode";
import { DivNode } from "./nodes/arith/DivNode";
import { AndNode } from "./nodes/logic/AndNode";
import { OrNode } from "./nodes/logic/OrNode";
import { NotNode } from "./nodes/logic/NotNode";
import { LtNode } from "./nodes/logic/LtNode";
import { GtNode } from "./nodes/logic/GtNode";
import { EqualNode } from "./nodes/logic/EqualNode";
import { CallNode } from "./nodes/CallNode";
import { IfNode } from "./nodes/IfNode";

function loadAllData(): { nodes: Node[]; edges: Edge[] } {
  const list = loadWorkspaceList() ?? [];
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  for (const ws of list) {
    const data = loadWorkspaceData(ws.id);
    if (data) {
      nodes.push(...data.nodes);
      edges.push(...data.edges);
    }
  }
  return { nodes, edges };
}

let allNodes: Node[] = [];
let allEdges: Edge[] = [];

// follow incoming edges to get child nodes
function getChildren(node: Node): Node[] {
  return allEdges
    .filter((e) => e.target === node.id)
    .map((e) => allNodes.find((n) => n.id === e.source))
    .filter((n): n is Node => n !== undefined);
}

// return the scheme translation of the vislang program
export function parse(): string {
  ({ nodes: allNodes, edges: allEdges } = loadAllData());

  const topLevelFnNodes = allNodes.filter(
    (n) => n.type === "function" && !n.parentId,
  )!;

  return topLevelFnNodes.map((n) => parseFunction(n)).join("\n\n");
}

function parseFunction(fnNode: Node): string {
  const fnName = (fnNode.data as { name: string }).name;
  const paramList = getParamList(fnNode);
  const functionBody = parseFunctionBody(fnNode);
  return `(define (${fnName}${paramList})\n${functionBody})`;
}

function getParamList(fnNode: Node): string {
  const paramNodes = allNodes
    .filter((n) => n.parentId === fnNode.id && n.type === "param")
    .sort((a, b) => getParamNodeIndex(a.id) - getParamNodeIndex(b.id));
  return paramNodes
    .map((n) => {
      const name = (n.data as { name?: string })?.name;
      if (!name) throw new Error(`param node ${n.id} has no name`);
      return ` ${name}`;
    })
    .join("");
}

function parseFunctionBody(fnNode: Node): string {
  const returnNode = allNodes.find((n) => n.id === getReturnNodeId(fnNode.id))!;
  const children = getChildren(returnNode);

  if (children.length === 0) {
    return "'()";
  } else {
    return parseSexp(children[0]);
  }
}

function getOperator(node: Node): string {
  const nodeTypeToOperator: Record<string, string> = {
    [AddNode.type]: "+",
    [SubNode.type]: "-",
    [MulNode.type]: "*",
    [DivNode.type]: "/",
    [IfNode.type]: "if",
    [AndNode.type]: "and",
    [OrNode.type]: "or",
    [NotNode.type]: "not",
    [LtNode.type]: "<",
    [GtNode.type]: ">",
    [EqualNode.type]: "equal?",
  };
  // -param node
  if (node.type === CallNode.type) {
    const fnId = (node.data as { functionNodeId?: string }).functionNodeId;
    const fnNode = allNodes.find((n) => n.id === fnId);
    if (!fnNode)
      throw new Error("Compile error: call node must select a function");
    return (fnNode.data as { name: string }).name;
  }
  const op = node.type ? nodeTypeToOperator[node.type] : undefined;
  if (op === undefined)
    throw new Error(`Compile error: unknown operator node type "${node.type}"`);
  return op;
}

// recursively evaluate the node
// - if no node, return nil
// - if literal, return literal
// - else, must be a function call
//   - recursively eval args and return call
function parseSexp(node: Node): string {
  if (node.type === "number") {
    return `${node.data.val!}`;
  } else if (node.type === "true") {
    return "#t";
  } else if (node.type === "false") {
    return "#f";
  } else if (node.type === "param") {
    return (node.data as { name: string }).name;
  } else {
    // normal call:
    // (op ...args)
    const operator = getOperator(node);
    const children = getChildren(node);
    const args = children.map(parseSexp);
    const argList = args.map((s) => ` ${s}`).join("");

    return `(${operator}${argList})`;
  }
}
