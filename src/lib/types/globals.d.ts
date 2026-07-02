// CSS side-effect imports (e.g. import "@/app/globals.css")
declare module "*.css";

// SVG as React components (needed later when we add icons)
declare module "*.svg" {
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}
