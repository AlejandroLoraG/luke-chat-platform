"use client"

import * as React from "react"
import {
  Panel as PanelPrimitive,
  PanelGroup as PanelGroupPrimitive,
  PanelResizeHandle as PanelResizeHandlePrimitive,
  type PanelGroupProps,
  type PanelResizeHandleProps,
} from "react-resizable-panels"

import { cn } from "@/lib/utils"

const PanelGroup = ({
  className,
  ...props
}: PanelGroupProps) => (
  <PanelGroupPrimitive
    className={cn(
      "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
      className
    )}
    {...props}
  />
)

const Panel = PanelPrimitive

const PanelResizeHandle = ({
  className,
  ...props
}: PanelResizeHandleProps & {
  withHandle?: boolean
}) => (
  <PanelResizeHandlePrimitive
    className={cn(
      "relative flex w-2 items-center justify-center bg-transparent",
      "after:absolute after:inset-y-0 after:left-1/2 after:w-px after:-translate-x-1/2 after:bg-border",
      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1",
      "data-[resize-handle-active]:after:bg-primary",
      "data-[resize-handle-state=hover]:after:bg-primary",
      "[&[data-resize-handle-active]]:bg-primary/10",
      "[&[data-resize-handle-state=hover]]:bg-primary/5",
      "transition-colors",
      className
    )}
    {...props}
  >
    {/* Optional grip indicator */}
    <div className="z-10 flex h-10 w-1 items-center justify-center rounded-sm bg-border opacity-0 transition-opacity hover:opacity-100 data-[resize-handle-active]:opacity-100">
      <svg
        width="6"
        height="24"
        viewBox="0 0 6 24"
        fill="currentColor"
        className="text-muted-foreground"
      >
        <circle cx="1.5" cy="6" r="1.5" />
        <circle cx="1.5" cy="12" r="1.5" />
        <circle cx="1.5" cy="18" r="1.5" />
        <circle cx="4.5" cy="6" r="1.5" />
        <circle cx="4.5" cy="12" r="1.5" />
        <circle cx="4.5" cy="18" r="1.5" />
      </svg>
    </div>
  </PanelResizeHandlePrimitive>
)

export { PanelGroup, Panel, PanelResizeHandle }
