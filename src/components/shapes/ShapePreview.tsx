import { Circle, Line, Rect } from "react-konva";
import { ShapeData } from "../../types/shape";
import { ActionType } from "../../types/action";
import { DEFAULT_SHAPE_PREVIEW_FILL_COLOR } from "../../constants";
import { DEFAULT_SHAPE_PREVIEW_STROKE_COLOR } from "../../constants";
interface ShapePreviewProps {
  previewShape: ShapeData | null;
  actionType: ActionType;
  polygonPoints: number[];
}

export function ShapePreview({
  previewShape,
  actionType,
  polygonPoints,
}: ShapePreviewProps) {
  return (
    <>
      {/* Preview shapes */}
      {previewShape &&
        (previewShape.type === "rect" ? (
          <Rect
            {...previewShape}
            fill={DEFAULT_SHAPE_PREVIEW_FILL_COLOR}
            stroke={DEFAULT_SHAPE_PREVIEW_STROKE_COLOR}
          />
        ) : previewShape.type === "circle" ? (
          <Circle
            {...previewShape}
            fill={DEFAULT_SHAPE_PREVIEW_FILL_COLOR}
            stroke={DEFAULT_SHAPE_PREVIEW_STROKE_COLOR}
          />
        ) : previewShape.type === "polygon" ? (
          <Line
            points={previewShape.points!}
            stroke={DEFAULT_SHAPE_PREVIEW_STROKE_COLOR}
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
              stroke={DEFAULT_SHAPE_PREVIEW_STROKE_COLOR}
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
                fill={DEFAULT_SHAPE_PREVIEW_STROKE_COLOR}
              />
            ))}
        </>
      )}
    </>
  );
}
