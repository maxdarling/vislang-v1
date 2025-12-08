import {
  Handle,
  Position,
  type NodeProps,
  type Node,
  useNodeConnections,
  useReactFlow,
  useNodesData,
} from "@xyflow/react";
import { useEffect } from "react";

type PlusNodeData = { val: number };
type PlusNode = Node<PlusNodeData, "plus">;

export function PlusNode({ id }: NodeProps<Node<PlusNodeData, "plus">>) {
  const { updateNodeData } = useReactFlow();

  const inConnections = useNodeConnections({
    handleType: "target",
  });
  const sourceNodeIds = inConnections.map((conn) => conn.source);
  const sourceNodesData = useNodesData(sourceNodeIds);

  // note: below typing is messy. i'm not happy with it yet.
  const input: number[] = sourceNodesData
    .map((nodeData) => {
      return (nodeData?.data as { val: number } | undefined)?.val;
    })
    .filter((val): val is number => typeof val === "number");

  const sum = input.reduce((acc: number, curr: number) => acc + curr, 0);

  useEffect(() => {
    updateNodeData(id, { val: sum });
  }, [id, sum, updateNodeData]);

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
          backgroundColor: "orange",
          width: "50px",
          height: "50px",
          borderRadius: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
        }}
      >
        {`+ (${sum})`}
      </div>
      <Handle type="source" position={Position.Right} isConnectable={true} />
    </>
  );
}
