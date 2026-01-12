import { type NodeProps, type Node } from "@xyflow/react";
import { ArithNode } from "./ArithNode";

type MulNodeData = { val: number };
type MulNode = Node<MulNodeData, "mul">;

export function MulNode(props: NodeProps<Node<MulNodeData, "mul">>) {
  return (
    <ArithNode
      {...props}
      label="×"
      reducer={(acc, curr) => acc * curr}
      initialValue={1}
      nodeType="mul"
    />
  );
}

MulNode.type = "mul" as const;
