import * as React from "react";
import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
  type PanelResizeHandleProps,
} from "react-resizable-panels";

import { cn } from "@/lib/utils";

export const ResizablePanelGroup = PanelGroup;
export const ResizablePanel = Panel;

export interface ResizableHandleProps extends PanelResizeHandleProps {
  withHandle?: boolean;
}

export const ResizableHandle = React.forwardRef<HTMLDivElement, ResizableHandleProps>(
  ({ className, withHandle = false, ...props }, ref) => (
    <PanelResizeHandle
      ref={ref}
      className={cn("relative w-px bg-border hover:bg-border/80 transition-colors", className)}
      {...props}
    >
      {withHandle && (
        <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-border" />
      )}
    </PanelResizeHandle>
  )
);
ResizableHandle.displayName = "ResizableHandle";

