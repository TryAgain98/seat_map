import { Line } from "react-konva";
import { GRID_SIZE } from "../../constants";

export const GridMap = ({ stageRef }: { stageRef: any }) => {
  const stage = stageRef.current;
  const scale = stage?.scaleX() || 1;
  const stageX = stage?.x() || 0;
  const stageY = stage?.y() || 0;

  const lines = [];
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const BUFFER_MULTIPLIER = 4;

  const startX = (-stageX - viewportWidth * BUFFER_MULTIPLIER) / scale;
  const endX = (-stageX + viewportWidth * BUFFER_MULTIPLIER) / scale;
  const startY = (-stageY - viewportHeight * BUFFER_MULTIPLIER) / scale;
  const endY = (-stageY + viewportHeight * BUFFER_MULTIPLIER) / scale;

  const roundedStartX = Math.floor(startX / GRID_SIZE) * GRID_SIZE;
  const roundedEndX = Math.ceil(endX / GRID_SIZE) * GRID_SIZE;
  const roundedStartY = Math.floor(startY / GRID_SIZE) * GRID_SIZE;
  const roundedEndY = Math.ceil(endY / GRID_SIZE) * GRID_SIZE;

  for (let i = roundedStartX; i <= roundedEndX; i += GRID_SIZE) {
    lines.push(
      <Line
        key={`v-${i}`}
        points={[i, roundedStartY, i, roundedEndY]}
        stroke="#ddd"
        strokeWidth={1 / scale}
      />
    );
  }

  for (let i = roundedStartY; i <= roundedEndY; i += GRID_SIZE) {
    lines.push(
      <Line
        key={`h-${i}`}
        points={[roundedStartX, i, roundedEndX, i]}
        stroke="#ddd"
        strokeWidth={1 / scale}
      />
    );
  }

  return lines;
};
