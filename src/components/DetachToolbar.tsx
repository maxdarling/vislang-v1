import React from "react";
import {
  NodeToolbar,
  useReactFlow,
  useInternalNode,
  type NodeProps,
  type Node,
} from "@xyflow/react";

const NON_DETACHABLE_TYPES = new Set(["param", "return"]);

function DetachToolbar({ id }: { id: string }) {
  const { getNode, setNodes } = useReactFlow();
  const node = getNode(id);
  // Use the child's own positionAbsolute — this reflects the actual visual position
  // including any clamping applied by extent:"parent", so detach never jumps.
  const childInternal = useInternalNode(id);

  if (!node?.parentId) return null;

  const onDetach = () => {
    const posAbsolute = childInternal?.internals.positionAbsolute;
    if (!posAbsolute) return;

    setNodes((nds) =>
      nds.map((n) => {
        if (n.id !== id) return n;
        return {
          ...n,
          position: { x: posAbsolute.x, y: posAbsolute.y },
          parentId: undefined,
          extent: undefined,
        };
      }),
    );
  };

  return (
    <NodeToolbar>
      <button
        type="button"
        className="detach-toolbar-btn"
        onClick={onDetach}
        aria-label="Detach from function"
      >
        Detach
      </button>
    </NodeToolbar>
  );
}

/**
 * HOC that wraps any node component with a DetachToolbar.
 * Nodes whose type is in NON_DETACHABLE_TYPES are excluded.
 */
export function withDetachToolbar<P extends NodeProps<Node>>(
  Component: React.ComponentType<P> & { type: string },
) {
  if (NON_DETACHABLE_TYPES.has(Component.type)) {
    return Component;
  }

  const Wrapped = (props: P) => (
    <>
      <DetachToolbar id={props.id} />
      <Component {...props} />
    </>
  );

  Wrapped.type = Component.type;
  Wrapped.displayName = `WithDetachToolbar(${Component.displayName || Component.name || Component.type})`;

  return Wrapped;
}
