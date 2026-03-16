import { type NodeProps, type Node } from "@xyflow/react";
import { LogicNode } from "./LogicNode";

type NotNodeType = Node<Record<string, never>, "not">;

export function NotNode(props: NodeProps<NotNodeType>) {
  return <LogicNode {...props} label="not" nodeType="not" />;
}

NotNode.type = "not" as const;
