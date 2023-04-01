import { Link } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { isGameLive } from "../../hooks/gameStatus";
import Countdown from "./countdown";
import { useEffect, useState } from "react";

const InsertTeamBanner = ({ nextStage }) => {
  const [endDate, setEndDate] = useState();

  useEffect(() => {
    if (!nextStage) return;
    console.log(nextStage);
    const dateString = String(nextStage.start).split("Z");
    setEndDate(dateString[0]);
  }, []);

  return (
    <div className="banner-action">
      <div className="container-lg">
        {isGameLive() === true && (
          <Typography variant="h3" fontWeight={"bold"} textAlign={"center"}>
            Gara in corso
          </Typography>
        )}
        {isGameLive() === false && (
          <Box
            sx={{
              width: "100%",
              gap: "32px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              "@media (min-width: 768px)": {
                flexDirection: "row",
                justifyContent: "space-between",
              },
            }}
          >
            <Box>
              <Typography variant="h6" fontWeight={'bold'} sx={{mb: 2, '@media (max-width: 768px)': {
              textAlign: 'center'
            }}} >
                Termine inserimento formazione
              </Typography>
              {endDate !== undefined && <Countdown date={endDate} />}
            </Box>

            <Link to="/inserisci-formazione" className="action-link">
              Inserisci formazione
            </Link>
          </Box>
        )}
      </div>
    </div>
  );
};

export default InsertTeamBanner;
