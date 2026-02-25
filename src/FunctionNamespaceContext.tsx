import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

/** Maps function name → the node ID of the FunctionNode that owns that name. */
export type FunctionNamespace = Record<string, string>;

interface FunctionNamespaceContextValue {
  namespace: FunctionNamespace;
  /** Register (or overwrite) a name → nodeId mapping. */
  register: (name: string, nodeId: string) => void;
  /** Remove a name → nodeId mapping, but only if nodeId is still the current owner. */
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
    setNamespace((prev) => ({ ...prev, [name]: nodeId }));
  }, []);

  const unregister = useCallback((name: string, nodeId: string) => {
    setNamespace((prev) => {
      if (prev[name] !== nodeId) return prev; // not the owner, leave it alone
      const next = { ...prev };
      delete next[name];
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
