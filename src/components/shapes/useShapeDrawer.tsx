import { KonvaEventObject } from "konva/lib/Node";
import { ActionType } from "../../types/action";
import { ShapeData } from "../../types/shape";
import Konva from "konva";
import React, { useState } from "react";
import { DEFAULT_SHAPE_COLOR } from "../../constants";

interface ShapeDrawerProps {
  actionType: ActionType;
  stageRef: React.RefObject<Konva.Stage | null>;
  shapes: ShapeData[];
  setShapes: React.Dispatch<React.SetStateAction<ShapeData[]>>;
}

export function useShapeDrawer({
  actionType,
  stageRef,
  shapes,
  setShapes,
}: ShapeDrawerProps) {
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(
    null
  );
  const [previewShape, setPreviewShape] = useState<ShapeData | null>(null);
  const [polygonPoints, setPolygonPoints] = useState<number[]>([]);

  const handleShapeMouseDown = (_e: KonvaEventObject<MouseEvent>) => {
    if (
      actionType === ActionType.RectShape ||
      actionType === ActionType.CircleShape
    ) {
      if (!stageRef.current) return;
      const stage = stageRef.current.getStage();
      const point = stage.getPointerPosition();
      if (!point) return;
      const scale = stage.scaleX();
      setStartPoint({
        x: (point.x - stage.x()) / scale,
        y: (point.y - stage.y()) / scale,
      });
    }
  };

  const handleShapeMouseMove = (correctedX: number, correctedY: number) => {
    if (
      startPoint &&
      (actionType === ActionType.RectShape ||
        actionType === ActionType.CircleShape)
    ) {
      let newPreview: ShapeData | null = null;
      if (actionType === ActionType.RectShape) {
        newPreview = {
          id: `rect-${Date.now().toString()}`,
          type: "rect",
          x: startPoint.x,
          y: startPoint.y,
          width: correctedX - startPoint.x,
          height: correctedY - startPoint.y,
          color: DEFAULT_SHAPE_COLOR,
        };
      } else if (actionType === ActionType.CircleShape) {
        newPreview = {
          id: `circle-${Date.now().toString()}`,
          type: "circle",
          x: startPoint.x,
          y: startPoint.y,
          radius: Math.hypot(
            correctedX - startPoint.x,
            correctedY - startPoint.y
          ),
          color: DEFAULT_SHAPE_COLOR,
        };
      }
      setPreviewShape(newPreview);
    } else if (
      actionType === ActionType.PolygonShape &&
      polygonPoints.length > 0
    ) {
      setPreviewShape({
        id: `polygon-${Date.now().toString()}`,
        type: "polygon",
        points: [...polygonPoints, correctedX, correctedY],
        color: DEFAULT_SHAPE_COLOR,
      });
    }
  };

  const handleShapeMouseUp = () => {
    if (
      previewShape &&
      (actionType === ActionType.RectShape ||
        actionType === ActionType.CircleShape)
    ) {
      setShapes([...shapes, previewShape]);
      setPreviewShape(null);
      setStartPoint(null);
    }
  };

  const handleShapeClick = (correctedX: number, correctedY: number) => {
    if (actionType === ActionType.PolygonShape) {
      if (polygonPoints.length >= 4) {
        const [firstX, firstY] = polygonPoints;
        const distance = Math.hypot(firstX - correctedX, firstY - correctedY);
        if (distance < 20) {
          setShapes((prev) => [
            ...prev,
            {
              id: `polygon-${Date.now().toString()}`,
              type: "polygon",
              points: [...polygonPoints],
              color: DEFAULT_SHAPE_COLOR,
            },
          ]);
          setPolygonPoints([]);
          setPreviewShape(null);
          return;
        }
      }
      setPolygonPoints((prev) => [...prev, correctedX, correctedY]);
    }
  };

  return {
    startPoint,
    previewShape,
    polygonPoints,
    handleShapeMouseDown,
    handleShapeMouseMove,
    handleShapeMouseUp,
    handleShapeClick,
  };
}
