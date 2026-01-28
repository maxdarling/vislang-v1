import { useCallback, useMemo } from "react";
import {
  type NodeProps,
  type Node,
  useReactFlow,
  useNodes,
  NodeResizer,
} from "@xyflow/react";
import { EditableValue } from "../components/EditableValue";

type FunctionNodeData = { name?: string };
type FunctionNodeType = Node<FunctionNodeData, "function">;

// 'useNodes' performance note:
// - useNodes will cause rerender on any node change, incl select or drag. this is suboptimal as intersection only
// depends on 1. node create/delete (e.g. inside the boundary) and 2. dragging nodes.
// - separate but useful optimization: once we multiplex flows/views, use 'useStore' to select only the relevant subset
// (i.e. the current "workspace", etc.)

const DEFAULT_NAME = "function";

export function FunctionNode({
  id,
  data,
  selected,
}: NodeProps<FunctionNodeType>) {
  const { getIntersectingNodes, updateNodeData } = useReactFlow();
  const allNodes = useNodes();

  const intersectionCount = useMemo(() => {
    return getIntersectingNodes({ id: id }, true, allNodes).length;
    // note: isMemo has ~no benefit here since allNodes will have been changed on ~every render.
  }, [allNodes, getIntersectingNodes, id]);

  const onValueChange = useCallback(
    (name: string) => {
      updateNodeData(id, { name: name || undefined });
    },
    [id, updateNodeData],
  );

  const onInitialSync = useCallback(
    (name: string) => {
      updateNodeData(id, { name: name || undefined });
    },
    [id, updateNodeData],
  );

  return (
    <>
      <NodeResizer
        color="#ff0071"
        isVisible={selected}
        minWidth={150}
        minHeight={100}
      />
      <div className="function-node-wrapper">
        <div className="function-node-name-row">
          <EditableValue<string>
            initialValue={data?.name ?? DEFAULT_NAME}
            onValueChange={onValueChange}
            onInitialSync={onInitialSync}
            parse={(s) => s}
            format={(v) => v}
            defaultDisplay={DEFAULT_NAME}
            inputClassName="function-node-name-input"
            labelClassName="function-node-name-label"
            inputAriaLabel="Function name"
          />
          <span className="function-node-intersection-count">{`(${intersectionCount} nodes)`}</span>
        </div>
        <div className="react-flow__node-default node-function"></div>
      </div>
    </>
  );
}

FunctionNode.type = "function" as const;
