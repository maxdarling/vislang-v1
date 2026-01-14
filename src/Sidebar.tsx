import { useDnD } from "./DnDContext";
import { NodeIcon } from "./components/NodeIcon";
import { nodeTypesByCategory } from "./App";

export default function Sidebar() {
  const [_, setType] = useDnD();

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const categoryOrder: Array<keyof typeof nodeTypesByCategory> = [
    "data",
    "arith",
    "function",
    "other",
  ];

  return (
    <aside>
      {categoryOrder.map((category) => (
        <div key={category} className="node-category">
          <div className="category-header">
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </div>
          {nodeTypesByCategory[category].map((NodeComponent) => {
            const nodeType = NodeComponent.type;
            return (
              <div
                key={nodeType}
                className={`dndnode ${nodeType}`}
                onDragStart={(event) => onDragStart(event, nodeType)}
                draggable
                title={`${nodeType.charAt(0).toUpperCase() + nodeType.slice(1)} Node`}
              >
                <NodeIcon type={nodeType} size={40} />
              </div>
            );
          })}
        </div>
      ))}
    </aside>
  );
}
