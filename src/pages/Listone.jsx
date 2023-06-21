import { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { Box } from "@mui/material";

function Listone() {
  const [playerList, setPlayerlist] = useState([]);
  const { user } = useContext(UserContext);
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    getPlayers();
  }, []);

  const getPlayers = async () => {
    const response = await axios.get(import.meta.env.VITE_API_URL + "/api/players?sort=value:desc");
    setPlayerlist(response.data.data);
  };

  const updateResult = (player, e) => {
    const father = e.target.closest('.box-input');
    const inputValue = father.querySelector('input').value;

    const resultObj = {
      result: !!Number(inputValue) ? Number(inputValue) : null
    }
    const newResults = [...player.results, resultObj]
    
    axios
      .put(
        import.meta.env.VITE_API_URL + "/api/players/" + player.id,
        {
          data: {
            results: newResults,
          }
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      )
      .then((response) => {
        console.log("response", response);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      });
  }

  return (
    <div className="container-lg">
      <div className="row mt-40 fx-center">
        <div className="col-12">
          <h2 className="follow-title t-bold text-center">Listone</h2>
        </div>
      </div>
      <div>
      </div>
      {/* <div className="filters">
        <div className="form-item">
          <label htmlFor="player" className="form-label">
            Cerca giocatore
          </label>
          <input
            type="text"
            className="form-control"
            id="player"
            placeholder="Mario Rossi"
          />
        </div>
      </div> */}
      <div className="leaderboard my-5">
        <div className="line head">
          <div className="cell">Giocatore</div>
          <div className="cell">Crediti</div>
        </div>
        {playerList.map((player) => (
          <div className="line body" key={player.id}>
            <div className="cell">{player.name} {player.surname}</div>
            <div className="cell">{player.value}</div>
            {user && user.role && user.role.type == "admin" && 
              <Box className="box-input" display={'flex'} alignItems={'center'} gap={'15px'} p={'10px 20px'}>
              <TextField sx={{margin: '10px'}} inputProps={{ type: 'number', inputMode: 'numeric', pattern: '[0-9]*' }} />
              <Button variant="contained" color="primary" p={'5px'} onClick={(e) => updateResult(player, e)}>
                Aggiorna
              </Button>
              </Box>
            }
          </div>
        ))}
      </div>
    </div>
  );
}

export default Listone;
