import { Handle, Position } from "@xyflow/react";

type LogicNodeProps = {
  label: string;
  nodeType: string;
};

export function LogicNode({ label, nodeType }: LogicNodeProps) {
  return (
    <>
      <Handle type="target" position={Position.Left} isConnectable={true} />
      <div className={`react-flow__node-default node-${nodeType}`}>{label}</div>
      <Handle type="source" position={Position.Right} isConnectable={true} />
    </>
  );
}
