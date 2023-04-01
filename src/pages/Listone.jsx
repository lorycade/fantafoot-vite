import { useState, useContext, useEffect } from "react";
// import { UserContext } from "../context/UserContext";
import axios from "axios";

function Listone() {
  const [playerList, setPlayerlist] = useState([]);

  // const { user } = useContext(UserContext);

  useEffect(() => {
    getPlayers();
  }, []);

  const getPlayers = async () => {
    const response = await axios.get(import.meta.env.VITE_API_URL + "/api/players?sort=value:desc");
    setPlayerlist(response.data.data);
  };

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
          </div>
        ))}
      </div>
    </div>
  );
}

export default Listone;
