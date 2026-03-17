import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Node, Edge } from "@xyflow/react";
import {
  DEFAULT_ACTIVE_WORKSPACE_ID,
  getDefaultWorkspaces,
} from "./defaultWorkspaces";
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
  autosave: true,
  setAutosave: () => {},
  saveGeneration: 0,
  triggerSave: () => {},
});

let wsCounter = 0;

function initWorkspaces(): Workspace[] {
  const defaults = getDefaultWorkspaces();
  const persisted = loadWorkspaceList();
  if (persisted) {
    const persistedById = new Map(persisted.map((ws) => [ws.id, ws]));
    persisted.forEach((ws) => {
      const match = ws.id.match(/^ws_(\d+)$/);
      if (match) wsCounter = Math.max(wsCounter, parseInt(match[1]));
    });
    const mergedDefaults = defaults.map((workspace) => {
      const saved = persistedById.get(workspace.id);
      return saved
        ? {
            ...saved,
            initialNodes: workspace.initialNodes,
            initialEdges: workspace.initialEdges,
          }
        : workspace;
    });
    const defaultIds = new Set(defaults.map((workspace) => workspace.id));
    const customWorkspaces = persisted.filter((ws) => !defaultIds.has(ws.id));
    return [...mergedDefaults, ...customWorkspaces];
  }
  return defaults;
}

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(initWorkspaces);
  const [activeId, setActiveIdState] = useState<string>(
    () => loadActiveId() ?? DEFAULT_ACTIVE_WORKSPACE_ID,
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
