import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  Background,
  Controls,
  type Node,
  type Edge,
  type Connection,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from "@xyflow/react";
import { loadWorkspaceData, saveWorkspaceData } from "./persistence";
import "@xyflow/react/dist/style.css";
import { FunctionNode } from "./nodes/FunctionNode";
import Sidebar from "./Sidebar";
import { useDnD, DnDProvider } from "./DnDContext";
import { FunctionNamespaceProvider } from "./FunctionNamespaceContext";
import { reactFlowNodeTypes } from "./nodeRegistry";
import { WorkspaceProvider, useWorkspace } from "./WorkspaceContext";
import { LeftSidebar } from "./LeftSidebar";
const getId = () => `n_${Math.random().toString(36).slice(2, 8)}`;

/**
 * Find the first FunctionNode whose bounding box contains the given flow-coordinate
 * point. Returns undefined if the point is not inside any function node.
 */
function findFunctionAtPosition(
  nodes: Node[],
  x: number,
  y: number,
): Node | undefined {
  return nodes.find((n) => {
    if (n.type !== FunctionNode.type) return false;
    const w = n.measured?.width ?? n.width ?? 0;
    const h = n.measured?.height ?? n.height ?? 0;
    return (
      x >= n.position.x &&
      x <= n.position.x + w &&
      y >= n.position.y &&
      y <= n.position.y + h
    );
  });
}

const mainInitialNodes: Node[] = [
  {
    id: "main-fn",
    type: FunctionNode.type,
    position: { x: 0, y: 0 },
    data: { name: "main" },
  },
];

function WorkspaceCanvas({
  workspaceId,
  initialNodes = [],
  initialEdges = [],
}: {
  workspaceId: string;
  initialNodes?: Node[];
  initialEdges?: Edge[];
}) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const persisted = useMemo(
    () => loadWorkspaceData(workspaceId),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(
    persisted?.nodes ?? initialNodes,
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    persisted?.edges ?? initialEdges,
  );

  const { autosave, saveGeneration } = useWorkspace();

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!autosave) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveWorkspaceData(workspaceId, { nodes, edges });
    }, 400);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [nodes, edges, workspaceId, autosave]);

  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);
  nodesRef.current = nodes;
  edgesRef.current = edges;

  useEffect(() => {
    if (saveGeneration === 0) return;
    saveWorkspaceData(workspaceId, {
      nodes: nodesRef.current,
      edges: edgesRef.current,
    });
  }, [saveGeneration, workspaceId]);

  const {
    screenToFlowPosition,
    getIntersectingNodes,
    updateNodeData,
    getNodes,
  } = useReactFlow();
  const [type] = useDnD();

  const highlightedRef = useRef<string | null>(null);

  const setHighlight = useCallback(
    (targetId: string | null) => {
      if (targetId === highlightedRef.current) return;
      if (highlightedRef.current) {
        updateNodeData(highlightedRef.current, { highlighted: false });
      }
      if (targetId) {
        updateNodeData(targetId, { highlighted: true });
      }
      highlightedRef.current = targetId;
    },
    [updateNodeData],
  );

  const clearHighlight = useCallback(() => {
    setHighlight(null);
  }, [setHighlight]);

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [setEdges],
  );

  const onNodeDrag = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      if (node.type === FunctionNode.type) {
        clearHighlight();
        return;
      }
      const intersecting = getIntersectingNodes(node);
      const target = intersecting.find(
        (n) => n.type === FunctionNode.type && n.id !== node.parentId,
      );
      setHighlight(target?.id ?? null);
    },
    [getIntersectingNodes, setHighlight, clearHighlight],
  );

  const onNodeDragStop = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      clearHighlight();

      if (node.type === FunctionNode.type) return;

      const intersecting = getIntersectingNodes(node);
      const target = intersecting.find(
        (n) => n.type === FunctionNode.type && n.id !== node.parentId,
      );

      if (!target) return;

      setNodes((nds) =>
        nds.map((n) => {
          if (n.id !== node.id) return n;
          return {
            ...n,
            position: {
              x: n.position.x - target.position.x,
              y: n.position.y - target.position.y,
            },
            parentId: target.id,
            extent: "parent" as const,
          };
        }),
      );
    },
    [getIntersectingNodes, setNodes, clearHighlight],
  );

  const onDragOver = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const target = findFunctionAtPosition(getNodes(), position.x, position.y);
      setHighlight(target?.id ?? null);
    },
    [screenToFlowPosition, getNodes, setHighlight],
  );

  const onDragLeave = useCallback(() => {
    clearHighlight();
  }, [clearHighlight]);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      clearHighlight();

      if (!type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const target = findFunctionAtPosition(getNodes(), position.x, position.y);

      const newNode: Node = {
        id: getId(),
        type,
        position: target
          ? {
              x: position.x - target.position.x,
              y: position.y - target.position.y,
            }
          : position,
        data: {},
        ...(target && {
          parentId: target.id,
          extent: "parent" as const,
        }),
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, type, setNodes, getNodes, clearHighlight],
  );

  return (
    <div className="reactflow-wrapper" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={reactFlowNodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onNodeDrag={onNodeDrag}
        onNodeDragStop={onNodeDragStop}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

function WorkspaceArea() {
  const { workspaces, activeId } = useWorkspace();

  return (
    <div className="workspace-area">
      {workspaces.map((ws) => (
        <div
          key={ws.id}
          className={`workspace-panel${ws.id !== activeId ? " hidden" : ""}`}
        >
          <ReactFlowProvider>
            <WorkspaceCanvas
              workspaceId={ws.id}
              initialNodes={
                ws.isMain ? mainInitialNodes : (ws.initialNodes ?? [])
              }
              initialEdges={ws.initialEdges ?? []}
            />
          </ReactFlowProvider>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  return (
    <WorkspaceProvider>
      <FunctionNamespaceProvider>
        <DnDProvider>
          <div className="app-layout">
            <LeftSidebar />
            <div className="dndflow">
              <WorkspaceArea />
              <Sidebar />
            </div>
          </div>
        </DnDProvider>
      </FunctionNamespaceProvider>
    </WorkspaceProvider>
  );
}
