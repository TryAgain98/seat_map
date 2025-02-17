import { TextData } from "../../types/text";
import { useRef, useEffect } from "react";

interface TextEditorProps {
  data: TextData[];
  selectedId: string;
  setData: React.Dispatch<React.SetStateAction<TextData[]>>;
}

export function TextEditor({ data, selectedId, setData }: TextEditorProps) {
  const textData = data.find((text) => text.id === selectedId);
  const textInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus and select the text input when the editor opens
    if (textInputRef.current) {
      textInputRef.current.focus();
      textInputRef.current.select();
    }
  }, [selectedId]);

  if (!textData) return null;

  return (
    <div className="top-5 right-5 bg-white shadow-lg p-4 border rounded-md">
      <h2 className="text-lg font-bold text-center mb-4">Edit Text</h2>

      <div className="flex flex-col space-y-4">
        <div className="flex flex-col">
          <label className="text-sm font-bold">Text</label>
          <input
            ref={textInputRef}
            type="text"
            className="border p-2 w-full"
            value={textData.text}
            onChange={(e) =>
              setData((prev) =>
                prev.map((text) =>
                  text.id === selectedId
                    ? { ...text, text: e.target.value }
                    : text
                )
              )
            }
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-bold">Color</label>
          <input
            type="color"
            className="border w-full h-8"
            value={textData.fill || "#000000"}
            onChange={(e) =>
              setData((prev) =>
                prev.map((text) =>
                  text.id === selectedId
                    ? { ...text, fill: e.target.value }
                    : text
                )
              )
            }
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-bold">Font Size</label>
          <input
            type="number"
            className="border p-2 w-full"
            value={textData.fontSize || 16}
            onChange={(e) =>
              setData((prev) =>
                prev.map((text) =>
                  text.id === selectedId
                    ? { ...text, fontSize: Number(e.target.value) }
                    : text
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
            setData((prev) => prev.filter((text) => text.id !== selectedId))
          }
        >
          Delete
        </button>
      </div>
    </div>
  );
}
