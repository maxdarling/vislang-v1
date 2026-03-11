import { useEffect, useMemo } from "react";
import {
  Handle,
  Position,
  useNodeConnections,
  useNodesData,
  useReactFlow,
  type NodeProps,
  type Node,
} from "@xyflow/react";
import CustomHandle from "../handles/CustomHandle";

type IfNodeData = { val?: number };
type IfNodeType = Node<IfNodeData, "if">;

const INPUTS = [
  { id: "p", label: "p" },
  { id: "a", label: "A" },
  { id: "b", label: "B" },
] as const;

const ROW_HEIGHT = 24;
const PADDING_V = 6;
const NODE_HEIGHT = PADDING_V * 2 + INPUTS.length * ROW_HEIGHT;

function getHandleTop(index: number): number {
  return PADDING_V + index * ROW_HEIGHT + ROW_HEIGHT / 2;
}

export function IfNode({ id }: NodeProps<IfNodeType>) {
  const { updateNodeData } = useReactFlow();

  const pConns = useNodeConnections({ handleType: "target", handleId: "p" });
  const aConns = useNodeConnections({ handleType: "target", handleId: "a" });
  const bConns = useNodeConnections({ handleType: "target", handleId: "b" });

  const pData = useNodesData(pConns[0]?.source ? [pConns[0].source] : []);
  const aData = useNodesData(aConns[0]?.source ? [aConns[0].source] : []);
  const bData = useNodesData(bConns[0]?.source ? [bConns[0].source] : []);

  const value = useMemo(() => {
    const p = (pData[0]?.data as { val?: number })?.val;
    const a = (aData[0]?.data as { val?: number })?.val;
    const b = (bData[0]?.data as { val?: number })?.val;
    if (p === undefined) return undefined;
    return p !== 0 ? a : b;
  }, [pData, aData, bData]);

  useEffect(() => {
    updateNodeData(id, { val: value });
  }, [id, value, updateNodeData]);

  return (
    <div className="if-node" style={{ height: NODE_HEIGHT }}>
      <div className="if-node-inputs">
        {INPUTS.map((input) => (
          <div
            key={input.id}
            className="if-node-row"
            style={{ height: ROW_HEIGHT }}
          >
            <span className="if-node-label">{input.label}</span>
          </div>
        ))}
      </div>
      <div className="if-node-value">{value !== undefined ? value : "—"}</div>

      {INPUTS.map((input, i) => (
        <CustomHandle
          key={input.id}
          type="target"
          position={Position.Left}
          id={input.id}
          maxConnections={1}
          style={{ top: getHandleTop(i) }}
        />
      ))}
      <Handle
        type="source"
        position={Position.Right}
        style={{ top: NODE_HEIGHT / 2 }}
      />
    </div>
  );
}

IfNode.type = "if" as const;
