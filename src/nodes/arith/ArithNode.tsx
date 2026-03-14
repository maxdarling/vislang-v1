import { Handle, Position } from "@xyflow/react";

type ArithNodeProps = {
  id: string;
  label: string;
  nodeType: string;
};

export function ArithNode({ label, nodeType }: ArithNodeProps) {
  return (
    <>
      <Handle type="target" position={Position.Left} isConnectable={true} />
      <div className={`react-flow__node-default node-${nodeType}`}>{label}</div>
      <Handle type="source" position={Position.Right} isConnectable={true} />
    </>
  );
}
