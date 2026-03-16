import { type NodeProps, type Node } from "@xyflow/react";
import { LogicNode } from "./LogicNode";

type EqualNodeType = Node<Record<string, never>, "equal">;

export function EqualNode(props: NodeProps<EqualNodeType>) {
  return <LogicNode {...props} label="equal?" nodeType="equal" />;
}

EqualNode.type = "equal" as const;
