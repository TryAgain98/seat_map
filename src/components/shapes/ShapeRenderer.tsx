import { Circle, Line, Rect } from "react-konva";
import { ShapeData } from "../../types/shape";
import { ActionType } from "../../types/action";
import { DEFAULT_SHAPE_COLOR } from "../../constants";

interface ShapeRendererProps {
  shapes: ShapeData[];
  actionType: ActionType;
}

export function ShapeRenderer({ shapes, actionType }: ShapeRendererProps) {
  return (
    <>
      {shapes.map((shape, i) => {
        if (shape.type === "rect") {
          return (
            <Rect
              key={i}
              {...shape}
              draggable={actionType === ActionType.Mouse}
              fill={shape.color || DEFAULT_SHAPE_COLOR}
              onClick={() => {
                console.log("clicked", shape);
              }}
            />
          );
        }
        if (shape.type === "circle") {
          return (
            <Circle
              key={i}
              draggable={actionType === ActionType.Mouse}
              {...shape}
              fill={shape.color || DEFAULT_SHAPE_COLOR}
            />
          );
        }
        if (shape.type === "polygon") {
          return (
            <Line
              key={i}
              points={shape.points!}
              fill={shape.color || DEFAULT_SHAPE_COLOR}
              closed
              draggable={actionType === ActionType.Mouse}
              strokeWidth={0}
            />
          );
        }
        return null;
      })}
    </>
  );
}
