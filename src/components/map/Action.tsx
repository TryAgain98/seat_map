import { CircleIcon, MousePointer, Hand } from "lucide-react";

export enum ACTION {
  Mouse = "Mouse",
  Seat = "Seat",
  RectShape = "RectShape",
  Hand = "Hand",
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

  const getActiveColor = (type: ACTION) => {
    if (actionType === type) {
      return "blue";
    }
    return "black";
  };

  return (
    <div className="flex flex-col bg-gray-300 items-center gap-2 p-2">
      <MousePointer
        color={getActiveColor(ACTION.Mouse)}
        className="cursor-pointer"
        onClick={() => {
          setGhostSeat(null);
          setActionType(ACTION.Mouse);
        }}
      />
      <CircleIcon
        onMouseDown={handleCircleClick}
        color={getActiveColor(ACTION.Seat)}
        className="cursor-pointer"
      />

      <Hand
        color={getActiveColor(ACTION.Hand)}
        className="cursor-pointer"
        onClick={() => {
          setGhostSeat(null);
          setActionType(ACTION.Hand);
        }}
      />
    </div>
  );
}

export default Action;
