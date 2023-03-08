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
import RecoverPassword from "./pages/RecoverPassword";
import Signup from "./pages/Signup";
import AddLineup from "./pages/AddLineup";

const router = createBrowserRouter([
  { path: '/', 
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
    { index: true, element: <Homepage />},
    { path: '/listone', element: <Listone />},
    { path: '/classifica', element: <Classifica />},
    { path: '/profilo', element: <Profilo />},
    { path: '/inserisci-formazione', element: <AddLineup />},
    { path: '/crea-squadra', element: <CreateTeam />},
    { path: '/login', element: <Login />},
    { path: '/api/auth/email-confirmation', element: <Login />},
    { path: '/login/recover-password/:recoverCode', element: <RecoverPassword />},
    { path: '/registrazione', element: <Signup />},
    { path: '/squadre', element: <Teams />},
    { path: '/squadre/:teamId', element: <TeamDetail />},
  ]},
])

function App() {
  return <RouterProvider router={router} />;
}

export default App;
