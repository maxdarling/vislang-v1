import { type NodeProps, type Node } from "@xyflow/react";
import { ArithNode } from "./ArithNode";

type MulNodeType = Node<Record<string, never>, "mul">;

export function MulNode(props: NodeProps<MulNodeType>) {
  return <ArithNode {...props} label="×" nodeType="mul" />;
}

MulNode.type = "mul" as const;
