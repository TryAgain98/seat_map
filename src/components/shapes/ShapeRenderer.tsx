import { Circle, Line, Rect } from "react-konva";
import { ShapeData } from "../../types/shape";
import { ActionType } from "../../types/action";
import {
  DEFAULT_SHAPE_COLOR,
  SELECTED_SHAPE_STROKE_COLOR,
} from "../../constants";

interface ShapeRendererProps {
  shapes: ShapeData[];
  actionType: ActionType;
  selectedShape: ShapeData | null;
  setSelectedShape: (shape: ShapeData | null) => void;
}

export function ShapeRenderer({
  shapes,
  actionType,
  selectedShape,
  setSelectedShape,
}: ShapeRendererProps) {
  const handleShapeClick = (shape: ShapeData) => {
    if (actionType !== ActionType.Mouse) return;
    setSelectedShape(shape);
  };

  return (
    <>
      {shapes.map((shape, i) => {
        const isSelected = selectedShape?.id === shape.id;

        if (shape.type === "rect") {
          return (
            <Rect
              key={i}
              {...shape}
              draggable={actionType === ActionType.Mouse}
              fill={shape.color || DEFAULT_SHAPE_COLOR}
              onClick={() => handleShapeClick(shape)}
              stroke={isSelected ? SELECTED_SHAPE_STROKE_COLOR : undefined}
              strokeWidth={isSelected ? 2 : 0}
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
              onClick={() => handleShapeClick(shape)}
              stroke={isSelected ? SELECTED_SHAPE_STROKE_COLOR : undefined}
              strokeWidth={isSelected ? 2 : 0}
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
              onClick={() => handleShapeClick(shape)}
              stroke={isSelected ? SELECTED_SHAPE_STROKE_COLOR : undefined}
              strokeWidth={isSelected ? 2 : 0}
            />
          );
        }
        return null;
      })}
    </>
  );
}
