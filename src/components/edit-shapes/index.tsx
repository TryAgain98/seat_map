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
      <h2 className="text-lg font-bold text-center">Edit Info</h2>
      <input
        type="text"
        className="border p-2 w-full"
        value={shapeData.label}
        onChange={handleEditSeat}
      />
      <input
        type="color"
        className="border p-2 w-full"
        value={color}
        onChange={handleEditColor}
      />
      <div className="flex justify-end gap-2 mt-3">
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
