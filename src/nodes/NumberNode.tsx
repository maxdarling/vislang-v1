import { useCallback } from "react";
import {
  Handle,
  Position,
  type NodeProps,
  type Node,
  useReactFlow,
} from "@xyflow/react";
import { EditableValue } from "../components/EditableValue";

type NumberNodeData = { val: number };
type NumberNodeType = Node<NumberNodeData, "number">;

export function NumberNode({ id, data }: NodeProps<NumberNodeType>) {
  const { updateNodeData } = useReactFlow();

  const onValueChange = useCallback(
    (val: number) => {
      updateNodeData(id, { val });
    },
    [id, updateNodeData],
  );

  const onInitialSync = useCallback(
    (val: number) => {
      updateNodeData(id, { val });
    },
    [id, updateNodeData],
  );

  return (
    <>
      <div className="react-flow__node-default node-number">
        <EditableValue<number>
          initialValue={data?.val ?? NumberNode.defaultVal}
          onValueChange={onValueChange}
          onInitialSync={onInitialSync}
          parse={(s) => parseInt(s, 10) || NumberNode.defaultVal}
          format={String}
          defaultDisplay={String(NumberNode.defaultVal)}
          inputAriaLabel="Number value"
        />
      </div>
      <Handle type="source" position={Position.Right} isConnectable={true} />
    </>
  );
}

NumberNode.type = "number" as const;
NumberNode.defaultVal = 1 as const;
