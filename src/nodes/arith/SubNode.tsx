import { type NodeProps, type Node } from "@xyflow/react";
import { ArithNode } from "./ArithNode";

type SubNodeType = Node<Record<string, never>, "sub">;

export function SubNode(props: NodeProps<SubNodeType>) {
  return <ArithNode {...props} label="-" nodeType="sub" />;
}

SubNode.type = "sub" as const;
