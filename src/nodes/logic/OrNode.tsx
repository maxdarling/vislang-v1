import { type NodeProps, type Node } from "@xyflow/react";
import { LogicNode } from "./LogicNode";

type OrNodeType = Node<Record<string, never>, "or">;

export function OrNode(props: NodeProps<OrNodeType>) {
  return <LogicNode {...props} label="or" nodeType="or" />;
}

OrNode.type = "or" as const;
