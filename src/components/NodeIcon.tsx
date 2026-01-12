import { nodeTypes } from "../App";
import { AddNode } from "../nodes/arith/AddNode";
import { SubNode } from "../nodes/arith/SubNode";
import { MulNode } from "../nodes/arith/MulNode";
import { DivNode } from "../nodes/arith/DivNode";
import { DataNode } from "../nodes/DataNode";
import { DisplayNode } from "../nodes/DisplayNode";

type NodeIconProps = {
  type: (typeof nodeTypes)[number]["type"];
  size?: number;
};

export function NodeIcon({ type, size = 50 }: NodeIconProps) {
  const viewBox = "0 0 50 50";
  const borderRadius = 4; // For rounded rectangles

  switch (type) {
    case DataNode.type:
      // Circle - matches the circular data node
      return (
        <svg
          width={size}
          height={size}
          viewBox={viewBox}
          className={`node-icon node-icon-${type}`}
        >
          <circle cx="25" cy="25" r="25" />
          <text
            x="25"
            y="25"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize="16"
            fontWeight="bold"
          >
            {DataNode.defaultVal}
          </text>
        </svg>
      );

    case AddNode.type:
      // Rounded square with plus sign
      return (
        <svg
          width={size}
          height={size}
          viewBox={viewBox}
          className={`node-icon node-icon-${type}`}
        >
          <rect x="0" y="0" width="50" height="50" rx={borderRadius} />
          <path
            d="M25 15v20M15 25h20"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      );

    case SubNode.type:
      // Rounded square with minus sign
      return (
        <svg
          width={size}
          height={size}
          viewBox={viewBox}
          className={`node-icon node-icon-${type}`}
        >
          <rect x="0" y="0" width="50" height="50" rx={borderRadius} />
          <path
            d="M15 25h20"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      );

    case MulNode.type:
      // Rounded square with X
      return (
        <svg
          width={size}
          height={size}
          viewBox={viewBox}
          className={`node-icon node-icon-${type}`}
        >
          <rect x="0" y="0" width="50" height="50" rx={borderRadius} />
          <path
            d="M15 15l20 20M35 15l-20 20"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      );

    case DivNode.type:
      // Rounded square with division symbol
      return (
        <svg
          width={size}
          height={size}
          viewBox={viewBox}
          className={`node-icon node-icon-${type}`}
        >
          <rect x="0" y="0" width="50" height="50" rx={borderRadius} />
          <circle cx="25" cy="15" r="3" fill="white" />
          <path
            d="M15 25h20"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="25" cy="35" r="3" fill="white" />
        </svg>
      );

    case DisplayNode.type:
      // Rounded square with DISP text
      return (
        <svg
          width={size}
          height={size}
          viewBox={viewBox}
          className={`node-icon node-icon-${type}`}
        >
          <rect x="0" y="0" width="50" height="50" rx={borderRadius} />
          <text
            x="25"
            y="25"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize="10"
            fontWeight="bold"
          >
            DISP
          </text>
        </svg>
      );

    default:
      return null;
  }
}
