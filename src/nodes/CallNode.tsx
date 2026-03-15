import React, { useCallback, useEffect, useRef } from "react";
import {
  Handle,
  Position,
  type NodeProps,
  type Node,
  useReactFlow,
  useUpdateNodeInternals,
} from "@xyflow/react";
import { useFunctionNamespace } from "../FunctionNamespaceContext";
import CustomHandle from "../handles/CustomHandle";

type CallNodeData = { functionNodeId?: string };
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
  const { updateNodeData, setEdges } = useReactFlow();
  const updateNodeInternals = useUpdateNodeInternals();
  const { namespace } = useFunctionNamespace();

  const selectedFunctionNodeId = data?.functionNodeId;

  const fnEntry = selectedFunctionNodeId
    ? namespace[selectedFunctionNodeId]
    : undefined;
  const selectedFunctionName = fnEntry?.name;
  const paramNames = fnEntry?.paramNames ?? [];
  const paramCount = paramNames.length;

  // We must notify React Flow when dynamically changing handles.
  // Subtlety: Don't do this on mount, or else it messes with the view.
  const prevParamsLength = useRef<number | null>(null);
  useEffect(() => {
    const prev = prevParamsLength.current;
    prevParamsLength.current = paramCount;
    if (prev === null || prev === paramCount) return;
    updateNodeInternals(id);

    // Remove edges targeting handles that no longer exist
    if (paramCount < (prev ?? 0)) {
      setEdges((edges) =>
        edges.filter((e) => {
          if (e.target !== id || !e.targetHandle) return true;
          const idx = parseInt(e.targetHandle.split("-")[1] ?? "0", 10);
          return idx < paramCount;
        }),
      );
    }
  }, [id, paramCount, updateNodeInternals, setEdges]);

  const onFunctionSelect = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      updateNodeData(id, { functionNodeId: e.target.value || undefined });
    },
    [id, updateNodeData],
  );

  const namespaceEntries = Object.entries(namespace);
  const nodeHeight = getCallNodeHeight(paramCount);

  return (
    <div className="call-node" style={{ height: nodeHeight }}>
      {/* Header: function selector + run button */}
      <div className="call-node-header">
        <select
          value={selectedFunctionNodeId ?? ""}
          onChange={onFunctionSelect}
          className="call-node-select nodrag"
          title="Select function"
        >
          <option value="">— select —</option>
          {namespaceEntries.map(([nodeId, entry]) => (
            <option key={nodeId} value={nodeId}>
              {entry.name}
            </option>
          ))}
        </select>
      </div>

      {/* Body: param labels + return value */}
      <div className="call-node-body">
        {paramCount === 0 ? (
          <div className="call-node-empty">
            {selectedFunctionName ? "no params" : "no func"}
          </div>
        ) : (
          paramNames.map((name, index) => (
            <div key={index} className="call-node-param-row">
              <span className="call-node-param-label">{name}</span>
            </div>
          ))
        )}
      </div>

      {/* One input handle per param, aligned with its label row */}
      {paramNames.map((_, index) => (
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
