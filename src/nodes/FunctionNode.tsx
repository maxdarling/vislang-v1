import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  type NodeProps,
  type Node,
  useReactFlow,
  useNodes,
  NodeResizer,
} from "@xyflow/react";
import { EditableValue } from "../components/EditableValue";
import { ParamNode } from "./ParamNode";
import { ReturnNode } from "./ReturnNode";
import { getCssVar } from "../utils";
import { useFunctionNamespace } from "../FunctionNamespaceContext";

const MIN_PARAMS = 1; // todo: should be 0
const DEFAULT_PARAM_COUNT = 1;

// Dimensions from CSS variables (source of truth in index.css :root)
const DEFAULT_WIDTH = getCssVar("--function-node-default-width", 200);
const DEFAULT_HEIGHT = getCssVar("--function-node-default-height", 150);
const MIN_WIDTH = getCssVar("--function-node-min-width", 150);
const MIN_HEIGHT = getCssVar("--function-node-min-height", 100);
const RETURN_NODE_SIZE = getCssVar("--return-node-size", 50);
const PARAM_NODE_SIZE = getCssVar("--param-node-size", 50);

type FunctionNodeData = { name?: string; paramCount?: number };
type FunctionNodeType = Node<FunctionNodeData, "function">;

// Helper to generate param node IDs for a given function node
export function getParamNodeId(functionNodeId: string, index: number) {
  return `${functionNodeId}-param-${index}`;
}

// Helper to generate the return node ID for a given function node
export function getReturnNodeId(functionNodeId: string) {
  return `${functionNodeId}-return`;
}

const DEFAULT_NAME = "function";

// Helper to calculate Y position for a param node at a given index
function getParamNodeY(
  index: number,
  paramCount: number,
  containerHeight: number,
) {
  // Distribute evenly, similar to how handles were positioned
  const spacing = containerHeight / (paramCount + 1);
  return spacing * (index + 1) - PARAM_NODE_SIZE / 2;
}

// 'useNodes' performance note:
// - useNodes will cause rerender on any node change, incl select or drag. this is suboptimal as intersection only
// depends on 1. node create/delete (e.g. inside the boundary) and 2. dragging nodes.
// - separate but useful optimization: once we multiplex flows/views, use 'useStore' to select only the relevant subset
// (i.e. the current "workspace", etc.)
export function FunctionNode({
  id,
  data,
  selected,
}: NodeProps<FunctionNodeType>) {
  const { getIntersectingNodes, updateNodeData, setNodes, getNode } =
    useReactFlow();
  const allNodes = useNodes();
  const hasSpawnedChildNodes = useRef(false);
  const { register, unregister } = useFunctionNamespace();

  // Keep the global namespace in sync with this node's name
  useEffect(() => {
    const name = data?.name ?? DEFAULT_NAME;
    register(name, id);
    return () => {
      unregister(name, id);
    };
  }, [data?.name, id, register, unregister]);

  const paramCount = Math.max(
    MIN_PARAMS,
    data?.paramCount ?? DEFAULT_PARAM_COUNT,
  );

  // Spawn child ReturnNode and initial ParamNodes on mount
  useEffect(() => {
    if (hasSpawnedChildNodes.current) return;
    hasSpawnedChildNodes.current = true;

    const returnNodeId = getReturnNodeId(id);
    const nodesToAdd: Node[] = [];

    // Add ReturnNode if not exists
    if (!getNode(returnNodeId)) {
      nodesToAdd.push({
        id: returnNodeId,
        type: ReturnNode.type,
        position: {
          x: DEFAULT_WIDTH - RETURN_NODE_SIZE,
          y: DEFAULT_HEIGHT / 2 - RETURN_NODE_SIZE / 2,
        },
        data: {},
        parentId: id,
        extent: "parent" as const,
      });
    }

    // Add initial ParamNodes
    for (let i = 0; i < DEFAULT_PARAM_COUNT; i++) {
      const paramNodeId = getParamNodeId(id, i);
      if (!getNode(paramNodeId)) {
        nodesToAdd.push({
          id: paramNodeId,
          type: ParamNode.type,
          position: {
            x: 0,
            y: getParamNodeY(i, DEFAULT_PARAM_COUNT, DEFAULT_HEIGHT),
          },
          data: { name: `p${i}` },
          parentId: id,
          extent: "parent" as const,
        });
      }
    }

    if (nodesToAdd.length > 0) {
      setNodes((nodes) => [...nodes, ...nodesToAdd]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const intersectionCount = useMemo(() => {
    // Do NOT pass allNodes as the 3rd argument: when nodes have a parentId (param/return), their
    // user-facing `position` is parent-relative. Passing allNodes makes React Flow use those
    // relative positions for the rect comparison, while the function node's rect is in absolute
    // coordinates → wrong coordinate space → intersection math fails.
    // Without the 3rd arg, React Flow uses internalNode which has positionAbsolute (correct).
    // allNodes stays in the deps array only to re-trigger this memo when nodes change.
    void allNodes;
    return getIntersectingNodes({ id: id }, true).length;
  }, [allNodes, getIntersectingNodes, id]);

  const onValueChange = useCallback(
    (name: string) => {
      updateNodeData(id, { name: name || undefined });
    },
    [id, updateNodeData],
  );

  const incrementParams = useCallback(() => {
    const newIndex = paramCount;
    const newParamCount = paramCount + 1;
    const paramNodeId = getParamNodeId(id, newIndex);

    // Add new ParamNode
    setNodes((nodes) => [
      ...nodes,
      {
        id: paramNodeId,
        type: ParamNode.type,
        position: {
          x: 0,
          y: getParamNodeY(newIndex, newParamCount, DEFAULT_HEIGHT),
        },
        data: { name: `p${newIndex}` },
        parentId: id,
        extent: "parent" as const,
      },
    ]);

    // Update param count in data
    updateNodeData(id, { paramCount: newParamCount });
  }, [id, paramCount, setNodes, updateNodeData]);

  const decrementParams = useCallback(() => {
    if (paramCount <= MIN_PARAMS) return;

    const removeIndex = paramCount - 1;
    const paramNodeId = getParamNodeId(id, removeIndex);

    // Remove the last ParamNode
    setNodes((nodes) => nodes.filter((n) => n.id !== paramNodeId));

    // Update param count in data
    updateNodeData(id, { paramCount: paramCount - 1 });
  }, [id, paramCount, setNodes, updateNodeData]);

  return (
    <>
      <NodeResizer
        color="#ff0071"
        isVisible={selected}
        minWidth={MIN_WIDTH}
        minHeight={MIN_HEIGHT}
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
    </>
  );
}

FunctionNode.type = "function" as const;
