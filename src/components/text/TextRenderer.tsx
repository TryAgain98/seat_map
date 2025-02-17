import { Text } from "react-konva";
import { TextData } from "../../types/text";
import { ActionType } from "../../types/action";
import { SELECTED_SHAPE_STROKE_COLOR } from "../../constants";
import { useEffect, useCallback } from "react";

interface TextRendererProps {
  texts: TextData[];
  setTexts: React.Dispatch<React.SetStateAction<TextData[]>>;
  actionType: ActionType;
  selectedText: TextData | null;
  setSelectedText: (text: TextData | null) => void;
  handleTextDblClick: (e: any, text: TextData) => void;
}

export function TextRenderer({
  texts,
  setTexts,
  actionType,
  selectedText,
  setSelectedText,
  handleTextDblClick,
}: TextRendererProps) {
  // Handle outside click
  const handleStageClick = useCallback(
    (e: MouseEvent) => {
      // Check if the click is on the stage itself (not on a text)
      const target = e.target as HTMLElement;
      if (target.tagName === "CANVAS") {
        setSelectedText(null);
      }
    },
    [setSelectedText]
  );

  useEffect(() => {
    // Add click listener when a text is selected
    if (selectedText) {
      document.addEventListener("click", handleStageClick);
    }

    // Cleanup listener
    return () => {
      document.removeEventListener("click", handleStageClick);
    };
  }, [selectedText, handleStageClick]);

  return (
    <>
      {texts.map((text) => {
        const isSelected = selectedText?.id === text.id;
        return (
          <Text
            key={text.id}
            {...text}
            draggable={actionType === ActionType.Mouse}
            onClick={(e) => {
              e.cancelBubble = true;
              if (actionType === ActionType.Mouse) {
                setSelectedText(text);
              }
            }}
            onDblClick={(e) => handleTextDblClick(e, text)}
            onDragEnd={(e) => {
              const node = e.target;
              const updatedText = {
                ...text,
                x: node.x(),
                y: node.y(),
              };
              setTexts((prev) =>
                prev.map((t) => (t.id === text.id ? updatedText : t))
              );
              setSelectedText(updatedText);
            }}
            stroke={isSelected ? SELECTED_SHAPE_STROKE_COLOR : undefined}
            strokeWidth={isSelected ? 1 : 0}
          />
        );
      })}
    </>
  );
} 