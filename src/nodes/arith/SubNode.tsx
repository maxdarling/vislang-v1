import { Handle, Position } from "@xyflow/react";
import CustomHandle from "../../handles/CustomHandle";

export function SubNode() {
  return (
    <>
      <CustomHandle
        type="target"
        position={Position.Left}
        id="a"
        maxConnections={1}
        style={{ top: "33%" }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="rest"
        isConnectable={true}
        style={{ top: "67%" }}
      />
      <div className="react-flow__node-default node-sub">−</div>
      <Handle type="source" position={Position.Right} isConnectable={true} />
    </>
  );
}

SubNode.type = "sub" as const;
