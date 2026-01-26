import {
  type NodeProps,
  type Node,
  useReactFlow,
  useNodes,
  NodeResizer,
} from "@xyflow/react";
import { useMemo } from "react";

type FunctionNodeData = Record<string, never>;
type FunctionNodeType = Node<FunctionNodeData, "function">;

// 'useNodes' performance note:
// - useNodes will cause rerender on any node change, incl select or drag. this is suboptimal as intersection only
// depends on 1. node create/delete (e.g. inside the boundary) and 2. dragging nodes.
// - separate but useful optimization: once we multiplex flows/views, use 'useStore' to select only the relevant subset
// (i.e. the current "workspace", etc.)
export function FunctionNode({ id, selected }: NodeProps<FunctionNodeType>) {
  const { getIntersectingNodes } = useReactFlow();
  const allNodes = useNodes();

  const intersectionCount = useMemo(() => {
    return getIntersectingNodes({ id: id }, true, allNodes).length;
    // note: isMemo has ~no benefit here since allNodes will have been changed on ~every render.
  }, [allNodes, getIntersectingNodes, id]);

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
