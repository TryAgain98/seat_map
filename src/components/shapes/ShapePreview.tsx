import { Circle, Line, Rect } from "react-konva";
import { ShapeData } from "../../types/shape";
import { ActionType } from "../../types/action";
interface ShapePreviewProps {
  previewShape: ShapeData | null;
  actionType: ActionType;
  polygonPoints: number[];
}

function ShapePreview({
  previewShape,
  actionType,
  polygonPoints,
}: ShapePreviewProps) {
  return (
    <>
      {/* Preview shapes */}
      {previewShape &&
        (previewShape.type === "rect" ? (
          <Rect {...previewShape} fill="rgba(255,0,0,0.3)" stroke="red" />
        ) : previewShape.type === "circle" ? (
          <Circle {...previewShape} fill="rgba(0,0,255,0.3)" stroke="blue" />
        ) : previewShape.type === "polygon" ? (
          <Line
            points={previewShape.points!}
            stroke="black"
            strokeWidth={2}
            dash={[5, 5]}
          />
        ) : null)}

      {/* Polygon drawing UI */}
      {actionType === ActionType.PolygonShape && (
        <>
          {/* Existing polygon points */}
          {polygonPoints.length > 0 && (
            <Line
              points={polygonPoints}
              stroke="black"
              strokeWidth={2}
              closed={false}
            />
          )}

          {/* Point markers */}
          {polygonPoints.length > 0 &&
            Array.from({ length: polygonPoints.length / 2 }).map((_, index) => (
              <Circle
                key={index}
                x={polygonPoints[index * 2]}
                y={polygonPoints[index * 2 + 1]}
                radius={4}
                fill="black"
              />
            ))}
        </>
      )}
    </>
  );
}

export default ShapePreview;
