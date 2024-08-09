import { RouterProvider } from "react-router-dom";
import router from "./Router";
import NavBar from "./components/NavBar/NavBar";
import "./App.scss";

function App() {
  return (
    <>
      <NavBar />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
