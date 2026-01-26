import { useMemo } from "react";
import {
  type NodeProps,
  type Node,
  useReactFlow,
  useNodes,
  NodeResizer,
} from "@xyflow/react";

type FunctionNodeData = {};
type FunctionNode = Node<FunctionNodeData, "function">;

// 'useNodes' performance note:
// - useNodes will cause rerender on any node change, incl select or drag. this is suboptimal as intersection only
// depends on 1. node create/delete (e.g. inside the boundary) and 2. dragging nodes.
// - separate but useful optimization: once we multiplex flows, use 'useStore' to select only the relevant subset
// (i.e. the current "workspace", etc.)
export function FunctionNode({ id, selected }: NodeProps<FunctionNode>) {
  const { getIntersectingNodes } = useReactFlow();
  const allNodes = useNodes();

  const intersectionCount = getIntersectingNodes(
    { id: id },
    true,
    allNodes,
  ).length;

  return (
    <>
      <NodeResizer
        color="#ff0071"
        isVisible={selected}
        minWidth={150}
        minHeight={100}
      />
      <div className="react-flow__node-default node-function">
        <div className="function-label">FUNCTION</div>
        <div className="function-count">{intersectionCount}</div>
        <div className="function-unit">
          {intersectionCount === 1 ? "node" : "nodes"}
        </div>
      </div>
    </>
  );
}

FunctionNode.type = "function" as const;
