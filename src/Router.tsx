import { lazy, Suspense, type ReactNode } from "react";
import { createBrowserRouter } from "react-router-dom";
import OuterShell from "./pages/OuterShell";

const Home = lazy(() => import("./pages/home/Home"));
const About = lazy(() => import("./pages/about/About"));
const Quickstart = lazy(() => import("./pages/quickstart/Quickstart"));
const Examples = lazy(() => import("./pages/examples/Examples"));
const CreateJSON = lazy(() => import("./pages/createJSON/CreateJSON"));
const Studio = lazy(() => import("./pages/studio/Studio"));
const ApiDocs = lazy(() => import("./pages/api/ApiDocs"));

function routeElement(element: ReactNode) {
  return <Suspense fallback={null}>{element}</Suspense>;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <OuterShell />,
    errorElement: <div>something went wrong</div>,
    children: [
      { index: true, element: routeElement(<Home />) },
      {
        path: "examples",
        element: routeElement(<Examples />),
        children: [
          {
            path: ":exampleName",
            element: routeElement(<Examples />),
          },
        ],
      },
      {
        path: "studio",
        element: routeElement(<Studio />),
        children: [
          {
            path: ":projectName",
            element: routeElement(<Studio />),
          },
        ],
      },
      {
        path: "create-json",
        element: routeElement(<CreateJSON />),
        children: [
          {
            path: ":tab",
            element: routeElement(<CreateJSON />),
          },
        ],
      },
      {
        path: "quickstart",
        element: routeElement(<Quickstart />),
      },
      {
        path: "about",
        element: routeElement(<About />),
      },
      {
        path: "api",
        element: routeElement(<ApiDocs />),
      },
    ],
  },
]);

export default router;
