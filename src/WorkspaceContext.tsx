import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Node, Edge } from "@xyflow/react";
import { exampleNodes, exampleEdges } from "./exampleNodes";
import {
  loadWorkspaceList,
  saveWorkspaceList,
  loadActiveId,
  saveActiveId,
  loadAutosave,
  saveAutosave,
} from "./persistence";

export interface Workspace {
  id: string;
  name: string;
  isMain: boolean;
  paramCount: number;
  initialNodes?: Node[];
  initialEdges?: Edge[];
}

interface WorkspaceContextValue {
  workspaces: Workspace[];
  activeId: string;
  setActiveId: (id: string) => void;
  addWorkspace: () => void;
  renameWorkspace: (id: string, name: string) => void;
  removeWorkspace: (id: string) => void;
  setParamCount: (id: string, count: number) => void;
  autosave: boolean;
  setAutosave: (on: boolean) => void;
  saveGeneration: number;
  triggerSave: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextValue>({
  workspaces: [],
  activeId: "main",
  setActiveId: () => {},
  addWorkspace: () => {},
  renameWorkspace: () => {},
  removeWorkspace: () => {},
  setParamCount: () => {},
  autosave: false,
  setAutosave: () => {},
  saveGeneration: 0,
  triggerSave: () => {},
});

let wsCounter = 0;

const defaultWorkspaces: Workspace[] = [
  { id: "main", name: "Main", isMain: true, paramCount: 0 },
  {
    id: "example1",
    name: "Example 1",
    isMain: false,
    paramCount: 0,
    initialNodes: exampleNodes,
    initialEdges: exampleEdges,
  },
];

function initWorkspaces(): Workspace[] {
  const persisted = loadWorkspaceList();
  if (persisted) {
    persisted.forEach((ws) => {
      const match = ws.id.match(/^ws_(\d+)$/);
      if (match) wsCounter = Math.max(wsCounter, parseInt(match[1]));
    });
    return persisted.map((ws) => {
      if (ws.id === "example1") {
        return {
          ...ws,
          initialNodes: exampleNodes,
          initialEdges: exampleEdges,
        };
      }
      return ws;
    });
  }
  return defaultWorkspaces;
}

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(initWorkspaces);
  const [activeId, setActiveIdState] = useState<string>(
    () => loadActiveId() ?? "example1",
  );

  useEffect(() => {
    saveWorkspaceList(
      workspaces.map(({ id, name, isMain, paramCount }) => ({
        id,
        name,
        isMain,
        paramCount,
      })),
    );
  }, [workspaces]);

  const setActiveId = useCallback((id: string) => {
    setActiveIdState(id);
    saveActiveId(id);
  }, []);

  const addWorkspace = useCallback(() => {
    wsCounter += 1;
    const id = `ws_${wsCounter}`;
    setWorkspaces((prev) => [
      ...prev,
      { id, name: `func_${wsCounter}`, isMain: false, paramCount: 0 },
    ]);
    setActiveId(id);
  }, [setActiveId]);

  const renameWorkspace = useCallback((id: string, name: string) => {
    setWorkspaces((prev) =>
      prev.map((ws) => (ws.id === id && !ws.isMain ? { ...ws, name } : ws)),
    );
  }, []);

  const removeWorkspace = useCallback((id: string) => {
    setWorkspaces((prev) => prev.filter((ws) => ws.id !== id || ws.isMain));
    setActiveIdState((prev) => {
      const next = prev === id ? "main" : prev;
      saveActiveId(next);
      return next;
    });
  }, []);

  const setParamCount = useCallback((id: string, count: number) => {
    setWorkspaces((prev) =>
      prev.map((ws) =>
        ws.id === id ? { ...ws, paramCount: Math.max(0, count) } : ws,
      ),
    );
  }, []);

  const [autosave, setAutosaveState] = useState(loadAutosave);
  const [saveGeneration, setSaveGeneration] = useState(0);

  const setAutosave = useCallback((on: boolean) => {
    setAutosaveState(on);
    saveAutosave(on);
  }, []);

  const triggerSave = useCallback(() => {
    setSaveGeneration((g) => g + 1);
  }, []);

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        activeId,
        setActiveId,
        addWorkspace,
        renameWorkspace,
        removeWorkspace,
        setParamCount,
        autosave,
        setAutosave,
        saveGeneration,
        triggerSave,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  return useContext(WorkspaceContext);
}
