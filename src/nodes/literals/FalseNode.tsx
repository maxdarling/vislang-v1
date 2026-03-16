import { Handle, Position } from "@xyflow/react";

export function FalseNode() {
  return (
    <>
      <div className="react-flow__node-default node-false">#f</div>
      <Handle type="source" position={Position.Right} isConnectable={true} />
    </>
  );
}

FalseNode.type = "false" as const;
