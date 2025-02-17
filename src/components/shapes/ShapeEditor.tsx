import { ShapeData } from "../../types/shape";

interface ShapeEditorProps {
  data: ShapeData[];
  selectedId: string;
  setData: React.Dispatch<React.SetStateAction<ShapeData[]>>;
}

export function ShapeEditor({ data, selectedId, setData }: ShapeEditorProps) {
  const shapeData = data.find((shape) => shape.id === selectedId);

  if (!shapeData) return null;
  return (
    <div className="top-5 right-5 bg-white shadow-lg p-4 border rounded-md">
      <h2 className="text-lg font-bold text-center mb-4">Edit Shape</h2>

      <div className="flex flex-col space-y-4">
        <div className="flex flex-col">
          <label className="text-sm font-bold">Label</label>
          <input
            type="text"
            className="border p-2 w-full"
            value={shapeData.label || ""}
            onChange={(e) =>
              setData((prev) =>
                prev.map((shape) =>
                  shape.id === selectedId
                    ? { ...shape, label: e.target.value }
                    : shape
                )
              )
            }
            placeholder="Enter label"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-bold">Color</label>
          <input
            type="color"
            className="border w-full h-8"
            value={shapeData.color || "#000000"}
            onChange={(e) =>
              setData((prev) =>
                prev.map((shape) =>
                  shape.id === selectedId
                    ? { ...shape, color: e.target.value }
                    : shape
                )
              )
            }
          />
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          onClick={() =>
            setData((prev) => prev.filter((shape) => shape.id !== selectedId))
          }
        >
          Delete
        </button>
      </div>
    </div>
  );
}
