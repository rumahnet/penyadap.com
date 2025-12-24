import * as React from "react"

/**
 * VisuallyHidden component for hiding content from sighted users
 * while keeping it visible to screen reader users.
 * 
 * Useful for DialogTitle that should be semantically present but visually hidden.
 * Reference: https://radix-ui.com/primitives/docs/utilities/visually-hidden
 */
const VisuallyHidden = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className="sr-only"
    {...props}
  />
))
VisuallyHidden.displayName = "VisuallyHidden"

export { VisuallyHidden }
