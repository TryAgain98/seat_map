import { Circle, Line } from "react-konva";
import { SEAT } from "../../../constants";

interface IProps {
  ghostSeat: {
    x: number;
    y: number;
  } | null;
  stageRef: any;
}
function GhostSeat({ ghostSeat, stageRef }: IProps) {
  if (!ghostSeat) return;
  return (
    <>
      <Circle
        x={ghostSeat.x}
        y={ghostSeat.y}
        radius={SEAT.RADIUS}
        fill="rgba(0,0,255,0.5)"
      />
      <Line
        points={[
          -stageRef.current?.x() / (stageRef.current?.scaleX() || 1),
          ghostSeat.y - SEAT.RADIUS,
          (-stageRef.current?.x() + window.innerWidth) /
            (stageRef.current?.scaleX() || 1),
          ghostSeat.y - SEAT.RADIUS,
        ]}
        stroke="red"
        strokeWidth={1}
        dash={[4, 4]}
      />
      <Line
        points={[
          -stageRef.current?.x() / (stageRef.current?.scaleX() || 1),
          ghostSeat.y + SEAT.RADIUS,
          (-stageRef.current?.x() + window.innerWidth) /
            (stageRef.current?.scaleX() || 1),
          ghostSeat.y + SEAT.RADIUS,
        ]}
        stroke="red"
        strokeWidth={1}
        dash={[4, 4]}
      />
      <Line
        points={[
          ghostSeat.x - SEAT.RADIUS,
          -stageRef.current?.y() / (stageRef.current?.scaleX() || 1),
          ghostSeat.x - SEAT.RADIUS,
          (-stageRef.current?.y() + window.innerHeight) /
            (stageRef.current?.scaleX() || 1),
        ]}
        stroke="red"
        strokeWidth={1}
        dash={[4, 4]}
      />
      <Line
        points={[
          ghostSeat.x + SEAT.RADIUS,
          -stageRef.current?.y() / (stageRef.current?.scaleX() || 1),
          ghostSeat.x + SEAT.RADIUS,
          (-stageRef.current?.y() + window.innerHeight) /
            (stageRef.current?.scaleX() || 1),
        ]}
        stroke="red"
        strokeWidth={1}
        dash={[4, 4]}
      />
    </>
  );
}

export default GhostSeat;
