import { useState } from "react";
import { ShapeData } from "../../types/shape";

interface EditShapeProps {
  shapeData: ShapeData;
  onSave: (shapeData: ShapeData) => void;
  onDelete: () => void;
}

export function EditShape({ shapeData, onSave, onDelete }: EditShapeProps) {
  const [label, setLabel] = useState(shapeData.label);
  const [color, setColor] = useState(shapeData.color);

  const handleEditSeat = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(e.target.value);
  };

  const handleEditColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
  };

  return (
    <div className=" top-5 right-5 bg-white shadow-lg p-4 border rounded-md">
      <h2 className="text-lg font-bold text-center mb-4">Edit Info</h2>

      <div className="flex flex-col space-y-4">
        <div className="flex flex-col">
          <label className="text-sm font-bold">Label</label>
          <input
            type="text"
            className="border p-2 w-full"
            value={shapeData.label}
            onChange={handleEditSeat}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-bold">Color</label>
          <input
            type="color"
            className="border w-full h-8"
            value={color}
            onChange={handleEditColor}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => onSave({ ...shapeData, label, color })}
        >
          Save
        </button>
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
