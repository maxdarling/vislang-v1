import { type NodeProps, type Node } from "@xyflow/react";
import { ArithNode } from "./ArithNode";

type AddNodeData = { val: number };
type AddNodeType = Node<AddNodeData, "add">;

export function AddNode(props: NodeProps<AddNodeType>) {
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
