import { createBrowserRouter } from "react-router-dom";
import OuterShell from "./pages/OuterShell";
import Home from "./pages/Home";
import About from "./pages/About";
import Examples from "./pages/Examples";
import CreateJSON from "./pages/CreateJSON";

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
        path: "create-json",
        element: <CreateJSON />,
      },
      {
        path: "about",
        element: <About />,
      },
    ],
  },
]);

export default router;
