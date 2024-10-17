import { cn } from "@/lib/utils";
import { FC, ReactNode } from "react";

interface MaxWidthWrapperProps {
  className?: string;
  children: ReactNode;
}

/**
 * A wrapper that limits the width of its children to a maximum of
 * `max-w-screen-xl` and centers them horizontally.
 *
 * @param className - Additional class names to apply to the
 *     wrapper element.
 * @param children - The children to be wrapped.
 */

export const MaxWidthWrapper: FC<MaxWidthWrapperProps> = ({
  className,
  children,
}) => {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-screen-xl px-2.5 md:px-20",
        className,
      )}
    >
      {children}
    </div>
  );
};
