import { Link } from "react-router-dom";
import { Box } from "@mui/material";

import Countdown from "./countdown";

const InsertTeamBanner = () => {
  return (
    <div className="banner-action">
      <div className="container-lg">
        <Box sx={{width: "100%", gap: "32px", display: "flex", flexDirection: "column", alignItems: "center", "@media (min-width: 768px)": {
        flexDirection: "row", justifyContent: "space-between"
      }}}>
          <Countdown date={`2023-04-15T20:00:00`} />
          <Link to="/inserisci-formazione" className="action-link">
            Inserisci formazione
          </Link>
        </Box>
      </div>
    </div>
  );
};

export default InsertTeamBanner;
