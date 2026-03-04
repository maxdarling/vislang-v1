import { type NodeProps, type Node } from "@xyflow/react";

type CallInstanceNodeData = { name?: string };
type CallInstanceNodeType = Node<CallInstanceNodeData, "callInstance">;

/**
 * A read-only container node for a call instance in the runtime flow.
 * Analogous to FunctionNode but stripped down — just a labeled bounding box
 * that parents the cloned subgraph.
 */
export function CallInstanceNode({ data }: NodeProps<CallInstanceNodeType>) {
  return (
    <div className="call-instance-node-wrapper">
      <div className="call-instance-node-header">
        <span className="call-instance-node-name">
          {data?.name ?? "instance"}
        </span>
      </div>
      <div className="node-call-instance"></div>
    </div>
  );
}

CallInstanceNode.type = "callInstance" as const;
