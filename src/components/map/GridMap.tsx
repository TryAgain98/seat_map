import { Line } from "react-konva";
import { GRID_SIZE, STAGE_HEIGHT, STAGE_WIDTH } from "../../constants";

export const GridMap = () => {
    const lines = [];
    for (let i = -STAGE_WIDTH; i <= STAGE_WIDTH * 2; i += GRID_SIZE) {
      lines.push(
        <Line
          key={`v-${i}`}
          points={[i, -STAGE_HEIGHT, i, STAGE_HEIGHT * 2]}
          stroke="#ddd"
          strokeWidth={1}
        />
      );
    }
    for (let i = -STAGE_HEIGHT; i <= STAGE_HEIGHT * 2; i += GRID_SIZE) {
      lines.push(
        <Line
          key={`h-${i}`}
          points={[-STAGE_WIDTH, i, STAGE_WIDTH * 2, i]}
          stroke="#ddd"
          strokeWidth={1}
        />
      );
    }
    return lines;
}