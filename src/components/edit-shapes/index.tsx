import { useState } from "react";

interface ShapeInfo {
  label: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
}
interface EditShapeProps {
  shapeInfo: ShapeInfo;
  onSave: (shapeInfo: ShapeInfo) => void;
  onDelete: () => void;
}

export function EditShape({ shapeInfo, onSave, onDelete }: EditShapeProps) {
  const [label, setLabel] = useState(shapeInfo.label);

  const handleEditSeat = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(e.target.value);
  };

  return (
    <div className=" top-5 right-5 bg-white shadow-lg p-4 border rounded-md">
      <h2 className="text-lg font-bold text-center">Edit Info</h2>
      <input
        type="text"
        className="border p-2 w-full"
        value={shapeInfo.label}
        onChange={handleEditSeat}
      />
      <div className="flex justify-end gap-2 mt-3">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => onSave({ ...shapeInfo, label })}
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
