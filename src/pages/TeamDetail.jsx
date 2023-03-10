import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// import TeamCard from "../components/team-card/TeamCard";

function TeamDetail() {
  const {teamId} = useParams()
  const [user, setUser] = useState()

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const response = await axios.get(
      import.meta.env.VITE_API_URL + `/api/users/${teamId}?populate=*`
    );

    setUser(response.data);
  };

  return (
    <div className="container my-5">
      <div className="main-info">
        <div className="circle-user">{user && user.name.split('')[0]}{user && user.surname.split('')[0]}</div>
        <div className="names-wrapper">
          <h2 className="team-name">{user && user.teamName}</h2>
          <p className="user-name">{user && user.name} {user && user.surname}</p>
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-lg-6">
          <h3>Lista giocatori</h3>
          {user && user.players.sort((a, b) => a.value > b.value ? -1 : 1 ).map(player => (
            <p key={player.id}>{player.name} {player.surname}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TeamDetail;
