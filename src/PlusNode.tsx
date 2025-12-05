import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";

type PlusNodeData = {
  label?: string;
};

export function PlusNode({ data }: NodeProps<Node<PlusNodeData, "plus">>) {
  // You can use the label from data, or set a default

  function calcData() {
    // look at incoming edges to determine input nodes. look at their data. take that as args and compute func
  }

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
        +
      </div>
      <Handle type="source" position={Position.Right} isConnectable={true} />
    </>
  );
}
