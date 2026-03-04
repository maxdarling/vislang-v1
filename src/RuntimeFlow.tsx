import { ReactFlow, Background, Controls } from "@xyflow/react";
import { useRuntime } from "./RuntimeContext";
import { reactFlowNodeTypes } from "./nodeRegistry";

export function RuntimeFlow() {
  const {
    runtimeNodes,
    runtimeEdges,
    onRuntimeNodesChange,
    onRuntimeEdgesChange,
  } = useRuntime();

  return (
    <div className="runtime-flow-wrapper">
      <ReactFlow
        nodes={runtimeNodes}
        edges={runtimeEdges}
        onNodesChange={onRuntimeNodesChange}
        onEdgesChange={onRuntimeEdgesChange}
        nodeTypes={reactFlowNodeTypes}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
