import { createBrowserRouter } from "react-router-dom";
import OuterShell from "./pages/OuterShell";
import Home from "./pages/home/Home";
import About from "./pages/about/About";
import Examples from "./pages/createJSON/examples/Examples";
import CreateJSON from "./pages/createJSON/CreateJSON";
import Studio from "./pages/studio/Studio";

const router = createBrowserRouter([
  {
    path: "/",
    element: <OuterShell />,
    errorElement: <div>something went wrong</div>,
    children: [
      { index: true, element: <Home /> },
      {
        path: "examples",
        element: <Examples />,
        children: [
          {
            path: ":exampleName",
            element: <Examples />,
          },
        ],
      },
      {
        path: "studio",
        element: <Studio />,
        children: [
          {
            path: ":projectName",
            element: <Studio />,
          },
        ],
      },
      {
        path: "create-json",
        element: <CreateJSON />,
        children: [
          {
            path: ":tab",
            element: <CreateJSON />,
          },
        ],
      },
      {
        path: "about",
        element: <About />,
      },
    ],
  },
]);

export default router;
