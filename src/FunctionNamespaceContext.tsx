import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

/** Maps FunctionNode ID → the display name of that function. */
export type FunctionNamespace = Record<string, string>;

interface FunctionNamespaceContextValue {
  namespace: FunctionNamespace;
  /** Register (or overwrite) a nodeId → name mapping. */
  register: (name: string, nodeId: string) => void;
  /** Remove a nodeId → name mapping, but only if name still matches. */
  unregister: (name: string, nodeId: string) => void;
}

const FunctionNamespaceContext = createContext<FunctionNamespaceContextValue>({
  namespace: {},
  register: () => {},
  unregister: () => {},
});

export function FunctionNamespaceProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [namespace, setNamespace] = useState<FunctionNamespace>({});

  const register = useCallback((name: string, nodeId: string) => {
    setNamespace((prev) => ({ ...prev, [nodeId]: name }));
  }, []);

  const unregister = useCallback((name: string, nodeId: string) => {
    setNamespace((prev) => {
      if (prev[nodeId] !== name) return prev;
      const next = { ...prev };
      delete next[nodeId];
      return next;
    });
  }, []);

  return (
    <FunctionNamespaceContext.Provider
      value={{ namespace, register, unregister }}
    >
      {children}
    </FunctionNamespaceContext.Provider>
  );
}

export function useFunctionNamespace() {
  return useContext(FunctionNamespaceContext);
}
