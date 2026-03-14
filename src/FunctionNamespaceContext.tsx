import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

export interface FunctionEntry {
  name: string;
  paramCount: number;
  paramNames: string[];
}

/** Maps FunctionNode ID → metadata about that function. */
export type FunctionNamespace = Record<string, FunctionEntry>;

interface FunctionNamespaceContextValue {
  namespace: FunctionNamespace;
  register: (
    name: string,
    nodeId: string,
    paramCount: number,
    paramNames: string[],
  ) => void;
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

  const register = useCallback(
    (
      name: string,
      nodeId: string,
      paramCount: number,
      paramNames: string[],
    ) => {
      setNamespace((prev) => {
        const existing = prev[nodeId];
        if (
          existing &&
          existing.name === name &&
          existing.paramCount === paramCount &&
          existing.paramNames.length === paramNames.length &&
          existing.paramNames.every((n, i) => n === paramNames[i])
        ) {
          return prev;
        }
        return { ...prev, [nodeId]: { name, paramCount, paramNames } };
      });
    },
    [],
  );

  const unregister = useCallback((name: string, nodeId: string) => {
    setNamespace((prev) => {
      if (prev[nodeId]?.name !== name) return prev;
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
