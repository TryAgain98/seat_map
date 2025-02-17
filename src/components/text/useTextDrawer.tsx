import { useCallback } from "react";
import { KonvaEventObject } from "konva/lib/Node";
import { ActionType } from "../../types/action";
import { TextData } from "../../types/text";
import Konva from "konva";

interface UseTextDrawerProps {
  actionType: ActionType;
  stageRef: React.RefObject<Konva.Stage | null>;
  texts: TextData[];
  setTexts: React.Dispatch<React.SetStateAction<TextData[]>>;
  onAdded: (text: TextData) => void;
}

export function useTextDrawer({
  actionType,
  setTexts,
  onAdded,
}: UseTextDrawerProps) {
  const handleTextClick = useCallback(
    (x: number, y: number) => {
      if (actionType !== ActionType.Text) return;

      const newText: TextData = {
        id: Date.now().toString(),
        x,
        y,
        text: " ",
        fontSize: 16,
        fill: "#000000",
      };

      setTexts((prev) => [...prev, newText]);
      onAdded(newText);
    },
    [actionType, setTexts, onAdded]
  );

  const handleTextDblClick = (
    e: KonvaEventObject<MouseEvent>,
    text: TextData
  ) => {
    if (actionType !== ActionType.Mouse) return;

    const textNode = e.target;
    const stage = textNode.getStage();
    if (!stage) return;

    // Create textarea over the text
    const textPosition = textNode.absolutePosition();

    const textarea = document.createElement("textarea");
    document.body.appendChild(textarea);

    textarea.value = text.text;
    textarea.style.position = "absolute";
    textarea.style.top = `${textPosition.y}px`;
    textarea.style.left = `${textPosition.x}px`;
    textarea.style.width = `${textNode.width()}px`;
    textarea.style.height = `${textNode.height()}px`;
    textarea.style.fontSize = `${text.fontSize}px`;
    textarea.style.border = "none";
    textarea.style.padding = "0px";
    textarea.style.margin = "0px";
    textarea.style.overflow = "hidden";
    textarea.style.background = "none";
    textarea.style.outline = "none";
    textarea.style.resize = "none";
    textarea.style.lineHeight = text.fontSize + "px";
    textarea.style.fontFamily = "sans-serif";
    textarea.style.transformOrigin = "left top";
    textarea.style.textAlign = "left";
    textarea.style.color = text.fill || "#000000";

    textarea.focus();

    textarea.addEventListener("blur", function () {
      const newText = textarea.value;
      setTexts((prev) =>
        prev.map((t) => (t.id === text.id ? { ...t, text: newText } : t))
      );
      document.body.removeChild(textarea);
    });

    textarea.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) {
        textarea.blur();
      }
      if (e.key === "Escape") {
        document.body.removeChild(textarea);
      }
    });
  };

  return {
    handleTextClick,
    handleTextDblClick,
  };
}
