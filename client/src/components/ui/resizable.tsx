import * as React from "react";

export interface ResizableProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "horizontal" | "vertical";
  minSize?: number;
  maxSize?: number;
}

// Componente mínimo resizável, pronto para expansão futura
export const Resizable = React.forwardRef<HTMLDivElement, ResizableProps>(
  ({ direction = "horizontal", minSize = 100, maxSize = 600, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          resize: direction === "horizontal" ? "horizontal" : "vertical",
          overflow: "auto",
          minWidth: direction === "horizontal" ? minSize : undefined,
          maxWidth: direction === "horizontal" ? maxSize : undefined,
          minHeight: direction === "vertical" ? minSize : undefined,
          maxHeight: direction === "vertical" ? maxSize : undefined,
          ...style,
        }}
        {...props}
      />
    );
  }
);
Resizable.displayName = "Resizable";


export const ResizablePanelGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { direction?: string }>(
  ({ children, direction, ...props }, ref) => (
    <div ref={ref} {...props}>{children}</div>
  )
);
ResizablePanelGroup.displayName = "ResizablePanelGroup";

export const ResizablePanel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { defaultSize?: number, minSize?: number, maxSize?: number }>(
  ({ children, defaultSize, minSize, maxSize, ...props }, ref) => (
    <div ref={ref} {...props}>{children}</div>
  )
);
ResizablePanel.displayName = "ResizablePanel";

export const ResizableHandle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { withHandle?: boolean }>(
  ({ className = "", withHandle, ...props }, ref) => (
    <div ref={ref} className={"cursor-col-resize bg-border/50 w-[1px] "+className} {...props} />
  )
);
ResizableHandle.displayName = "ResizableHandle";
