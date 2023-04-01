import { FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import LineupCard from "../components/lineup-card/LineupCard";

function Lineups() {
  const [users, setUsers] = useState([]);
  const [gameFilter, setGameFilter] = useState(1);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    const response = await axios.get(
      import.meta.env.VITE_API_URL + "/api/users?populate=*"
    );

    setUsers(response.data);
  };

  const handleChange = () => {
    console.log("hi");
  };

  return (
    <div className="container-lg">
      <Box sx={{display: "flex", justifyContent: "flex-end", p: "40px 0 0"}}>
        <FormControl sx={{ minWidth: 250 }}>
          <InputLabel
            id="game-label"
            sx={{ fontWeight: 600, color: "#000s" }}
          >
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
            <MenuItem value={0}>Tappa 1</MenuItem>
            <MenuItem value={1} selected>
              Tappa 2
            </MenuItem>
          </Select>
        </FormControl>
      </Box>
      <div className="row my-3 my-md-5 g-4">
        {users.map((user) => (
          <div className="col-sm-6 col-md-4 col-lg-3" key={user.id}>
            <LineupCard user={user} activeGame={gameFilter} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Lineups;
