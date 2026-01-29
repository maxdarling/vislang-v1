import { useCallback, useMemo } from "react";
import {
  Handle,
  Position,
  type NodeProps,
  type Node,
  useReactFlow,
  useNodes,
  NodeResizer,
} from "@xyflow/react";
import { EditableValue } from "../components/EditableValue";

const MIN_PARAMS = 1; // todo: should be 0
const DEFAULT_PARAM_COUNT = 1;

type FunctionNodeData = { name?: string; paramCount?: number };
type FunctionNodeType = Node<FunctionNodeData, "function">;

function inputHandleId(index: number) {
  return `input-${index}`;
}
const OUTPUT_HANDLE_ID = "output-0";

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

  const paramCount = Math.max(
    MIN_PARAMS,
    data?.paramCount ?? DEFAULT_PARAM_COUNT,
  );

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

  const setParamCount = useCallback(
    (next: number) => {
      const clamped = Math.max(MIN_PARAMS, next);
      updateNodeData(id, { paramCount: clamped });
    },
    [id, updateNodeData],
  );

  const decrementParams = useCallback(
    () => setParamCount(paramCount - 1),
    [paramCount, setParamCount],
  );
  const incrementParams = useCallback(
    () => setParamCount(paramCount + 1),
    [paramCount, setParamCount],
  );

  return (
    <>
      {Array.from({ length: paramCount }, (_, i) => (
        <Handle
          key={inputHandleId(i)}
          id={inputHandleId(i)}
          type="target"
          position={Position.Left}
          isConnectable={true}
          style={{
            top: `${((i + 1) / (paramCount + 1)) * 100}%`,
          }}
        />
      ))}
      <NodeResizer
        color="#ff0071"
        isVisible={selected}
        minWidth={150}
        minHeight={100}
      />
      <div className="function-node-wrapper">
        <div className="function-node-header">
          <div className="function-node-name-row">
            <EditableValue<string>
              initialValue={data?.name ?? DEFAULT_NAME}
              onValueChange={onValueChange}
              onInitialSync={onValueChange}
              parse={(s) => s}
              format={(v) => v}
              defaultDisplay={DEFAULT_NAME}
              inputClassName="function-node-name-input"
              labelClassName="function-node-name-label"
              inputAriaLabel="Function name"
            />
            <span className="function-node-intersection-count">{`(${intersectionCount} nodes)`}</span>
          </div>
          <div className="function-node-params-row">
            <span className="function-node-params-label">params:</span>
            <button
              type="button"
              className="function-node-params-btn"
              onClick={decrementParams}
              disabled={paramCount <= MIN_PARAMS}
              aria-label="Remove parameter"
            >
              −
            </button>
            <span className="function-node-param-count">{paramCount}</span>
            <button
              type="button"
              className="function-node-params-btn"
              onClick={incrementParams}
              aria-label="Add parameter"
            >
              +
            </button>
          </div>
        </div>
        <div className="react-flow__node-default node-function"></div>
      </div>
      <Handle
        id={OUTPUT_HANDLE_ID}
        type="source"
        position={Position.Right}
        isConnectable={true}
      />
    </>
  );
}

FunctionNode.type = "function" as const;
