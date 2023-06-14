import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { getNextStage } from "../hooks/gameStatus";
export const StageContext = createContext(null);

export default ({ children }) => {
  const [nextStage, setNextStage] = useState(null);
  useEffect(() => {
    getStages()
  }, [])

  const getStages = () => {
    axios
    .get(import.meta.env.VITE_API_URL + "/api/stages")
    .then((response) => {
      checkNextStage(response.data.data)
    })
    .catch((error) => {
      console.log("An error occurred:", error);
    });
  }
  
    const checkNextStage = (stages) => {
      if (!stages.length > 0) return;
      const next = stages.filter(
        (item) => new Date() < new Date(item.start)
      );
      const ordered = next.sort(function(a, b) { 
        return a.id - b.id;
      });
      setNextStage(ordered[0].id)
    };

  
  return (
    <StageContext.Provider value={{ nextStage, setNextStage }}>
      {children}
    </StageContext.Provider>
  );
};
