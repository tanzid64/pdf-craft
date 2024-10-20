import { Expand, Loader2 } from "lucide-react";
import { FC, useState } from "react";
import { Document, Page } from "react-pdf";
import { useResizeDetector } from "react-resize-detector";
import SimpleBar from "simplebar-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface PdfFullScreenProps {
  url: string;
}

export const PdfFullScreen: FC<PdfFullScreenProps> = ({ url }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [numPages, setNumPages] = useState<number | undefined>(undefined);
  const { width, ref } = useResizeDetector();
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) setIsOpen(v);
      }}
    >
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        <Button
          variant={"ghost"}
          aria-label="Open fullscreen"
          className="gap-1.5"
        >
          <Expand className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl w-full">
        <SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)] mt-6">
          <div ref={ref}>
            <Document
              onLoadSuccess={({ numPages }) => {
                setNumPages(numPages);
              }}
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
              {new Array(numPages).fill(0).map((_, i) => (
                <Page key={i} width={width ? width : 1} pageNumber={i + 1} />
              ))}
            </Document>
          </div>
        </SimpleBar>
      </DialogContent>
    </Dialog>
  );
};
