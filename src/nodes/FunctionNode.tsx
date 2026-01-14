import { useEffect, useState, useMemo } from "react";
import {
  type NodeProps,
  type Node,
  useReactFlow,
  useNodes,
  NodeResizer,
} from "@xyflow/react";

type FunctionNodeData = {};
type FunctionNode = Node<FunctionNodeData, "function">;

// notes:
// - useNodes will cause rerender on any node change, incl select or drag. this suboptimal. we just want create + drag.
//  - however, separately defining functions in their own flow tab alleviates the issue
//  - note: we are already seeing this. open console and drag resizeable corner around and repeatedly encircle diff amts of nodes
//    depth will exceed in a couple of seconds (although no functional issues). (note: can't repro when dragging node itself)
//
export function FunctionNode({ id, selected }: NodeProps<FunctionNode>) {
  const { getIntersectingNodes } = useReactFlow();
  const allNodes = useNodes();
  const [intersectionCount, setIntersectionCount] = useState(0);

  // Find the current node in the nodes array to get its full properties
  const currentNode = useMemo(() => {
    return allNodes.find((node) => node.id === id);
  }, [id, allNodes]);

  // Recalculate intersections whenever:
  // - The function node's position/size changes
  // - Any node in the flow changes (moves, added, removed)
  useEffect(() => {
    if (!currentNode) return;

    const intersectingNodes = getIntersectingNodes(currentNode);
    // Exclude self from the count
    const count = intersectingNodes.filter((node) => node.id !== id).length;
    setIntersectionCount(count);
  }, [id, currentNode, getIntersectingNodes, allNodes]);

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
