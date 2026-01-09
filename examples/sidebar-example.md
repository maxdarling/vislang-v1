https://reactflow.dev/examples/interaction/drag-and-drop

App.jsx
```jsx
import React, { useRef, useCallback } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  useReactFlow,
  Background,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

import Sidebar from './Sidebar';
import { DnDProvider, useDnD } from './DnDContext';

const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'input node' },
    position: { x: 250, y: 5 },
  },
];

let id = 0;
const getId = () => `dndnode_${id++}`;

const DnDFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();
  const [type] = useDnD();

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      // check if the dropped element is valid
      if (!type) {
        return;
      }

      // project was renamed to screenToFlowPosition
      // and you don't need to subtract the reactFlowBounds.left/top anymore
      // details: https://reactflow.dev/whats-new/2023-11-10
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, type],
  );

  const onDragStart = (event, nodeType) => {
    setType(nodeType);
    event.dataTransfer.setData('text/plain', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="dndflow">
      <div className="reactflow-wrapper" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          fitView
        >
          <Controls />
          <Background />
        </ReactFlow>
      </div>
      <Sidebar />
    </div>
  );
};

export default () => (
  <ReactFlowProvider>
    <DnDProvider>
      <DnDFlow />
    </DnDProvider>
  </ReactFlowProvider>
);
```

DnDContext.jsx
```jsx
import { createContext, useContext, useState } from 'react';

const DnDContext = createContext([null, (_) => {}]);

export const DnDProvider = ({ children }) => {
  const [type, setType] = useState(null);

  return (
    <DnDContext.Provider value={[type, setType]}>
      {children}
    </DnDContext.Provider>
  );
}

export default DnDContext;

export const useDnD = () => {
  return useContext(DnDContext);
}
```

Sidebar.jsx
```jsx
import React from 'react';
import { useDnD } from './DnDContext';

export default () => {
  const [_, setType] = useDnD();

  const onDragStart = (event, nodeType) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside>
      <div className="description">You can drag these nodes to the pane on the right.</div>
      <div className="dndnode input" onDragStart={(event) => onDragStart(event, 'input')} draggable>
        Input Node
      </div>
      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'default')} draggable>
        Default Node
      </div>
      <div className="dndnode output" onDragStart={(event) => onDragStart(event, 'output')} draggable>
        Output Node
      </div>
    </aside>
  );
};

```

index.css
```css
@import url('./xy-theme.css');

html,
body {
  margin: 0;
  font-family: sans-serif;
  box-sizing: border-box;
}

#app {
  width: 100vw;
  height: 100vh;
}

.dndflow {
  flex-direction: column;
  display: flex;
  flex-grow: 1;
  height: 100%;
}

.dndflow aside {
  border-right: 1px solid #eee;
  padding: 15px 10px;
  font-size: 12px;
  background: #fcfcfc;
}

.dndflow aside .description {
  margin-bottom: 10px;
}

.dndflow .dndnode {
  height: 20px;
  padding: 4px;
  border: 1px solid #1a192b;
  border-radius: 2px;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: grab;
}

.dndflow .dndnode.input {
  border-color: #0041d0;
}

.dndflow .dndnode.output {
  border-color: #ff0072;
}

.dndflow .reactflow-wrapper {
  flex-grow: 1;
  height: 100%;
}

.dndflow .selectall {
  margin-top: 10px;
}

@media screen and (min-width: 768px) {
  .dndflow {
    flex-direction: row;
  }

  .dndflow aside {
    width: 20%;
    max-width: 250px;
  }
}
```