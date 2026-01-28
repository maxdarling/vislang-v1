import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Handle,
  Position,
  type NodeProps,
  type Node,
  useReactFlow,
} from "@xyflow/react";

type DataNodeData = { val: number };
type DataNodeType = Node<DataNodeData, "data">;

export function DataNode({ id, data }: NodeProps<DataNodeType>) {
  // note: we separate internal and UI state as per docs:
  // "When dealing with input fields you don’t want to use a nodes data object as UI state directly."
  // (from https://reactflow.dev/learn/advanced-use/computing-flows)

  // internal state
  const { updateNodeData } = useReactFlow();
  const [value, setValue] = useState<number>(data?.val ?? DataNode.defaultVal);

  // sync initial value to node data on mount (e.g. when dropped from sidebar)
  useEffect(() => {
    updateNodeData(id, { val: value });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // UI state
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      const numValue = parseInt(evt.target.value) || DataNode.defaultVal;
      setValue(numValue);
      updateNodeData(id, { val: numValue });
    },
    [id, updateNodeData],
  );

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditing(false);
    }
  };

  return (
    <>
      <div className="react-flow__node-default node-data">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={onChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="nodrag"
          />
        ) : (
          <div onClick={handleClick} className="nodrag">
            {value ?? DataNode.defaultVal}
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Right} isConnectable={true} />
    </>
  );
}

DataNode.type = "data" as const;
DataNode.defaultVal = 1 as const;
