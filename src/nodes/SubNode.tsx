import { type NodeProps, type Node } from "@xyflow/react";
import { FuncNode } from "./FuncNode";

type SubNodeData = { val: number };
type SubNode = Node<SubNodeData, "sub">;

export function SubNode(props: NodeProps<Node<SubNodeData, "sub">>) {
  return (
    <FuncNode
      {...props}
      label="-"
      reducer={(acc, curr) => acc - curr}
      initialValue={0}
      backgroundColor="lightblue"
    />
  );
}
