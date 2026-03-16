import { Handle, Position } from "@xyflow/react";

export function TrueNode() {
  return (
    <>
      <div className="react-flow__node-default node-true">#t</div>
      <Handle type="source" position={Position.Right} isConnectable={true} />
    </>
  );
}

TrueNode.type = "true" as const;
