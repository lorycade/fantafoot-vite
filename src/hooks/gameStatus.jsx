import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { StageContext } from "../context/StageContext";

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

export function getNextStage() {
  const [stages, setStages] = useState();
  const [nextId, setNextId] = useState(null);
  const { nextStage, setNextStage } = useContext(StageContext);

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
    const next = stages.filter(
      (item) => new Date() < new Date(item.start)
    );
    setNextId(next[0].id - 1);

    console.log(next[0].id);

    // setNextStage(next[0].id - 1)

  };
  setNextStage(nextId)
  return nextId;
}
