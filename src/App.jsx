import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "./pages/Root";
import ErrorPage from "./pages/Error";
import Homepge from "./pages/Home";
import Listone from "./pages/Listone";
import Classifica from "./pages/Classifica";
import Profilo from "./pages/Profilo";
import InserimentoFormazione from "./pages/InserimentoFormazione";
import Login from "./pages/Login";
import CreateTeam from "./pages/CreateTeam";

const router = createBrowserRouter([
  { path: '/', 
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
    { index: true, element: <Homepge />},
    { path: '/listone', element: <Listone />},
    { path: '/classifica', element: <Classifica />},
    { path: '/profilo', element: <Profilo />},
    { path: '/inserisci-formazione', element: <InserimentoFormazione />},
    { path: '/crea-squadra', element: <CreateTeam />},
    { path: '/login', element: <Login />},
  ]},
])

function App() {
  return <RouterProvider router={router} />;
}

export default App;
