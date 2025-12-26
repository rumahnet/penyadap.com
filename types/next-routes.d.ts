// Project-level module declaration to satisfy imports like `./routes.js` used in generated files
// This makes the types available to the validator generated in `.next/dev/types/validator.ts`

declare module "./routes.js" {
  export type AppRoutes = string
  export type LayoutRoutes = string
  export type AppRouteHandlerRoutes = string
  export type ParamMap = Record<string, any>

  export type LayoutProps<Route extends LayoutRoutes = LayoutRoutes> = {
    params: Promise<ParamMap[Route]> | ParamMap[Route]
  } & Record<string, any>
}

// Also expose a global alias used by generated validator files that reference `LayoutProps` without importing it
declare global {
  type LayoutProps<Route extends import("./routes.js").LayoutRoutes = import("./routes.js").LayoutRoutes> = import("./routes.js").LayoutProps<Route>
}
