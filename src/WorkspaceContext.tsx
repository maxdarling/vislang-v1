import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

export interface Workspace {
  id: string;
  name: string;
  isMain: boolean;
  paramCount: number;
}

interface WorkspaceContextValue {
  workspaces: Workspace[];
  activeId: string;
  setActiveId: (id: string) => void;
  addWorkspace: () => void;
  renameWorkspace: (id: string, name: string) => void;
  removeWorkspace: (id: string) => void;
  setParamCount: (id: string, count: number) => void;
}

const WorkspaceContext = createContext<WorkspaceContextValue>({
  workspaces: [],
  activeId: "main",
  setActiveId: () => {},
  addWorkspace: () => {},
  renameWorkspace: () => {},
  removeWorkspace: () => {},
  setParamCount: () => {},
});

let wsCounter = 0;

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([
    { id: "main", name: "Main", isMain: true, paramCount: 0 },
  ]);
  const [activeId, setActiveId] = useState("main");

  const addWorkspace = useCallback(() => {
    wsCounter += 1;
    const id = `ws_${wsCounter}`;
    setWorkspaces((prev) => [
      ...prev,
      { id, name: `func_${wsCounter}`, isMain: false, paramCount: 0 },
    ]);
    setActiveId(id);
  }, []);

  const renameWorkspace = useCallback((id: string, name: string) => {
    setWorkspaces((prev) =>
      prev.map((ws) => (ws.id === id && !ws.isMain ? { ...ws, name } : ws)),
    );
  }, []);

  const removeWorkspace = useCallback((id: string) => {
    setWorkspaces((prev) => prev.filter((ws) => ws.id !== id || ws.isMain));
    setActiveId((prev) => (prev === id ? "main" : prev));
  }, []);

  const setParamCount = useCallback((id: string, count: number) => {
    setWorkspaces((prev) =>
      prev.map((ws) =>
        ws.id === id ? { ...ws, paramCount: Math.max(0, count) } : ws,
      ),
    );
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
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  return useContext(WorkspaceContext);
}
