import { Group, Rect } from "react-konva";

interface IProps {
  isSelecting: boolean;
  selectionBox: {
    start: { x: number; y: number } | null;
    current: { x: number; y: number } | null;
  };
}
function SelectionBox({ selectionBox, isSelecting }: IProps) {
  return (
    <>
      {isSelecting && selectionBox.start && selectionBox.current && (
        <Group>
          <Rect
            x={Math.min(selectionBox.start.x, selectionBox.current.x)}
            y={Math.min(selectionBox.start.y, selectionBox.current.y)}
            width={Math.abs(selectionBox.current.x - selectionBox.start.x)}
            height={Math.abs(selectionBox.current.y - selectionBox.start.y)}
            fill="rgba(0, 0, 255, 0.1)"
            stroke="blue"
          />
        </Group>
      )}
    </>
  );
}

export default SelectionBox;
