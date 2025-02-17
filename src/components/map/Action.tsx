import {
  CircleIcon,
  MousePointer,
  Hand,
  RectangleHorizontal,
  Armchair,
  Waypoints,
} from "lucide-react";
import { ActionType } from "../../types/action";

interface IProps {
  actionType: ActionType;
  setActionType: (actionType: ActionType) => void;
  setGhostSeat: (
    value: {
      x: number;
      y: number;
    } | null
  ) => void;
}

function Action({ actionType, setActionType, setGhostSeat }: IProps) {
  const handleCircleClick = (e: React.MouseEvent<SVGElement>) => {
    setActionType(ActionType.Seat);
    const { clientX, clientY } = e;
    setGhostSeat({ x: clientX, y: clientY });
  };

  const getActiveColor = (type: ActionType) => {
    if (actionType === type) {
      return "blue";
    }
    return "black";
  };

  return (
    <div className="flex flex-col bg-gray-300 items-center gap-2 p-2">
      <MousePointer
        color={getActiveColor(ActionType.Mouse)}
        className="cursor-pointer"
        onClick={() => {
          setGhostSeat(null);
          setActionType(ActionType.Mouse);
        }}
      />
      <Armchair
        onMouseDown={handleCircleClick}
        color={getActiveColor(ActionType.Seat)}
        className="cursor-pointer"
      />

      <Hand
        color={getActiveColor(ActionType.Hand)}
        className="cursor-pointer"
        onClick={() => {
          setGhostSeat(null);
          setActionType(ActionType.Hand);
        }}
      />

      <RectangleHorizontal
        color={getActiveColor(ActionType.RectShape)}
        className="cursor-pointer"
        onClick={() => {
          setGhostSeat(null);
          setActionType(ActionType.RectShape);
        }}
      />

      <CircleIcon
        color={getActiveColor(ActionType.CircleShape)}
        className="cursor-pointer"
        onClick={() => {
          setGhostSeat(null);
          setActionType(ActionType.CircleShape);
        }}
      />

      <Waypoints
        color={getActiveColor(ActionType.PolygonShape)}
        className="cursor-pointer"
        onClick={() => {
          setGhostSeat(null);
          setActionType(ActionType.PolygonShape);
        }}
      />
    </div>
  );
}

export default Action;
