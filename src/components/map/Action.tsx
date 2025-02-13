import { CircleIcon, MousePointer, RectangleHorizontal } from "lucide-react";

export enum ACTION {
  Mouse = "Mouse",
  Seat = "Seat",
  RectShape = "RectShape",
}

interface IProps {
  actionType: ACTION;
  setActionType: (actionType: ACTION) => void;
  setGhostSeat: (
    value: {
      x: number;
      y: number;
    } | null
  ) => void;
}

function Action({ actionType, setActionType, setGhostSeat }: IProps) {
  const handleCircleClick = (e: React.MouseEvent<SVGElement>) => {
    setActionType(ACTION.Seat);
    const { clientX, clientY } = e;
    setGhostSeat({ x: clientX, y: clientY });
  };
  return (
    <div className="flex flex-col bg-gray-300 items-center gap-2 p-2">
      <MousePointer
        color={actionType === ACTION.Mouse ? "blue" : "black"}
        className="cursor-pointer"
        onClick={() => {
          setGhostSeat(null);
          setActionType(ACTION.Mouse);
        }}
      />
      <CircleIcon
        onMouseDown={handleCircleClick}
        color={actionType === ACTION.Seat ? "blue" : "black"}
        className="cursor-pointer"
      />

      {/* <RectangleHorizontal
        onClick={() => {
          setGhostSeat(null);
          setActionType(ACTION.RectShape);
        }}
        color={actionType === ACTION.RectShape ? "blue" : "black"}
        className="cursor-pointer"
      /> */}
    </div>
  );
}

export default Action;
