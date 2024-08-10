import { createBrowserRouter } from "react-router-dom";
import OuterShell from "./pages/OuterShell";
import Home from "./pages/Home";
import Examples from "./pages/Examples";

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
        path: "about",
        element: <div>About</div>,
      },
    ],
  },
]);

export default router;
