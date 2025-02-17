import { Circle, Line, Rect, Text, Group } from "react-konva";
import { ShapeData } from "../../types/shape";
import { ActionType } from "../../types/action";
import {
  DEFAULT_SHAPE_COLOR,
  SELECTED_SHAPE_STROKE_COLOR,
} from "../../constants";
import { useEffect, useCallback } from "react";

interface ShapeRendererProps {
  shapes: ShapeData[];
  setShapes: React.Dispatch<React.SetStateAction<ShapeData[]>>;
  actionType: ActionType;
  selectedShape: ShapeData | null;
  setSelectedShape: (shape: ShapeData | null) => void;
}

export function ShapeRenderer({
  shapes,
  setShapes,
  actionType,
  selectedShape,
  setSelectedShape,
}: ShapeRendererProps) {
  // Handle outside click
  const handleStageClick = useCallback(
    (e: MouseEvent) => {
      // Check if the click is on the stage itself (not on a shape)
      const target = e.target as HTMLElement;
      if (target.tagName === "CANVAS") {
        setSelectedShape(null);
      }
    },
    [setSelectedShape]
  );

  useEffect(() => {
    // Add click listener when a shape is selected
    if (selectedShape) {
      document.addEventListener("click", handleStageClick);
    }

    // Cleanup listener
    return () => {
      document.removeEventListener("click", handleStageClick);
    };
  }, [selectedShape, handleStageClick]);

  const handleShapeClick = (e: any, shape: ShapeData) => {
    // Stop event propagation to prevent stage click
    e.cancelBubble = true;

    // If clicking the same shape, do nothing
    if (selectedShape?.id === shape.id) {
      return;
    }

    // If clicking a different shape, select it
    setSelectedShape(shape);
  };

  const renderShapeWithLabel = (shape: ShapeData, isSelected: boolean) => {
    let shapeElement;
    let labelPosition = { x: 0, y: 0 };

    if (shape.type === "rect") {
      shapeElement = (
        <Rect
          {...shape}
          fill={shape.color || DEFAULT_SHAPE_COLOR}
          stroke={isSelected ? SELECTED_SHAPE_STROKE_COLOR : "transparent"}
          strokeWidth={isSelected ? 2 : 0}
        />
      );
      labelPosition = {
        x: shape.x + shape.width / 2,
        y: shape.y + shape.height / 2,
      };
    } else if (shape.type === "circle") {
      shapeElement = (
        <Circle
          {...shape}
          fill={shape.color || DEFAULT_SHAPE_COLOR}
          stroke={isSelected ? SELECTED_SHAPE_STROKE_COLOR : "transparent"}
          strokeWidth={isSelected ? 2 : 0}
        />
      );
      labelPosition = {
        x: shape.x,
        y: shape.y,
      };
    } else if (shape.type === "polygon") {
      shapeElement = (
        <Line
          points={shape.points!}
          fill={shape.color || DEFAULT_SHAPE_COLOR}
          closed
          stroke={isSelected ? SELECTED_SHAPE_STROKE_COLOR : "transparent"}
          strokeWidth={isSelected ? 2 : 0}
        />
      );
      const points = shape.points!;
      const xPoints = points.filter((_, i) => i % 2 === 0);
      const yPoints = points.filter((_, i) => i % 2 === 1);
      labelPosition = {
        x: (Math.min(...xPoints) + Math.max(...xPoints)) / 2,
        y: (Math.min(...yPoints) + Math.max(...yPoints)) / 2,
      };
    }

    return (
      <Group
        key={shape.id}
        onClick={(e) => handleShapeClick(e, shape)}
        draggable={actionType === ActionType.Mouse}
        onDragEnd={(e) => {
          const node = e.target;
          const newX = node.x();
          const newY = node.y();

          // Update shape position based on its type
          let updatedShape: ShapeData;
          if (shape.type === "polygon") {
            // Update all points for polygon
            updatedShape = {
              ...shape,
              points: shape.points!.map((coord, i) => {
                return i % 2 === 0 ? coord + newX : coord + newY;
              }),
            };
          } else {
            // Update x, y for rect and circle
            updatedShape = {
              ...shape,
              x: shape.x + newX,
              y: shape.y + newY,
            };
          }

          // Reset group position
          node.position({ x: 0, y: 0 });

          // Update shape in parent component
          setSelectedShape(updatedShape);
          setShapes((prev) =>
            prev.map((shape) => (shape.id === shape.id ? updatedShape : shape))
          );
        }}
      >
        {shapeElement}
        {shape.label && (
          <Text
            text={shape.label}
            x={labelPosition.x}
            y={labelPosition.y}
            fontSize={14}
            fill="#000"
            align="center"
            verticalAlign="middle"
            offsetX={20}
            offsetY={7}
          />
        )}
      </Group>
    );
  };

  return (
    <>
      {shapes.map((shape) => {
        const isSelected = selectedShape?.id === shape.id;
        return renderShapeWithLabel(shape, isSelected);
      })}
    </>
  );
}
