import { useContext, useState, useEffect } from "react";
// import { UserContext } from "../context/UserContext";
// import { Link } from "react-router-dom"
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateTeam() {
  // const {user, setUser} = useContext(UserContext)
  const [playerList, setPlayerlist] = useState([]);
  const [myTeam, setMyTeam] = useState([]);
  const [credits, setCredits] = useState(200);
  const user = JSON.parse(localStorage.getItem("user"));
  const history = useNavigate()

  useEffect(() => {
    getPlayers();
  }, []);

  const getPlayers = async () => {
    const response = await axios.get(
      "http://localhost:1337/api/players?sort=value:desc"
    );
    setPlayerlist(response.data.data);
  };

  const handleSelection = (player) => {
    const playerCredits = player.attributes.value;
    let myTeamPlayers = [...myTeam];
    myTeamPlayers.push(player);
    setMyTeam(myTeamPlayers);

    setCredits(credits - playerCredits);

    const newPlayerList = playerList.filter((item) => item !== player);
    setPlayerlist(newPlayerList);
  };

  const handleCreateTeam = async () => {
    console.log("creiamo questa squadra", myTeam);
    console.log("ce dato utente", user);
    axios
      .put(
        "http://localhost:1337/api/users/" + user.user.id,
        {
          players: myTeam,
        },
        {
          headers: {
            Authorization: `Bearer ${user.jwt}`,
          },
        }
      )
      .then((response) => {
        console.log("data", response);
        history('/')
        // console.log("User token", response.data.jwt);
        // setUser(response.data)
        // localStorage.setItem('user', JSON.stringify(response.data))
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
        // if (error.response.status == 400) {
        //   setError('Email o Password errate');
        // }
      });
  };

  return (
    <>
      <div className="container">
        <div className="row mt-40 fx-center">
          <div className="col-12">
            <h2 className="follow-title t-bold text-center">Crea Squadra</h2>
          </div>
        </div>
        <div className="row mt-5">
          <div className="col-lg-5">
            <h2 className="mb-3">Lista giocatori</h2>
            {playerList.map((player) => (
              <>
                {credits < player.attributes.value && (
                  <button className="player-line out-budget" key={player.id}>
                    <div className="name">
                      {player.attributes.name} {player.attributes.surname}
                    </div>
                    <div className="value">{player.attributes.value}</div>
                  </button>
                )}
                {credits >= player.attributes.value && (
                  <button
                    className="player-line"
                    key={player.id}
                    onClick={() => handleSelection(player)}
                  >
                    <div className="name">
                      {player.attributes.name} {player.attributes.surname}
                    </div>
                    <div className="value">{player.attributes.value}</div>
                  </button>
                )}
              </>
            ))}
          </div>
          <div className="col-lg-2"></div>
          <div className="col-lg-5">
            <h2 className="mb-3">Giocatori selezionati</h2>
            <p className="credits-team">Crediti residui: {credits}</p>
            {myTeam.map((teamPlayer) => (
              <div className="player-line my-team" key={teamPlayer.id}>
                <div className="name">
                  {teamPlayer.attributes.name} {teamPlayer.attributes.surname}
                </div>
                <div className="value">{teamPlayer.attributes.value}</div>
              </div>
            ))}
            {myTeam.length >= 4 && (
              <button
                type="button"
                className="create-team-btn"
                onClick={() => handleCreateTeam()}
              >
                Crea Squadra
              </button>
            )}
            {myTeam.length < 4 && (
              <button disabled type="button" className="create-team-btn">
                Crea Squadra
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateTeam;
