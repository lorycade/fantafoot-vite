import { useState, useEffect, useContext } from "react";
import axios from "axios";

export function isGameLive() {
  const [stages, setStages] = useState();
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_API_URL + "/api/stages")
      .then((response) => {
        setStages(response.data.data);
      })
      .catch((error) => {
        console.log("An error occurred:", error);
      });
  }, []);

  useEffect(() => {
    if (!stages) return;
    checkNextStage();
  }, [stages]);

  const checkNextStage = () => {
    if (!stages.length > 0) return;
    const live = stages.filter(
      (item) =>
        new Date(item.start) < new Date() && new Date(item.end) > new Date()
    );

    if (live.length > 0) {
      setIsLive(true);
    } else {
      setIsLive(false);
    }
  };
  return isLive;
}
