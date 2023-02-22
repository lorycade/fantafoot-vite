import { useContext, useState, useEffect } from "react";
// import { UserContext } from "../context/UserContext";
// import { Link } from "react-router-dom"
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateTeam() {
  // const {user, setUser} = useContext(UserContext)
  const [playerList, setPlayerlist] = useState([]);
  const [myTeam, setMyTeam] = useState([]);
  const [credits, setCredits] = useState(400);
  const jwt = JSON.parse(localStorage.getItem("jwt"));
  const user = JSON.parse(localStorage.getItem("user"));
  const history = useNavigate();

  useEffect(() => {
    getPlayers();
  }, []);

  const getPlayers = async () => {
    const response = await axios.get(
      "http://localhost:1337/api/players?sort=value:desc"
    );

    if (user.players.length > 0) {
      setMyTeam(user.players);

      const newPlayerList = response.data.data.filter(
        ({ id: item1 }) =>
          !user.players.some(({ id: item2 }) => item2 === item1)
      );

      setPlayerlist(newPlayerList);

      const myPlayersCost = user.players.reduce((accumulator, object) => {
        return accumulator + object.value;
      }, 0);

      setCredits(credits - myPlayersCost);
    } else {
      setPlayerlist(response.data.data);
    }
  };

  function getOrderListByValue(array) {
    let sortedProducts = array.sort(
      (p1, p2) => (p1.value < p2.value) ? 1 : (p1.value > p2.value) ? -1 : 0);
      return sortedProducts
  }

  const handleSelection = (player) => {
    const playerCredits = player.value;

    let myTeamPlayers = [...myTeam];
    myTeamPlayers.push(player);
    setMyTeam(myTeamPlayers);

    setCredits(credits - playerCredits);

    const newPlayerList = playerList.filter((item) => item !== player);
    setPlayerlist(newPlayerList);
  };

  const handleCreateTeam = async () => {
    axios
      .put(
        "http://localhost:1337/api/users/" + user.id,
        {
          players: myTeam,
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      )
      .then((response) => {
        console.log("data", response);
        history("/");
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

  const handleRemovePlayer = (player) => {
    const playerCredits = player.value;

    const myTeamPlayers = myTeam.filter((item) => item !== player);
    setMyTeam(myTeamPlayers);

    setCredits(credits + playerCredits);
    

    let listPlayers = [...playerList];
    listPlayers.push(player);
    setPlayerlist(getOrderListByValue(listPlayers));
  }

  const handleRemoveAll = () => {
    setMyTeam([])
    setCredits(400)
    const allPlayers = playerList.concat(myTeam)
    

    setPlayerlist(getOrderListByValue(allPlayers))
  }

  return (
    <>
      <div className="container mb-5">
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
                {credits < player.value || myTeam.length == 10 && (
                  <button className="player-line out-budget" key={player.id}>
                    <div className="name">
                      {player.name} {player.surname}
                    </div>
                    <div className="value">{player.value}</div>
                  </button>
                )}
                {credits >= player.value && myTeam.length < 10 && (
                  <button
                    className="player-line"
                    key={player.id}
                    onClick={() => handleSelection(player)}
                  >
                    <div className="name">
                      {player.name} {player.surname}
                    </div>
                    <div className="value">{player.value}</div>
                  </button>
                )}
              </>
            ))}
          </div>
          <div className="col-lg-5 offset-lg-2">
            <h2 className="mb-3">Giocatori selezionati</h2>
            <p className="credits-team">Crediti residui: {credits}</p>
            <button className="my-3" onClick={() => handleRemoveAll()}>Elimina tutti</button>
            {myTeam.map((teamPlayer) => (
              <>
                <div className="my-team-player">
                  <div className="player-line my-team" key={teamPlayer.id}>
                    <div className="name">
                      {teamPlayer.name} {teamPlayer.surname}
                    </div>
                    <div className="value">{teamPlayer.value}</div>
                  </div>
                  <button onClick={() => handleRemovePlayer(teamPlayer)}>Rimuovi</button>
                </div>
              </>
            ))}
            {myTeam.length == 10 && (
              <button
                type="button"
                className="create-team-btn"
                onClick={() => handleCreateTeam()}
              >
                Crea Squadra
              </button>
            )}
            {myTeam.length < 10 && (
              <p className="create-warning-text">Aggiungi <strong>{10 - myTeam.length}</strong> {(10 - myTeam.length) > 1 ? 'giocatori' : 'giocatore'} per creare la tua squadra</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateTeam;
