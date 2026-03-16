import { type NodeProps, type Node } from "@xyflow/react";
import { LogicNode } from "./LogicNode";

type GtNodeType = Node<Record<string, never>, "gt">;

export function GtNode(props: NodeProps<GtNodeType>) {
  return <LogicNode {...props} label=">" nodeType="gt" />;
}

GtNode.type = "gt" as const;
