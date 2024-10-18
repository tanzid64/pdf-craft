"use client";
import { Loader2 } from "lucide-react";
import { FC } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { toast } from "sonner";

// worker to render pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

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
      <div className="flex-1 w-full max-h-screen">
        <div>
          <Document
            loading={
              <div className="flex justify-center">
                <Loader2 className="animate-spin my-24 h-6 w-6" />
              </div>
            }
            onLoadError={() => {
              toast.error("Failed to load PDF", {
                description: "Please try again later.",
              });
            }}
            file={url}
            className="max-h-full"
          >
            <Page pageNumber={1} renderAnnotationLayer={false} />
          </Document>
        </div>
      </div>
    </div>
  );
};
