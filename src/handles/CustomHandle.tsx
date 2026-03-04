import { Handle, useNodeConnections, type HandleProps } from "@xyflow/react";

interface CustomHandleProps extends HandleProps {
  maxConnections: number;
}

const CustomHandle = (props: CustomHandleProps) => {
  const { maxConnections, ...handleProps } = props;
  const connections = useNodeConnections({
    handleType: props.type,
    handleId: props.id ?? undefined,
  });

  return (
    <Handle
      {...handleProps}
      isConnectable={connections.length < maxConnections}
    />
  );
};

export default CustomHandle;
