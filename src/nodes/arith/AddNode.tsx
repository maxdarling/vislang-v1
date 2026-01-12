import { type NodeProps, type Node } from "@xyflow/react";
import { ArithNode } from "./ArithNode";

type AddNodeData = { val: number };
type AddNode = Node<AddNodeData, "add">;

export function AddNode(props: NodeProps<Node<AddNodeData, "add">>) {
  return (
    <ArithNode
      {...props}
      label="+"
      reducer={(acc, curr) => acc + curr}
      initialValue={0}
      nodeType="add"
    />
  );
}

AddNode.type = "add" as const;
