import { Position } from "@xyflow/react";
import CustomHandle from "../handles/CustomHandle";

export function ReturnNode() {
  return (
    <>
      <CustomHandle type="target" position={Position.Left} maxConnections={1} />
      <div className="react-flow__node-default node-return">RET</div>
    </>
  );
}

ReturnNode.type = "return" as const;
