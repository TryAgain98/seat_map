import { Circle, Line, Rect } from "react-konva";
import { ShapeData } from "../../types/shape";
import { ActionType } from "../../types/action";

interface ShapeRendererProps {
  shapes: ShapeData[];
  actionType: ActionType;
}

function ShapeRenderer({ shapes, actionType }: ShapeRendererProps) {
  return (
    <>
      {shapes.map((shape, i) => {
        if (shape.type === "rect") {
          return (
            <Rect
              key={i}
              {...shape}
              draggable={actionType === ActionType.Mouse}
              fill="red"
            />
          );
        }
        if (shape.type === "circle") {
          return (
            <Circle
              key={i}
              draggable={actionType === ActionType.Mouse}
              {...shape}
              fill="blue"
            />
          );
        }
        if (shape.type === "polygon") {
          return (
            <Line
              key={i}
              points={shape.points!}
              fill="green"
              closed
              draggable={actionType === ActionType.Mouse}
              stroke="black"
              strokeWidth={2}
            />
          );
        }
        return null;
      })}
    </>
  );
}

export default ShapeRenderer;
