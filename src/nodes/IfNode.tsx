import { Handle, Position } from "@xyflow/react";
import CustomHandle from "../handles/CustomHandle";

const INPUTS = ["p", "a", "b"] as const;

export function IfNode() {
  return (
    <>
      {INPUTS.map((id, i) => (
        <CustomHandle
          key={id}
          type="target"
          position={Position.Left}
          id={id}
          maxConnections={1}
          style={{ top: `${25 + i * 25}%` }}
        />
      ))}
      <div className="react-flow__node-default node-if">if</div>
      <Handle type="source" position={Position.Right} />
    </>
  );
}

IfNode.type = "if" as const;
