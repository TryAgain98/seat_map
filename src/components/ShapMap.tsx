import React, { useState, useRef } from "react";
import { Stage, Layer, Rect, Circle, Line } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";
import { Stage as KonvaStage } from "konva/lib/Stage";

interface Shape {
  type: "rect" | "circle" | "polygon";
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  radius?: number;
  points?: number[];
}

const DrawShapes: React.FC = () => {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [shapeType, setShapeType] = useState<Shape["type"]>("rect");
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(
    null
  );
  const [previewShape, setPreviewShape] = useState<Shape | null>(null);
  const [polygonPoints, setPolygonPoints] = useState<number[]>([]);
  const stageRef = useRef<KonvaStage>(null);

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    if (!stage) return;
    const pointerPos = stage.getPointerPosition();
    if (!pointerPos) return;
    const { x, y } = pointerPos;

    if (shapeType === "polygon") {
      if (polygonPoints.length >= 4) {
        const [firstX, firstY] = polygonPoints;
        const distance = Math.hypot(firstX - x, firstY - y);
        if (distance < 10) {
          setShapes([
            ...shapes,
            { type: "polygon", points: [...polygonPoints] },
          ]);
          setPolygonPoints([]);
          return;
        }
      }
      setPolygonPoints([...polygonPoints, x, y]);
    } else {
      setStartPoint({ x, y });
    }
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!startPoint) return;
    const stage = e.target.getStage();
    if (!stage) return;
    const pointerPos = stage.getPointerPosition();
    if (!pointerPos) return;
    const { x, y } = pointerPos;

    let newPreview: Shape | null = null;
    if (shapeType === "rect") {
      newPreview = {
        type: "rect",
        x: startPoint.x,
        y: startPoint.y,
        width: x - startPoint.x,
        height: y - startPoint.y,
      };
    } else if (shapeType === "circle") {
      newPreview = {
        type: "circle",
        x: startPoint.x,
        y: startPoint.y,
        radius: Math.hypot(x - startPoint.x, y - startPoint.y),
      };
    } else if (shapeType === "polygon" && polygonPoints.length > 0) {
      setPreviewShape({ type: "polygon", points: [...polygonPoints, x, y] });
      return;
    }
    setPreviewShape(newPreview);
  };

  const handleMouseUp = () => {
    if (previewShape) {
      setShapes([...shapes, previewShape]);
      setPreviewShape(null);
      setStartPoint(null);
    }
  };

  return (
    <div>
      <div>
        <button onClick={() => setShapeType("rect")}>Hình Chữ Nhật</button>
        <button onClick={() => setShapeType("circle")}>Hình Tròn</button>
        <button onClick={() => setShapeType("polygon")}>Hình Đa Giác</button>
      </div>
      <Stage
        width={800}
        height={600}
        ref={stageRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ border: "1px solid black" }}
      >
        <Layer>
          {shapes.map((shape, i) => {
            if (shape.type === "rect") {
              return <Rect key={i} {...shape} draggable fill="red" />;
            }
            if (shape.type === "circle") {
              return <Circle key={i} draggable {...shape} fill="blue" />;
            }
            if (shape.type === "polygon") {
              return (
                <Line
                  key={i}
                  points={shape.points!}
                  fill="green"
                  closed
                  draggable
                  stroke="black"
                  strokeWidth={2}
                />
              );
            }
            return null;
          })}

          {previewShape &&
            previewShape.type !== "polygon" &&
            (previewShape.type === "rect" ? (
              <Rect {...previewShape} fill="rgba(255,0,0,0.3)" stroke="red" />
            ) : previewShape.type === "circle" ? (
              <Circle
                {...previewShape}
                fill="rgba(0,0,255,0.3)"
                stroke="blue"
              />
            ) : null)}

          {polygonPoints.length > 0 && (
            <>
              <Line points={polygonPoints} stroke="black" strokeWidth={2} />
              {polygonPoints.map((point, index) =>
                index % 2 === 0 ? (
                  <Circle
                    key={index}
                    x={polygonPoints[index]}
                    y={polygonPoints[index + 1]}
                    radius={5}
                    fill="black"
                    onClick={() =>
                      setPolygonPoints(
                        polygonPoints.filter(
                          (_, i) => i !== index && i !== index + 1
                        )
                      )
                    }
                  />
                ) : null
              )}
              {previewShape?.type === "polygon" && (
                <Line
                  points={previewShape.points!}
                  stroke="black"
                  strokeWidth={2}
                  dash={[5, 5]}
                />
              )}
            </>
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default DrawShapes;
