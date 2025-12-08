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
      <div
        className="react-flow__node-default"
        style={{
          backgroundColor: "lightblue",
          width: "80px",
          height: "50px",
          borderRadius: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
        }}
      >
        DISP
        <br />
        {val ?? "—"}
      </div>
    </>
  );
}
