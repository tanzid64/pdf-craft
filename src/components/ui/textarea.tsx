import * as React from "react";

import { cn } from "@/lib/utils";
import TextAreaAutosize, {
  TextareaAutosizeProps,
} from "react-textarea-autosize";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaAutosizeProps>(
  ({ className, ...props }, ref) => {
    return (
      <TextAreaAutosize
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
