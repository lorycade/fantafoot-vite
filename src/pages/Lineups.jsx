import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  FormGroup,
  FormControlLabel,
  Switch,
} from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import LineupCard from "../components/lineup-card/LineupCard";
import { StageContext } from "../context/StageContext";
import { UserContext } from "../context/UserContext";

function Lineups() {
  const [users, setUsers] = useState([]);
  const { nextStage } = useContext(StageContext);
  const { user } = useContext(UserContext);
  const [gameFilter, setGameFilter] = useState(1);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    getUsers();
    // if (!nextStage) return;
    // setGameFilter(nextStage);
  }, []);

  const getUsers = async () => {
    const response = await axios.get(
      import.meta.env.VITE_API_URL + "/api/users?populate=*"
    );

    setUsers(response.data);
  };

  return (
    <div className="container-lg">
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: "40px 0 0" }}>
        <FormControl sx={{ minWidth: 250 }}>
          <InputLabel id="game-label" sx={{ fontWeight: 600, color: "#000s" }}>
            Tappa
          </InputLabel>
          <Select
            labelId="game-label"
            id="select-game"
            value={gameFilter}
            label="Tappa"
            onChange={(e) => setGameFilter(e.target.value)}
            size="small"
          >
            <MenuItem value={0} selected={nextStage === 0}>
              Tappa 1
            </MenuItem>
            <MenuItem
              value={1}
              selected
            >
              Tappa 2
            </MenuItem>
            <MenuItem
              value={2}// agg nextStage === 2
              disabled // agg nextStage < 2
            >
              Tappa 3
            </MenuItem>
            <MenuItem
              value={3}
              selected={false} // agg nextStage === 2
              disabled={true} // agg nextStage < 2
            >
              Tappa 4
            </MenuItem>
            <MenuItem
              value={4}
              selected={nextStage === 4}
              disabled={nextStage < 4}
            >
              Tappa 5
            </MenuItem>
            <MenuItem
              value={5}
              selected={nextStage === 5}
              disabled={nextStage < 5}
            >
              Tappa 6
            </MenuItem>
            <MenuItem
              value={6}
              selected={nextStage === 6}
              disabled={nextStage < 6}
            >
              Tappa 7
            </MenuItem>
          </Select>
        </FormControl>
      </Box>
      {!!user && 
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: "20px 0 0" }}>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch checked={checked} onChange={() => setChecked(!checked)} />
            }
            label="Visualizza solo la mia"
          />
        </FormGroup>
      </Box>
      }

      <div className="row my-3 my-md-5 g-4">
        {!checked &&
          users.map((user) => (
            <div className="col-sm-6 col-md-4 col-lg-3" key={user.id}>
              <LineupCard user={user} activeGame={gameFilter} />
            </div>
          ))}
        {!!checked && (
          <div className="col-sm-6 col-md-4">
            <LineupCard user={user} activeGame={gameFilter} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Lineups;
