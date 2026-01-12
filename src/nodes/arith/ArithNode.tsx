import {
  Handle,
  Position,
  useNodeConnections,
  useReactFlow,
  useNodesData,
} from "@xyflow/react";
import { useEffect, useMemo } from "react";

type ArithNodeData = { val: number };

type ArithNodeProps = {
  id: string;
  data?: ArithNodeData;
  label: string;
  reducer: (acc: number, curr: number) => number;
  initialValue: number;
  nodeType: string;
};

export function ArithNode({
  id,
  label,
  reducer,
  initialValue,
  nodeType,
}: ArithNodeProps) {
  const { updateNodeData } = useReactFlow();

  const inConnections = useNodeConnections({
    handleType: "target",
  });
  const sourceNodeIds = inConnections.map((conn) => conn.source);
  const sourceNodesData = useNodesData(sourceNodeIds);

  // note: below typing is messy. i'm not happy with it yet.
  const value = useMemo(
    () =>
      sourceNodesData
        .map((nodeData) => {
          return (nodeData?.data as { val: number } | undefined)?.val;
        })
        .filter((val): val is number => typeof val === "number")
        .reduce(reducer, initialValue),
    [sourceNodesData, reducer, initialValue],
  );

  useEffect(() => {
    updateNodeData(id, { val: value });
  }, [id, value, updateNodeData]);

  return (
    <>
      <Handle type="target" position={Position.Left} isConnectable={true} />
      <div className={`react-flow__node-default node-${nodeType}`}>
        {label}
        <br />
        {`(${value})`}
      </div>
      <Handle type="source" position={Position.Right} isConnectable={true} />
    </>
  );
}
