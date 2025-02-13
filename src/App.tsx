import React, { useRef, useState } from "react";
import { Stage, Layer, Circle, Text, Group, Line } from "react-konva";
import { MousePointer, Circle as CircleIcon } from "lucide-react";
import { KonvaEventObject } from "konva/lib/Node";
import { GridMap } from "./components/map/GridMap";
import { GRID_SIZE, MAX_SCALE, MIN_SCALE, SEAT, STAGE_HEIGHT, STAGE_WIDTH } from "./constants";

interface CircleData {
  id: number;
  x: number;
  y: number;
  name: string;
}

enum ACTION {
  Mouse = "Mouse",
  Seat = "Seat",
}

const App: React.FC = () => {
  const [selectedCircle, setSelectedCircle] = useState<CircleData | null>(null);
  const [actionType, setActionType] = useState<ACTION>(ACTION.Mouse);
  const stageRef = useRef<any>(null);
  const [seats, setSeats] = useState<CircleData[]>([]);
  const [ghostCircle, setGhostCircle] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleWheel = (e:  KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const scaleBy = 1.05;
    let newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

    newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newX = pointer.x - mousePointTo.x * newScale;
    const newY = pointer.y - mousePointTo.y * newScale;

    stage.scale({ x: newScale, y: newScale });
    stage.position({ x: newX, y: newY });
    stage.batchDraw();
  };

  const handleCircleClick = (e:  React.MouseEvent<SVGElement>) => {
    setActionType(ACTION.Seat);
    const { clientX, clientY } = e;
    setGhostCircle({ x: clientX, y: clientY });
    setIsDragging(true);
  };

  const handleStageClick = () => {
    if (!ghostCircle) return;
    const stage = stageRef.current.getStage();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const scale = stage.scaleX();
    const correctedX = (pointer.x - stage.x()) / scale;
    const correctedY = (pointer.y - stage.y()) / scale;

    const snappedX = Math.round(correctedX / GRID_SIZE) * GRID_SIZE;
    const snappedY = Math.round(correctedY / GRID_SIZE) * GRID_SIZE;

    setSeats((prev) => [
      ...prev,
      { id: Date.now(), x: snappedX, y: snappedY, name: "" },
    ]);
  };

  const handleMouseMove = () => {
    if (!isDragging) return;
    const stage = stageRef.current.getStage();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const scale = stage.scaleX();

    const correctedX = (pointer.x - stage.x()) / scale;
    const correctedY = (pointer.y - stage.y()) / scale;

    if (actionType === ACTION.Seat) {
      setGhostCircle({
        x: Math.round(correctedX / GRID_SIZE) * GRID_SIZE,
        y: Math.round(correctedY / GRID_SIZE) * GRID_SIZE,
      });
    }
  };


  const handleSeatClick = (circle: CircleData) => {
    setSelectedCircle(circle);
  };

  const handleEditSeat = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedCircle((prev) =>
      prev ? { ...prev, name: e.target.value } : null
    );
  };

  const handleSaveSeat = () => {
    setSeats((prev) =>
      prev.map((circle) =>
        circle.id === selectedCircle?.id
          ? { ...circle, name: selectedCircle.name }
          : circle
      )
    );
    setSelectedCircle(null);
  };

  const handleDeleteSeat = () => {
    setSeats((prev) =>
      prev.filter((circle) => circle.id !== selectedCircle?.id)
    );
    setSelectedCircle(null);
  };

  const handleDragEnd = (e: KonvaEventObject<DragEvent>, circleId: number) => {
    const node = e.target;
    const newX = node.x();
    const newY = node.y();
  
    setSeats(prev => 
      prev.map(circle => 
        circle.id === circleId 
          ? { ...circle, x: newX, y: newY }
          : circle
      )
    );
  };

  return (
    <div className="flex gap-1 p-5">
      <div className="flex flex-col bg-gray-300 items-center gap-2 p-2">
        <MousePointer
          color={actionType === ACTION.Mouse ? "blue" : "black"}
          className="cursor-pointer"
          onClick={() => {
            setGhostCircle(null);
            setActionType(ACTION.Mouse);
          }}
        />
        <CircleIcon
          onMouseDown={handleCircleClick}
          color={actionType === ACTION.Seat ? "blue" : "black"}
          className="cursor-pointer"
        />
      </div>

    
        <Stage
        onClick={handleStageClick}
        onMouseMove={handleMouseMove}
          width={STAGE_WIDTH}
          height={STAGE_HEIGHT}
          ref={stageRef}
          draggable
          onWheel={handleWheel}
        >
          <Layer>
            <GridMap />
            {seats.map((circle) => (
              <Group
                key={circle.id}
                x={circle.x}
                y={circle.y}
                draggable
                onClick={(e) => {
                  e.cancelBubble = true;
                  handleSeatClick(circle);
                }}
                onDragEnd={(e) => handleDragEnd(e, circle.id)}
              >
                <Circle radius={SEAT.RADIUS} fill="blue" />
                <Text
                  text={circle.name}
                  fontSize={12}
                  fill="white"
                  align="center"
                  verticalAlign="middle"
                  width={30}
                  height={30}
                  offsetX={15}
                  offsetY={15}
                />
              </Group>
            ))}

            {ghostCircle && (
              <>
                <Circle
                  x={ghostCircle.x}
                  y={ghostCircle.y}
                  radius={SEAT.RADIUS}
                  fill="rgba(0,0,255,0.5)"
                />
                <Line
                  points={[0, ghostCircle.y-SEAT.RADIUS, STAGE_WIDTH, ghostCircle.y-SEAT.RADIUS]}
                  stroke="red"
                  strokeWidth={1}
                  dash={[4, 4]}
                />
                 <Line
                  points={[0, ghostCircle.y+SEAT.RADIUS, STAGE_WIDTH, ghostCircle.y+SEAT.RADIUS]}
                  stroke="red"
                  strokeWidth={1}
                  dash={[4, 4]}
                />
                 <Line
                  points={[ghostCircle.x-SEAT.RADIUS, 0, ghostCircle.x-SEAT.RADIUS, STAGE_HEIGHT]}
                  stroke="red"
                  strokeWidth={1}
                  dash={[4, 4]}
                />
                <Line
                  points={[ghostCircle.x+SEAT.RADIUS, 0, ghostCircle.x+SEAT.RADIUS, STAGE_HEIGHT]}
                  stroke="red"
                  strokeWidth={1}
                  dash={[4, 4]}
                />
              </>
            )}
          </Layer>
        </Stage>
      {/* edit form */}
      {selectedCircle && (
        <div className=" top-5 right-5 bg-white shadow-lg p-4 border rounded-md">
          <h2 className="text-lg font-bold text-center">Edit Info</h2>
          <input
            type="text"
            className="border p-2 w-full"
            value={selectedCircle.name}
            onChange={handleEditSeat}
          />
          <div className="flex justify-end gap-2 mt-3">
            <button
              className="!bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleSaveSeat}
            >
              Save
            </button>
            <button
              className="!bg-red-500 text-white px-4 py-2 rounded"
              onClick={handleDeleteSeat}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
