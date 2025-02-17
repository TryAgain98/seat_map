export type ShapeBaseData = {
  id: string;
  label?: string;
  color?: string;
};

export type RectShapeData = ShapeBaseData & {
  type: "rect";
  x: number;
  y: number;
  width: number;
  height: number;
};

export type CircleShapeData = ShapeBaseData & {
  type: "circle";
  x: number;
  y: number;
  radius: number;
};

export type PolygonShapeData = ShapeBaseData & {
  type: "polygon";
  points: number[];
};

export type ShapeData = RectShapeData | CircleShapeData | PolygonShapeData;
