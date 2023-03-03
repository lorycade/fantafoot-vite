import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "./pages/Root";
import ErrorPage from "./pages/Error";
import Homepage from "./pages/Home";
import Listone from "./pages/Listone";
import Classifica from "./pages/Classifica";
import Profilo from "./pages/Profilo";
import InserimentoFormazione from "./pages/InserimentoFormazione";
import Login from "./pages/Login";
import CreateTeam from "./pages/CreateTeam";
import Teams from "./pages/Teams";
import TeamDetail from "./pages/TeamDetail";

const router = createBrowserRouter([
  { path: '/', 
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
    { index: true, element: <Homepage />},
    { path: '/listone', element: <Listone />},
    { path: '/classifica', element: <Classifica />},
    { path: '/profilo', element: <Profilo />},
    { path: '/inserisci-formazione', element: <InserimentoFormazione />},
    { path: '/crea-squadra', element: <CreateTeam />},
    { path: '/login', element: <Login />},
    { path: '/squadre', element: <Teams />},
    { path: '/squadre/:teamId', element: <TeamDetail />},
  ]},
])

function App() {
  return <RouterProvider router={router} />;
}

export default App;
