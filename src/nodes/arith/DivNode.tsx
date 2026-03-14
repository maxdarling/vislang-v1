import { type NodeProps, type Node } from "@xyflow/react";
import { ArithNode } from "./ArithNode";

type DivNodeType = Node<Record<string, never>, "div">;

export function DivNode(props: NodeProps<DivNodeType>) {
  return <ArithNode {...props} label="÷" nodeType="div" />;
}

DivNode.type = "div" as const;
