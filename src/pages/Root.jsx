import { Outlet } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

import Header from "../components/header/header";
import InsertTeamBanner from "../components/insert-team-banner/insert-team-banner";
import { useEffect } from "react";
import { isGameLive } from "../hooks/gameStatus";

function Root() {
  const {user} = useContext(UserContext)
  const [stages, setStages] = useState()
  const [nextStage, setNextStage] = useState()
  const [isLive, setIsLive] = useState(isGameLive())

  useEffect(() => {
    if (isLive === false) {
      getStages()
    }
  }, [])

  const getStages = () => {
    axios
      .get(
        import.meta.env.VITE_API_URL + "/api/stages",
      )
      .then((response) => {
        setStages(response.data.data)
      })
      .catch((error) => {
        console.log("An error occurred:", error);
      });
  }

  useEffect(() => {
    if (!stages) return
    checkNextStage()
  }, [stages])

  const checkNextStage = () => {
    if (!stages.length > 0) return
    const next = stages.filter(item => new Date(item.start) > new Date())
    
    setNextStage(next[0])
  }

  console.log(nextStage);

  return (
    <>
      <Header />
      {user && !!nextStage && <InsertTeamBanner nextStage={nextStage} />}
      <Outlet />
    </>
  );
}

export default Root;
