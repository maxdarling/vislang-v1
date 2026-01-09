import { useDnD } from "./DnDContext";
import { NodeIcon } from "./components/NodeIcon";

export default function Sidebar() {
  const [_, setType] = useDnD();

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const nodeTypes: Array<"data" | "add" | "sub" | "mul" | "div" | "display"> = [
    "data",
    "add",
    "sub",
    "mul",
    "div",
    "display",
  ];

  return (
    <aside>
      <div className="description">Click and drag to create a new node.</div>
      {nodeTypes.map((nodeType) => (
        <div
          key={nodeType}
          className={`dndnode ${nodeType}`}
          onDragStart={(event) => onDragStart(event, nodeType)}
          draggable
          title={`${nodeType.charAt(0).toUpperCase() + nodeType.slice(1)} Node`}
        >
          <NodeIcon type={nodeType} size={40} />
        </div>
      ))}
    </aside>
  );
}
