import { type NodeProps, type Node } from "@xyflow/react";
import { FuncNode } from "./FuncNode";

type MulNodeData = { val: number };
type MulNode = Node<MulNodeData, "mul">;

export function MulNode(props: NodeProps<Node<MulNodeData, "mul">>) {
  return (
    <FuncNode
      {...props}
      label="×"
      reducer={(acc, curr) => acc * curr}
      initialValue={1}
      nodeType="mul"
    />
  );
}

MulNode.type = "mul" as const;
