import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Examples from "./pages/Examples";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <div>something went wrong</div>,
  },
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
]);

export default router;
