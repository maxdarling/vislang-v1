import { useState, useRef, useEffect, useCallback } from "react";
import {
  Handle,
  Position,
  type NodeProps,
  type Node,
  useReactFlow,
} from "@xyflow/react";

type DataNodeData = { val: number };
type DataNode = Node<DataNodeData, "data">;

export function DataNode({ id, data }: NodeProps<DataNode>) {
  // note from docs: you don't want to use data object in UI state directly
  // real state
  const { updateNodeData } = useReactFlow();
  const [value, setValue] = useState<number>(data.val);

  // UI state
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      const numValue = parseInt(evt.target.value) || 0;
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
      <div
        className="react-flow__node-default"
        style={{
          backgroundColor: "red",
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          cursor: "pointer",
        }}
      >
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={onChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="nodrag"
            style={{
              width: "35px",
              height: "20px",
              border: "none",
              borderRadius: "2px",
              padding: "2px 4px",
              textAlign: "center",
              fontSize: "12px",
              outline: "none",
            }}
          />
        ) : (
          <div
            onClick={handleClick}
            className="nodrag"
            style={{
              width: "35px",
              height: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              cursor: "text",
              //   overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {value || "0"}
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Right} isConnectable={true} />
    </>
  );
}
