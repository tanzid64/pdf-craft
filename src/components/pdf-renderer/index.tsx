"use client";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, ChevronUp, Loader2, Search } from "lucide-react";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { useResizeDetector } from "react-resize-detector";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
// worker to render pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

interface PdfRendererProps {
  url: string;
}

export const PdfRenderer: FC<PdfRendererProps> = ({ url }) => {
  const { width, ref } = useResizeDetector();
  const [numPages, setNumPages] = useState<number | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Handle Input page
  const customPageValidator = z.object({
    page: z.string().refine((page) => {
      Number(page) > 0 && Number(page) <= numPages!;
    }),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<z.infer<typeof customPageValidator>>({
    defaultValues: {
      page: "1",
    },
    resolver: zodResolver(customPageValidator),
  });

  const handlePageSubmit =
    () =>
    ({ page }: z.infer<typeof customPageValidator>) => {
      setCurrentPage(Number(page));
      setValue("page", String(page));
    };

  return (
    <div className="w-full bg-white rounded-md shadow flex flex-col items-center">
      <div className="h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2">
        {/* Top bar */}
        <div className="flex items-center gap-1.5">
          <Button
            aria-label="previous page"
            variant={"ghost"}
            onClick={() =>
              setCurrentPage((prev) => (prev - 1 > 1 ? prev - 1 : 1))
            }
            disabled={currentPage <= 1}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1.5">
            <Input
              {...register("page")}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit(handlePageSubmit)();
                }
              }}
              className={cn(
                "w-12 h-8",
                errors.page && "focus-visible:ring-red-500",
              )}
            />
            <p className="text-sm text-zinc-700 space-x-1">
              <span>/</span>
              <span>{numPages ?? "x"}</span>
            </p>
          </div>

          <Button
            aria-label="next page"
            variant={"ghost"}
            onClick={() =>
              setCurrentPage((prev) =>
                prev + 1 < numPages! ? prev + 1 : numPages!,
              )
            }
            disabled={currentPage === numPages || numPages === undefined}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-label="zoom" variant={"ghost"} className="gap-1.5">
                <Search className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                100%
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex-1 w-full max-h-screen">
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
            <Page width={width ? width : 1} pageNumber={currentPage} />
          </Document>
        </div>
      </div>
    </div>
  );
};
