import { useEffect } from "react";
import {
  Position,
  useNodeConnections,
  useNodesData,
  type NodeProps,
  type Node,
} from "@xyflow/react";
import CustomHandle from "../handles/CustomHandle";
import { useRuntime, RUNTIME_RETURN_TYPE } from "../RuntimeContext";

type RuntimeReturnNodeData = { functionNodeId?: string; val?: number };
type RuntimeReturnNodeType = Node<
  RuntimeReturnNodeData,
  typeof RUNTIME_RETURN_TYPE
>;

export function RuntimeReturnNode({ data }: NodeProps<RuntimeReturnNodeType>) {
  const { setReturnValue } = useRuntime();
  const functionNodeId = data?.functionNodeId;

  const inConnections = useNodeConnections({ handleType: "target" });
  const connection = inConnections[0];
  const sourceNodeData = useNodesData(connection?.source);
  const val = (sourceNodeData?.data as { val?: number } | undefined)?.val;

  useEffect(() => {
    if (functionNodeId) {
      setReturnValue(functionNodeId, val);
    }
  }, [functionNodeId, val, setReturnValue]);

  return (
    <>
      <CustomHandle type="target" position={Position.Left} maxConnections={1} />
      <div className="react-flow__node-default node-return">
        RET
        {val !== undefined && (
          <>
            <br />
            {`(${val})`}
          </>
        )}
      </div>
    </>
  );
}

RuntimeReturnNode.type = RUNTIME_RETURN_TYPE;
