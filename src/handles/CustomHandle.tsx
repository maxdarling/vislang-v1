import { Handle, useNodeConnections, type HandleProps } from "@xyflow/react";

interface CustomHandleProps extends HandleProps {
  connectionCount: number;
}

const CustomHandle = (props: CustomHandleProps) => {
  const { connectionCount, ...handleProps } = props;
  const connections = useNodeConnections({
    handleType: props.type,
  });

  return (
    <Handle
      {...handleProps}
      isConnectable={connections.length < connectionCount}
    />
  );
};

export default CustomHandle;
