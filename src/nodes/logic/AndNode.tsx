import { type NodeProps, type Node } from "@xyflow/react";
import { LogicNode } from "./LogicNode";

type AndNodeType = Node<Record<string, never>, "and">;

export function AndNode(props: NodeProps<AndNodeType>) {
  return <LogicNode {...props} label="and" nodeType="and" />;
}

AndNode.type = "and" as const;
