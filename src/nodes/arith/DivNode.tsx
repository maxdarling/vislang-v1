import { type NodeProps, type Node } from "@xyflow/react";
import { ArithNode } from "./ArithNode";

type DivNodeData = { val: number };
type DivNode = Node<DivNodeData, "div">;

export function DivNode(props: NodeProps<Node<DivNodeData, "div">>) {
  return (
    <ArithNode
      {...props}
      label="÷"
      reducer={(acc, curr) => (curr !== 0 ? acc / curr : acc)}
      initialValue={1}
      nodeType="div"
    />
  );
}

DivNode.type = "div" as const;
