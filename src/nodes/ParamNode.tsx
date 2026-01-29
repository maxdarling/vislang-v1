import { useCallback } from "react";
import {
  Handle,
  Position,
  type NodeProps,
  type Node,
  useReactFlow,
} from "@xyflow/react";
import { EditableValue } from "../components/EditableValue";

type ParamNodeData = { name?: string };
type ParamNodeType = Node<ParamNodeData, "param">;

export function ParamNode({ id, data }: NodeProps<ParamNodeType>) {
  const { updateNodeData } = useReactFlow();

  const onValueChange = useCallback(
    (name: string) => {
      updateNodeData(id, { name });
    },
    [id, updateNodeData],
  );

  return (
    <>
      <div className="react-flow__node-default node-param">
        <EditableValue<string>
          initialValue={data?.name ?? ParamNode.defaultName}
          onValueChange={onValueChange}
          onInitialSync={onValueChange}
          parse={(s) => s || ParamNode.defaultName}
          format={(s) => s}
          defaultDisplay={ParamNode.defaultName}
          inputAriaLabel="Parameter name"
        />
      </div>
      <Handle type="source" position={Position.Right} isConnectable={true} />
    </>
  );
}

ParamNode.type = "param" as const;
ParamNode.defaultName = "x" as const;
