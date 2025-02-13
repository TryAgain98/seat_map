import React, { useRef, useState } from "react";
import { Stage, Layer, Circle, Line, Text, Group } from "react-konva";
import View from "./View";

const GRID_SIZE = 50;
const STAGE_WIDTH = 800;
const STAGE_HEIGHT = 800;
const SCALE_FACTOR = 1.1;

interface CircleData {
  id: number;
  x: number;
  y: number;
  name: string;
}

const App: React.FC = () => {
  const stageRef = useRef<any>(null);
  const [circles, setCircles] = useState<CircleData[]>([]);
  const [scale, setScale] = useState(1);
  const [selectedCircle, setSelectedCircle] = useState<CircleData | null>(null);
  const [circleName, setCircleName] = useState("");

  const handleDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData("circle", "true");
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    if (!stageRef.current) return;

    const stage = stageRef.current.getStage();
    const stageBox = stage.container().getBoundingClientRect();

    const mouseX = event.clientX;
    const mouseY = event.clientY;

    const x = (mouseX - stageBox.left) / scale;
    const y = (mouseY - stageBox.top) / scale;

    if (x < 0 || y < 0 || x > STAGE_WIDTH || y > STAGE_HEIGHT) {
      return;
    }

    setCircles((prevCircles) => [
      ...prevCircles,
      { id: Date.now(), x, y, name: "" },
    ]);
  };

  const handleDragMove = (e: any, id: number) => {
    const { x, y } = e.target.position();
    setCircles((prevCircles) =>
      prevCircles.map((circle) =>
        circle.id === id ? { ...circle, x, y } : circle
      )
    );
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const stage = stageRef.current.getStage();
    const oldScale = stage.scaleX();
    const mousePointTo = {
      x: (e.clientX - stage.x()) / oldScale,
      y: (e.clientY - stage.y()) / oldScale,
    };

    const newScale =
      e.deltaY > 0 ? oldScale / SCALE_FACTOR : oldScale * SCALE_FACTOR;
    setScale(newScale);

    stage.scale({ x: newScale, y: newScale });

    const newPos = {
      x: e.clientX - mousePointTo.x * newScale,
      y: e.clientY - mousePointTo.y * newScale,
    };

    stage.position(newPos);
    stage.batchDraw();
  };

  const handleCircleClick = (circle: CircleData) => {
    setSelectedCircle(circle);
    setCircleName(circle.name);
  };

  const handleSave = () => {
    if (selectedCircle) {
      setCircles((prevCircles) =>
        prevCircles.map((circle) =>
          circle.id === selectedCircle.id
            ? { ...circle, name: circleName }
            : circle
        )
      );
      setSelectedCircle(null);
    }
  };

  const handleDelete = () => {
    if (selectedCircle) {
      setCircles((prevCircles) =>
        prevCircles.filter((circle) => circle.id !== selectedCircle.id)
      );
      setSelectedCircle(null);
    }
  };

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

  const handleSaveAll = () => {
    console.log("Saved circles:", circles);
    // Sau này có thể gửi API
    // fetch("/api/save", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(circles),
    // });
  };

  return (
    <div className="flex gap-5 p-5">
      <div className="flex flex-col">
        <div
          className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white text-sm cursor-grab"
          draggable
          onDragStart={handleDragStart}
        ></div>
        <button
          className="!bg-green-500 !h-10 text-white px-3 py-1 rounded mt-2"
          onClick={handleSaveAll}
        >
          Create
        </button>
      </div>

      <div
        className="border border-gray-300 w-[800px] h-[800px] overflow-hidden relative"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onWheel={handleWheel}
      >
        <Stage
          width={STAGE_WIDTH}
          height={STAGE_HEIGHT}
          ref={stageRef}
          draggable
        >
          <Layer>
            {renderGrid()}

            {circles.map((circle) => (
              <Group
                key={circle.id}
                x={circle.x}
                y={circle.y}
                draggable
                onDragMove={(e) => handleDragMove(e, circle.id)}
                onClick={() => handleCircleClick(circle)}
              >
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

        {selectedCircle && (
          <div
            className="absolute bg-white p-3 border shadow-lg rounded-md"
            style={{
              top: selectedCircle.y + 30,
              left: selectedCircle.x + 10,
            }}
          >
            <input
              className="border p-1 w-full"
              type="text"
              value={circleName}
              onChange={(e) => setCircleName(e.target.value)}
              placeholder="Nhập tên"
            />
            <button
              className="!bg-blue-500 text-white px-3 py-1 mt-2 w-full rounded"
              onClick={handleSave}
            >
              save
            </button>
            <button
              className="!bg-red-500 text-white px-3 py-1 mt-2 w-full rounded"
              onClick={handleDelete}
            >
              delete
            </button>
          </div>
        )}
      </div>
      <View circles={circles} />
    </div>
  );
};

export default App;
