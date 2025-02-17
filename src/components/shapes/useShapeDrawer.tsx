import { KonvaEventObject } from "konva/lib/Node";
import { ActionType } from "../../types/action";
import { ShapeData } from "../../types/shape";
import Konva from "konva";
import React, { useState } from "react";

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
          id: Date.now().toString(),
          type: "rect",
          x: startPoint.x,
          y: startPoint.y,
          width: correctedX - startPoint.x,
          height: correctedY - startPoint.y,
        };
      } else if (actionType === ActionType.CircleShape) {
        newPreview = {
          id: Date.now().toString(),
          type: "circle",
          x: startPoint.x,
          y: startPoint.y,
          radius: Math.hypot(
            correctedX - startPoint.x,
            correctedY - startPoint.y
          ),
        };
      }
      setPreviewShape(newPreview);
    } else if (
      actionType === ActionType.PolygonShape &&
      polygonPoints.length > 0
    ) {
      setPreviewShape({
        id: Date.now().toString(),
        type: "polygon",
        points: [...polygonPoints, correctedX, correctedY],
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
              id: Date.now().toString(),
              type: "polygon",
              points: [...polygonPoints],
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
