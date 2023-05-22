import React from "react";
import { usePreview } from "react-dnd-preview";

interface TilePreviewProps {
  letter: string | undefined;
  points: number | undefined;
}

const TilePreview: React.FC<TilePreviewProps> = ({ letter, points }) => {
  const preview = usePreview();
  if (!preview.display) {
    return null;
  }

  return (
    <div
      className={`relative w-14 h-14 flex justify-center items-center text-2xl
       border-[1px] shadow-[0px_2px_black] border-black rounded-lg cursor-grabbing`}
      style={{ backgroundColor: "yellow", opacity: 0.5 }}
    >
      {letter}
      <div className={"absolute top-0 right-1 text-sm"}>{points}</div>
    </div>
  );
};

export default TilePreview;
