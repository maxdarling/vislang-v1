App.jsx

```js
import { useCallback } from "react";
import {
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import NumberInput from "./NumberInput";
import ColorPreview from "./ColorPreview";

const nodeTypes = {
  NumberInput,
  ColorPreview,
};

const initialNodes = [
  {
    type: "NumberInput",
    id: "1",
    data: { label: "Red", value: 255 },
    position: { x: 0, y: 0 },
  },
  {
    type: "NumberInput",
    id: "2",
    data: { label: "Green", value: 0 },
    position: { x: 0, y: 100 },
  },
  {
    type: "NumberInput",
    id: "3",
    data: { label: "Blue", value: 115 },
    position: { x: 0, y: 200 },
  },
  {
    type: "ColorPreview",
    id: "color",
    position: { x: 150, y: 50 },
    data: { label: "Color" },
  },
];

const initialEdges = [
  {
    id: "1-color",
    source: "1",
    target: "color",
    targetHandle: "red",
  },
  {
    id: "2-color",
    source: "2",
    target: "color",
    targetHandle: "green",
  },
  {
    id: "3-color",
    source: "3",
    target: "color",
    targetHandle: "blue",
  },
];

function ReactiveFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [],
  );
  return (
    <ReactFlow
      nodeTypes={nodeTypes}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
    >
      <Background />
    </ReactFlow>
  );
}

export default ReactiveFlow;
```

ColorPreview.jsx

```js
import {
  Handle,
  Position,
  useNodesData,
  useNodeConnections,
} from "@xyflow/react";

function ColorPreview() {
  const redConnections = useNodeConnections({
    handleType: "target",
    handleId: "red",
  });
  const redNodeData = useNodesData(redConnections?.[0].source);

  const greenConnections = useNodeConnections({
    handleType: "target",
    handleId: "green",
  });
  const greenNodeData = useNodesData(greenConnections?.[0].source);

  const blueConnections = useNodeConnections({
    handleType: "target",
    handleId: "blue",
  });
  const blueNodeData = useNodesData(blueConnections?.[0].source);

  const color = {
    r: redNodeData?.data ? redNodeData.data.value : 0,
    g: greenNodeData?.data ? greenNodeData.data.value : 0,
    b: blueNodeData?.data ? blueNodeData.data.value : 0,
  };

  return (
    <div
      className="node"
      style={{
        background: `rgb(${color.r}, ${color.g}, ${color.b})`,
      }}
    >
      <div>
        <Handle
          type="target"
          position={Position.Left}
          id="red"
          className="handle"
        />
        <label htmlFor="red" className="label">
          R
        </label>
      </div>
      <div>
        <Handle
          type="target"
          position={Position.Left}
          id="green"
          className="handle"
        />
        <label htmlFor="green" className="label">
          G
        </label>
      </div>
      <div>
        <Handle
          type="target"
          position={Position.Left}
          id="blue"
          className="handle"
        />
        <label htmlFor="red" className="label">
          B
        </label>
      </div>
    </div>
  );
}

export default ColorPreview;
```

NumberInput.jsx

```js
import { useCallback, useState } from "react";
import { Handle, Position, useReactFlow } from "@xyflow/react";

function NumberInput({ id, data }) {
  const { updateNodeData } = useReactFlow();
  const [number, setNumber] = useState(data.value);

  const onChange = useCallback((evt) => {
    const cappedNumber = Math.min(255, Math.max(0, evt.target.value));
    setNumber(cappedNumber);
    updateNodeData(id, { value: cappedNumber });
  }, []);

  return (
    <div className="number-input">
      <div>{data.label}</div>
      <input
        id={`number-${id}`}
        name="number"
        type="number"
        min="0"
        max="255"
        onChange={onChange}
        className="nodrag"
        value={number}
      />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

export default NumberInput;
```
