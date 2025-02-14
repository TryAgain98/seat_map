import React, { useRef, useState } from "react";
import { Stage, Layer, Circle, Text, Group, Rect } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";
import { GridMap } from "./components/map/GridMap";
import {
  GRID_SIZE,
  MAX_SCALE,
  MIN_SCALE,
  SEAT,
  STAGE_HEIGHT,
  STAGE_WIDTH,
} from "./constants";
import Action, { ACTION } from "./components/map/Action";
import GhostSeat from "./components/map/seat/GhostSeat";

interface SeatData {
  id: number;
  x: number;
  y: number;
  name: string;
  isSelected?: boolean;
}

const App: React.FC = () => {
  const [selectedSeat, setSelectedSeat] = useState<SeatData | null>(null);
  const [actionType, setActionType] = useState<ACTION>(ACTION.Mouse);
  const stageRef = useRef<any>(null);

  const [seats, setSeats] = useState<SeatData[]>([]);
  const [ghostSeat, setGhostSeat] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const seatsDeleted = seats.filter((seat) => seat.isSelected);

  //select multiple
  const [selectionBox, setSelectionBox] = useState<{
    start: { x: number; y: number } | null;
    current: { x: number; y: number } | null;
  }>({ start: null, current: null });
  const [isSelecting, setIsSelecting] = useState(false);

  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
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

  const handleStageClick = () => {
    if (!ghostSeat) return;
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
    const stage = stageRef.current.getStage();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const scale = stage.scaleX();

    const correctedX = (pointer.x - stage.x()) / scale;
    const correctedY = (pointer.y - stage.y()) / scale;

    if (actionType === ACTION.Seat) {
      setGhostSeat({
        x: Math.round(correctedX / GRID_SIZE) * GRID_SIZE,
        y: Math.round(correctedY / GRID_SIZE) * GRID_SIZE,
      });
    } else if (isSelecting) {
      setSelectionBox((prev) => ({
        ...prev,
        current: { x: correctedX, y: correctedY },
      }));

      if (selectionBox.start) {
        const x1 = Math.min(selectionBox.start.x, correctedX);
        const x2 = Math.max(selectionBox.start.x, correctedX);
        const y1 = Math.min(selectionBox.start.y, correctedY);
        const y2 = Math.max(selectionBox.start.y, correctedY);
        setSeats(
          seats.map((seat) => ({
            ...seat,
            isSelected:
              seat.x >= x1 && seat.x <= x2 && seat.y >= y1 && seat.y <= y2,
          }))
        );
        // const selectedSeats = seats.filter(
        //   (seat) => seat.x >= x1 && seat.x <= x2 && seat.y >= y1 && seat.y <= y2
        // );
        // setSelectedSeats(selectedSeats);
      }
    }
  };

  const handleSeatClick = (circle: SeatData) => {
    setSelectedSeat(circle);
  };

  const handleEditSeat = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedSeat((prev) =>
      prev ? { ...prev, name: e.target.value } : null
    );
  };

  const handleSaveSeat = () => {
    setSeats((prev) =>
      prev.map((circle) =>
        circle.id === selectedSeat?.id
          ? { ...circle, name: selectedSeat.name }
          : circle
      )
    );
    setSelectedSeat(null);
  };

  const handleDeleteSeat = () => {
    setSeats((prev) => prev.filter((circle) => circle.id !== selectedSeat?.id));
    setSelectedSeat(null);
  };

  const handleDragEnd = (e: KonvaEventObject<DragEvent>, circleId: number) => {
    const node = e.target;
    const newX = node.x();
    const newY = node.y();

    setSeats((prev) =>
      prev.map((circle) =>
        circle.id === circleId ? { ...circle, x: newX, y: newY } : circle
      )
    );
  };

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    if (actionType !== ACTION.Mouse) return;

    const stage = stageRef.current;
    const point = stage.getPointerPosition();
    const scale = stage.scaleX();

    setIsSelecting(true);
    setSelectionBox({
      start: {
        x: (point.x - stage.x()) / scale,
        y: (point.y - stage.y()) / scale,
      },
      current: {
        x: (point.x - stage.x()) / scale,
        y: (point.y - stage.y()) / scale,
      },
    });
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
    setSelectionBox({ start: null, current: null });
  };

  const handleDeleteSelectedSeats = () => {
    setSeats((prev) => prev.filter((seat) => !seat.isSelected));
  };

  return (
    <div className="flex gap-1 p-5">
      <Action
        actionType={actionType}
        setActionType={setActionType}
        setGhostSeat={setGhostSeat}
      />
      <div className="border-gray-300 border-[1px]">
        <Stage
          onClick={handleStageClick}
          onMouseMove={handleMouseMove}
          width={STAGE_WIDTH}
          height={STAGE_HEIGHT}
          ref={stageRef}
          // draggable
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        >
          <Layer>
            <GridMap stageRef={stageRef} />
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
                <Circle
                  radius={SEAT.RADIUS}
                  fill={circle.isSelected ? "red" : "blue"}
                />
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

            <GhostSeat ghostSeat={ghostSeat} stageRef={stageRef} />

            {/* Vẽ selection box */}
            {isSelecting && selectionBox.start && selectionBox.current && (
              <Group>
                <Rect
                  x={Math.min(selectionBox.start.x, selectionBox.current.x)}
                  y={Math.min(selectionBox.start.y, selectionBox.current.y)}
                  width={Math.abs(
                    selectionBox.current.x - selectionBox.start.x
                  )}
                  height={Math.abs(
                    selectionBox.current.y - selectionBox.start.y
                  )}
                  fill="rgba(0, 0, 255, 0.1)"
                  stroke="blue"
                />
              </Group>
            )}
          </Layer>
        </Stage>
      </div>

      {seatsDeleted.length > 0 && (
        <button
          className="!bg-red-500 h-12 text-white px-4  rounded disabled:opacity-50"
          onClick={handleDeleteSelectedSeats}
        >
          Delete seats {seatsDeleted.length}
        </button>
      )}
      {/* edit form */}
      {selectedSeat && (
        <div className=" top-5 right-5 bg-white shadow-lg p-4 border rounded-md">
          <h2 className="text-lg font-bold text-center">Edit Info</h2>
          <input
            type="text"
            className="border p-2 w-full"
            value={selectedSeat.name}
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
