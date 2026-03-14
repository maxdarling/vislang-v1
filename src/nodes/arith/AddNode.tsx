import { type NodeProps, type Node } from "@xyflow/react";
import { ArithNode } from "./ArithNode";

type AddNodeType = Node<Record<string, never>, "add">;

export function AddNode(props: NodeProps<AddNodeType>) {
  return <ArithNode {...props} label="+" nodeType="add" />;
}

AddNode.type = "add" as const;
