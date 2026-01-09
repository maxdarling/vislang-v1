import { type NodeProps, type Node } from "@xyflow/react";
import { FuncNode } from "./FuncNode";

type DivNodeData = { val: number };
type DivNode = Node<DivNodeData, "div">;

export function DivNode(props: NodeProps<Node<DivNodeData, "div">>) {
  return (
    <FuncNode
      {...props}
      label="÷"
      reducer={(acc, curr) => (curr !== 0 ? acc / curr : acc)}
      initialValue={1}
      nodeType="div"
    />
  );
}
