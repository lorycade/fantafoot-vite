import { useEffect, useState } from "react";
import axios from "axios";

function Classifica() {
  const [userPlayers, setUserPlayers] = useState([]);

  useEffect(() => {
    getUserPlayers();
  }, []);
  const getUserPlayers = async () => {
    const response = await axios.get("http://localhost:1337/api/users?sort=points:desc");

    setUserPlayers(response.data);
  };

  return (
    <>
      <div className="container">
        <div className="row mt-40 fx-center">
          <div className="col-12">
            <h2 className="follow-title t-bold text-center">Classifica</h2>
          </div>
        </div>
        <div className="leaderboard mt-5">
          <div className="line head">
            <div className="cell">Posizione</div>
            <div className="cell">Giocatore</div>
            <div className="cell">Punti</div>
          </div>
          {userPlayers.map((user, i) => (
            <>
              <div className="line body">
                <div className="cell">{i + 1}</div>
                <div className="cell">{user.teamName}</div>
                <div className="cell">{user.points}</div>
              </div>
            </>
          ))}
        </div>
      </div>
    </>
  );
}

export default Classifica;
