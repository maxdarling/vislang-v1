import { useCallback } from "react";
import {
  Handle,
  Position,
  type NodeProps,
  type Node,
  useReactFlow,
} from "@xyflow/react";
import { EditableValue } from "../components/EditableValue";

type DataNodeData = { val: number };
type DataNodeType = Node<DataNodeData, "data">;

export function DataNode({ id, data }: NodeProps<DataNodeType>) {
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
      <div className="react-flow__node-default node-data">
        <EditableValue<number>
          initialValue={data?.val ?? DataNode.defaultVal}
          onValueChange={onValueChange}
          onInitialSync={onInitialSync}
          parse={(s) => parseInt(s, 10) || DataNode.defaultVal}
          format={String}
          defaultDisplay={String(DataNode.defaultVal)}
          inputAriaLabel="Data value"
        />
      </div>
      <Handle type="source" position={Position.Right} isConnectable={true} />
    </>
  );
}

DataNode.type = "data" as const;
DataNode.defaultVal = 1 as const;
