import {
  Position,
  type NodeProps,
  type Node,
  useNodeConnections,
  useNodesData,
} from "@xyflow/react";
import CustomHandle from "../handles/CustomHandle";

type DisplayNodeData = { val?: number };
type DisplayNode = Node<DisplayNodeData, "display">;

export function DisplayNode(_props: NodeProps<DisplayNode>) {
  const inConnections = useNodeConnections({
    handleType: "target",
  });
  const maxConnections = 1;

  const connection = inConnections[0];
  const sourceNodeData = useNodesData(connection?.source);
  const val = (sourceNodeData?.data as { val?: number } | undefined)?.val;

  return (
    <>
      <CustomHandle
        type="target"
        position={Position.Left}
        connectionCount={maxConnections}
      />
      <div className="react-flow__node-default node-display">
        DISP
        <br />
        {val ?? "—"}
      </div>
    </>
  );
}

DisplayNode.type = "display" as const;
