import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  Handle,
  Position,
  type NodeProps,
  type Node,
  useReactFlow,
  useNodes,
  useUpdateNodeInternals,
} from "@xyflow/react";
import { useFunctionNamespace } from "../FunctionNamespaceContext";
import { ParamNode } from "./ParamNode";
import CustomHandle from "../handles/CustomHandle";

type CallNodeData = { functionName?: string };
type CallNodeType = Node<CallNodeData, "call">;

// Layout constants (pixels)
const CALL_NODE_HEADER_HEIGHT = 36;
const CALL_NODE_BODY_PADDING_V = 8;
const CALL_NODE_ROW_HEIGHT = 24;

function getCallNodeHeight(paramCount: number): number {
  return (
    CALL_NODE_HEADER_HEIGHT +
    CALL_NODE_BODY_PADDING_V * 2 +
    Math.max(paramCount, 1) * CALL_NODE_ROW_HEIGHT
  );
}

// Vertical center of the handle for param at `index` (px from top of node)
function getParamHandleTop(index: number): number {
  return (
    CALL_NODE_HEADER_HEIGHT +
    CALL_NODE_BODY_PADDING_V +
    index * CALL_NODE_ROW_HEIGHT +
    CALL_NODE_ROW_HEIGHT / 2
  );
}

export function CallNode({ id, data }: NodeProps<CallNodeType>) {
  const { updateNodeData } = useReactFlow();
  const updateNodeInternals = useUpdateNodeInternals();
  const { namespace } = useFunctionNamespace();
  const allNodes = useNodes();

  const selectedFunctionName = data?.functionName;
  const selectedFunctionNodeId = selectedFunctionName
    ? namespace[selectedFunctionName]
    : undefined;

  // Collect + sort param nodes belonging to the selected function
  const params = useMemo(() => {
    if (!selectedFunctionNodeId) return [];
    return allNodes
      .filter(
        (n) =>
          n.parentId === selectedFunctionNodeId && n.type === ParamNode.type,
      )
      .sort((a, b) => {
        const idxA = parseInt(a.id.split("-param-")[1] ?? "0", 10);
        const idxB = parseInt(b.id.split("-param-")[1] ?? "0", 10);
        return idxA - idxB;
      });
  }, [allNodes, selectedFunctionNodeId]);

  // We must notify React Flow when dynamically changing handles.
  // Subtlety: Don't do this on mount, or else it messes with the view.
  const prevParamsLength = useRef<number | null>(null);
  useEffect(() => {
    const prev = prevParamsLength.current;
    prevParamsLength.current = params.length;
    if (prev === null || prev === params.length) return;
    updateNodeInternals(id);
  }, [id, params.length, updateNodeInternals]);

  const onFunctionSelect = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      updateNodeData(id, { functionName: e.target.value || undefined });
    },
    [id, updateNodeData],
  );

  const functionNames = Object.keys(namespace);
  const nodeHeight = getCallNodeHeight(params.length);

  return (
    <div className="call-node" style={{ height: nodeHeight }}>
      {/* Header: function selector */}
      <div className="call-node-header">
        <select
          value={selectedFunctionName ?? ""}
          onChange={onFunctionSelect}
          className="call-node-select nodrag"
          title="Select function"
        >
          <option value="">— select —</option>
          {functionNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {/* Body: param labels */}
      <div className="call-node-body">
        {params.length === 0 ? (
          <div className="call-node-empty">
            {selectedFunctionName ? "no params" : "no func"}
          </div>
        ) : (
          params.map((paramNode, index) => (
            <div key={paramNode.id} className="call-node-param-row">
              <span className="call-node-param-label">
                {(paramNode.data as { name?: string })?.name ?? `p${index}`}
              </span>
            </div>
          ))
        )}
      </div>

      {/* One input handle per param, aligned with its label row */}
      {params.map((_, index) => (
        <CustomHandle
          key={`param-${index}`}
          type="target"
          position={Position.Left}
          maxConnections={1}
          id={`param-${index}`}
          style={{ top: getParamHandleTop(index) }}
        />
      ))}

      {/* Single output handle, centered on the right */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        style={{ top: nodeHeight / 2 }}
      />
    </div>
  );
}

CallNode.type = "call" as const;
