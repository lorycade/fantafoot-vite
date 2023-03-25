import { Outlet } from "react-router-dom";
// import { useContext } from "react";
// import { UserContext } from "../context/UserContext";

import 'bootstrap/dist/css/bootstrap.min.css';

import Header from "../components/header/header";
import InsertTeamBanner from "../components/insert-team-banner/insert-team-banner";

function Root() {
  // const {user} = useContext(UserContext)

  return (
    <>
      <Header />
      {/* {user && <InsertTeamBanner />} */}
      <Outlet />
    </>
  );
}

export default Root;
