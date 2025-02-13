import React from "react";
import { Stage, Layer, Circle, Line, Text, Group } from "react-konva";

const GRID_SIZE = 50;
const STAGE_WIDTH = 800;
const STAGE_HEIGHT = 800;

interface IProps {
  circles: { id: number; x: number; y: number; name: string }[];
}
const ViewSeatMap: React.FC<IProps> = ({ circles }) => {
  const renderGrid = () => {
    const lines = [];
    for (let i = 0; i < STAGE_HEIGHT / GRID_SIZE; i++) {
      const y = i * GRID_SIZE;
      lines.push(
        <Line
          key={`h-${i}`}
          points={[0, y, STAGE_WIDTH, y]}
          stroke="#ddd"
          strokeWidth={0.5}
        />
      );
    }

    for (let i = 0; i < STAGE_WIDTH / GRID_SIZE; i++) {
      const x = i * GRID_SIZE;
      lines.push(
        <Line
          key={`v-${i}`}
          points={[x, 0, x, STAGE_HEIGHT]}
          stroke="#ddd"
          strokeWidth={0.5}
        />
      );
    }
    return lines;
  };

  return (
    <div className="border border-gray-300 w-[800px] h-[800px] overflow-hidden relative">
      <Stage width={STAGE_WIDTH} height={STAGE_HEIGHT}>
        <Layer>
          {renderGrid()}
          {circles.map((circle) => (
            <Group key={circle.id} x={circle.x} y={circle.y}>
              <Circle radius={25} fill="blue" />
              <Text
                text={circle.name}
                fontSize={16}
                fill="white"
                align="center"
                verticalAlign="middle"
                width={50}
                height={50}
                offsetX={25}
                offsetY={25}
              />
            </Group>
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default ViewSeatMap;
