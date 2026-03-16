import { type NodeProps, type Node } from "@xyflow/react";
import { LogicNode } from "./LogicNode";

type LtNodeType = Node<Record<string, never>, "lt">;

export function LtNode(props: NodeProps<LtNodeType>) {
  return <LogicNode {...props} label="<" nodeType="lt" />;
}

LtNode.type = "lt" as const;
