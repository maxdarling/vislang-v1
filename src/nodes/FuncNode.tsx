import {
  Handle,
  Position,
  useNodeConnections,
  useReactFlow,
  useNodesData,
} from "@xyflow/react";
import { useEffect, useMemo } from "react";

type FuncNodeData = { val: number };

type FuncNodeProps = {
  id: string;
  data?: FuncNodeData;
  label: string;
  reducer: (acc: number, curr: number) => number;
  initialValue: number;
  backgroundColor?: string;
};

export function FuncNode({
  id,
  label,
  reducer,
  initialValue,
  backgroundColor = "orange",
}: FuncNodeProps) {
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
      <Handle
        type="target"
        position={Position.Left}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={true}
      />
      <div
        className="react-flow__node-default"
        style={{
          backgroundColor,
          width: "50px",
          height: "50px",
          borderRadius: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
        }}
      >
        {label}
        <br />
        {`(${value})`}
      </div>
      <Handle type="source" position={Position.Right} isConnectable={true} />
    </>
  );
}
