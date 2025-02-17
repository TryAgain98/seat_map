import React, { useRef, useState } from "react";
import { Stage, Layer, Circle, Text, Group } from "react-konva";
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
import Action from "./components/map/Action";
import GhostSeat from "./components/map/seat/GhostSeat";
import SelectionBox from "./components/map/SelectionBox";
import Konva from "konva";
import { ActionType } from "./types/action";
import { ShapeData } from "./types/shape";
import { ShapeRenderer } from "./components/shapes/ShapeRenderer";
import { ShapePreview } from "./components/shapes/ShapePreview";
import { useShapeDrawer } from "./components/shapes/useShapeDrawer";
import { EditShape } from "./components/edit-shapes";

interface SeatData {
  id: number;
  x: number;
  y: number;
  name: string;
  isSelected?: boolean;
  color?: string;
}

const PRESET_COLORS = ["#FF0000", "#00FF00", "#0000FF", "#FFD700"];

const App: React.FC = () => {
  const [selectedSeat, setSelectedSeat] = useState<SeatData | null>(null);
  const [actionType, setActionType] = useState<ActionType>(ActionType.Mouse);
  const stageRef = useRef<Konva.Stage | null>(null);

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

  // Add new state for shapes
  const [shapes, setShapes] = useState<ShapeData[]>([]);
  const [selectedShape, setSelectedShape] = useState<ShapeData | null>(null);

  const {
    previewShape,
    polygonPoints,
    handleShapeMouseDown,
    handleShapeMouseMove,
    handleShapeMouseUp,
    handleShapeClick,
  } = useShapeDrawer({
    actionType,
    stageRef,
    shapes,
    setShapes,
  });

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
    if (!stageRef.current) return;
    const stage = stageRef.current.getStage();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const scale = stage.scaleX();
    const correctedX = (pointer.x - stage.x()) / scale;
    const correctedY = (pointer.y - stage.y()) / scale;

    if (actionType === ActionType.Seat && ghostSeat) {
      setSeats((prev) => [
        ...prev,
        { id: Date.now(), x: correctedX, y: correctedY, name: "" },
      ]);
    } else {
      handleShapeClick(correctedX, correctedY);
    }
  };

  const handleMouseMove = () => {
    if (!stageRef.current) return;
    const stage = stageRef.current.getStage();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const scale = stage.scaleX();
    const correctedX = (pointer.x - stage.x()) / scale;
    const correctedY = (pointer.y - stage.y()) / scale;

    if (actionType === ActionType.Seat) {
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
      }
    } else {
      handleShapeMouseMove(correctedX, correctedY);
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
    if (actionType === ActionType.Mouse) {
      //handle for select item
      if (!stageRef.current) return;
      const stage = stageRef.current.getStage();
      const point = stage.getPointerPosition();
      const scale = stage.scaleX();

      if (!point) return;
      //handle for select item
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
    } else {
      handleShapeMouseDown(e);
    }
  };

  const handleMouseUp = () => {
    if (actionType === ActionType.Mouse) {
      setIsSelecting(false);
      setSelectionBox({ start: null, current: null });
    } else {
      handleShapeMouseUp();
    }
  };

  const handleDeleteSelectedSeats = () => {
    setSeats((prev) => prev.filter((seat) => !seat.isSelected));
  };

  // Update the setActionType handler
  const handleActionTypeChange = (newActionType: ActionType) => {
    setActionType(newActionType);
    // Deselect shape when changing tools
    setSelectedShape(null);
    setGhostSeat(null);
  };

  return (
    <div className="flex gap-1 p-5">
      <Action
        actionType={actionType}
        setActionType={handleActionTypeChange}
        setGhostSeat={setGhostSeat}
      />
      <div className="border-gray-300 border-[1px]">
        <Stage
          onClick={handleStageClick}
          onMouseMove={handleMouseMove}
          width={STAGE_WIDTH}
          height={STAGE_HEIGHT}
          ref={stageRef}
          draggable={actionType === ActionType.Hand}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          style={{
            cursor: actionType === ActionType.Hand ? "grab" : "default",
          }}
        >
          <Layer>
            <GridMap stageRef={stageRef} />

            <ShapeRenderer
              shapes={shapes}
              setShapes={setShapes}
              actionType={actionType}
              selectedShape={selectedShape}
              setSelectedShape={setSelectedShape}
            />
            <ShapePreview
              previewShape={previewShape}
              actionType={actionType}
              polygonPoints={polygonPoints}
            />

            {seats.map((circle) => (
              <Group
                key={circle.id}
                x={circle.x}
                y={circle.y}
                draggable={actionType === ActionType.Mouse}
                onClick={(e) => {
                  e.cancelBubble = true;
                  handleSeatClick(circle);
                }}
                onDragEnd={(e) => handleDragEnd(e, circle.id)}
              >
                <Circle
                  radius={SEAT.RADIUS}
                  fill={circle.color || "#0000FF"}
                  stroke={
                    selectedSeat?.id === circle.id || circle.isSelected
                      ? "black"
                      : undefined
                  }
                  strokeWidth={
                    selectedSeat?.id === circle.id || circle.isSelected
                      ? 2
                      : undefined
                  }
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

            <SelectionBox
              isSelecting={isSelecting}
              selectionBox={selectionBox}
            />
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
      {/* edit seat form */}
      {selectedSeat && (
        <div className=" top-5 right-5 bg-white shadow-lg p-4 border rounded-md">
          <h2 className="text-lg font-bold text-center">Edit Info</h2>
          <input
            type="text"
            className="border p-2 w-full"
            value={selectedSeat.name}
            onChange={handleEditSeat}
          />
          <div className="flex gap-2 mb-2 mt-2">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                className="w-8 h-8 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{ backgroundColor: color }}
                onClick={() => {
                  setSeats((prev) =>
                    prev.map((seat) =>
                      seat.id === selectedSeat?.id
                        ? { ...seat, color: color }
                        : seat
                    )
                  );
                }}
              />
            ))}
          </div>
          <div className="flex justify-end gap-2 mt-3">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              onClick={handleSaveSeat}
            >
              Save
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              onClick={handleDeleteSeat}
            >
              Delete
            </button>
          </div>
        </div>
      )}
      {/* edit shape form */}
      {selectedShape && (
        <EditShape
          shapeData={selectedShape}
          onSave={(updatedShape) => {
            setShapes((prev) =>
              prev.map((shape) =>
                shape.id === selectedShape.id ? updatedShape : shape
              )
            );
          }}
          onDelete={() => {
            setShapes((prev) =>
              prev.filter((shape) => shape.id !== selectedShape.id)
            );
            setSelectedShape(null);
          }}
        />
      )}
    </div>
  );
};

export default App;
