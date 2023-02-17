import { Outlet } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import Header from "../components/header/header";
import InsertTeamBanner from "../components/insert-team-banner/insert-team-banner";

function Root() {
  return (
    <>
      <Header />
      <InsertTeamBanner />
      <Outlet />
    </>
  );
}

export default Root;
