import { Handle, Position } from "@xyflow/react";
import CustomHandle from "../handles/CustomHandle";

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

export function IfNode() {
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
