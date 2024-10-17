import { FC } from "react";

interface PdfRendererProps {
  url: string;
}

export const PdfRenderer: FC<PdfRendererProps> = ({ url }) => {
  return (
    <div className="w-full bg-white rounded-md shadow flex flex-col items-center">
      <div className="h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2">
        {/* Top bar */}
        <div className="flex items-center gap-1.5"></div>
      </div>
    </div>
  );
};
