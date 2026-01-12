import { type NodeProps, type Node } from "@xyflow/react";
import { ArithNode } from "./ArithNode";

type SubNodeData = { val: number };
type SubNode = Node<SubNodeData, "sub">;

export function SubNode(props: NodeProps<Node<SubNodeData, "sub">>) {
  return (
    <ArithNode
      {...props}
      label="-"
      reducer={(acc, curr) => acc - curr}
      initialValue={0}
      nodeType="sub"
    />
  );
}

SubNode.type = "sub" as const;
