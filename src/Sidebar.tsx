import { useDnD } from "./DnDContext";

export default function Sidebar() {
  const [_, setType] = useDnD();

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside>
      <div className="description">Click and drag to create a new node.</div>
      <div
        className="dndnode data"
        onDragStart={(event) => onDragStart(event, "data")}
        draggable
      >
        Data Node
      </div>
      <div
        className="dndnode add"
        onDragStart={(event) => onDragStart(event, "add")}
        draggable
      >
        Add Node
      </div>
      <div
        className="dndnode sub"
        onDragStart={(event) => onDragStart(event, "sub")}
        draggable
      >
        Subtract Node
      </div>
      <div
        className="dndnode mul"
        onDragStart={(event) => onDragStart(event, "mul")}
        draggable
      >
        Multiply Node
      </div>
      <div
        className="dndnode div"
        onDragStart={(event) => onDragStart(event, "div")}
        draggable
      >
        Divide Node
      </div>
      <div
        className="dndnode display"
        onDragStart={(event) => onDragStart(event, "display")}
        draggable
      >
        Display Node
      </div>
    </aside>
  );
}
