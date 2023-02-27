import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

const steps = [
  {
    number: 1,
    head: "Inserisci Nome Squadra",
  },
  {
    number: 2,
    head: "Crea rosa",
  },
  {
    number: 3,
    head: "Riepilogo",
  },
];

const CreateStepper = () => {
  const { user, setUser } = useContext(UserContext);
  const jwt = localStorage.getItem("jwt");
  const [activeStep, setActiveStep] = useState(1);
  const [squadName, setSquadName] = useState("");
  const [playerList, setPlayerlist] = useState([]);
  const [myTeam, setMyTeam] = useState("");
  const [credits, setCredits] = useState(400);
  const [teamCreated, setTeamCreated] = useState(false);
  const [playerSearch, setPlayerSearch] = useState("");
  const history = useNavigate();

  useEffect(() => {
    getPlayers();
  }, []);

  useEffect(() => {
    if (user) initChangeMode();
  }, [user]);

  useEffect(() => {
    if (playerSearch.length < 3) {
      getPlayers()
    } else {
      const filteredList = playerList.filter(player => player.name.toLowerCase().includes(playerSearch.toLocaleLowerCase()) || player.surname.toLowerCase().includes(playerSearch.toLocaleLowerCase()))
  
      setPlayerlist(filteredList)
    }
  }, [playerSearch]);

  const handlePrev = () => {
    const isNotFirst = activeStep <= 3 && activeStep > 1;

    if (isNotFirst) setActiveStep(activeStep - 1);
  };

  const handleNext = () => {
    const isNotLast = activeStep < 3 && activeStep >= 1;
    if (isNotLast) setActiveStep(activeStep + 1);
  };

  const getPlayers = async () => {
    const response = await axios.get(
      "http://localhost:1337/api/players?sort=value:desc"
    );
    setPlayerlist(response.data.data);
  };

  const handleSelection = (player) => {
    const isMyTeam = myTeam.filter((item) => player.id == item.id).length == 1;
    const playerCredits = player.value;

    let myTeamPlayers = [...myTeam];
    if (isMyTeam) {
      const newMyTeam = myTeam.filter((item) => player.id != item.id);
      setMyTeam(newMyTeam);
      setCredits(credits + playerCredits);
    } else {
      myTeamPlayers.push(player);
      setMyTeam(myTeamPlayers);
      setCredits(credits - playerCredits);
    }
  };

  const handleRemoveAll = () => {
    setMyTeam([]);
    setCredits(400);
  };

  const initChangeMode = () => {
    setMyTeam(user.players)
    setSquadName(user.teamName)
    const myPlayersCost = user.players.reduce((accumulator, object) => {
      return accumulator + object.value;
    }, 0);
    setCredits(credits - myPlayersCost);
  };

  const handleCreateTeam = async () => {
    axios
      .put(
        "http://localhost:1337/api/users/" + user.id,
        {
          players: myTeam,
          teamName: squadName,
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      )
      .then((response) => {
        const newUser = {...response.data, players: myTeam}
        setUser(newUser)
        setTeamCreated(true);

        setTimeout(() => {
          setTeamCreated(false);
          history("/profilo");
        }, 3000);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      });
  };

  return (
    <div className="container my-5">
      {teamCreated && (
        <div
          className="password-alert alert alert-success d-flex align-items-center"
          role="alert"
        >
          <div>Complimenti, hai creato la tua squadra !!</div>
        </div>
      )}
      <div className="stepper">
        <div className="stepper-header">
          {steps.map((step) => (
            <div
              className={
                step.number == activeStep ? "step-button active" : "step-button"
              }
            >
              {" "}
              <span>{step.number}</span> {step.head}
            </div>
          ))}
        </div>
        <div className="stepper-content">
          {activeStep == 1 && (
            <div className="step-item active">
              <h3>Inserisci il nome della tua squadra</h3>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  value={squadName}
                  onChange={(event) => setSquadName(event.target.value)}
                  className="form-control"
                  id="squad-name"
                  placeholder="Nome squadra"
                />
                <label htmlFor="squad-name">Nome squadra</label>
              </div>
            </div>
          )}
          {activeStep == 2 && (
            <div className="step-item active">
              <h2 className="mb-5">Lista giocatori</h2>
              <div className="filter-wrapper">
                <div className="form-floating">
                  <input
                    type="text"
                    value={playerSearch}
                    onChange={(event) => setPlayerSearch(event.target.value)}
                    className="form-control"
                    id="floatingInput"
                    placeholder="name@example.com"
                  />
                  {playerSearch.length >= 3 && <button className="clear-input" onClick={() => setPlayerSearch("")}>x</button>}
                  <label htmlFor="floatingInput">Cerca giocatore</label>
                </div>
                <button onClick={() => handleRemoveAll()}>
                  Elimina tutti
                </button>
              </div>
              {myTeam.length == 10 &&
                playerList.map((player) => (
                  <button
                    className={
                      myTeam.filter((item) => player.id == item.id).length == 1
                        ? "player-line selected"
                        : "player-line"
                    }
                    key={player.id}
                    onClick={() => handleSelection(player)}
                    disabled={
                      myTeam.filter((item) => player.id == item.id).length == 1
                        ? false
                        : true
                    }
                  >
                    <div className="name">
                      {player.name} {player.surname}
                    </div>
                    <div className="value">{player.value}</div>
                  </button>
                ))}
              {myTeam.length < 10 &&
                playerList.map((player) => (
                  <button
                    className={
                      myTeam.filter((item) => player.id == item.id).length == 1
                        ? "player-line selected"
                        : "player-line"
                    }
                    key={player.id}
                    onClick={() => handleSelection(player)}
                  >
                    <div className="name">
                      {player.name} {player.surname}
                    </div>
                    <div className="value">{player.value}</div>
                  </button>
                ))}
            </div>
          )}
          {activeStep == 3 && (
            <div className="step-item active">
              <h2 className="mb-5">Riepilogo</h2>
              <h3>Nome Squadra</h3>
              <p className="mb-5 my-team-name">
                <strong>{squadName}</strong>
              </p>
              <h3>Giocatori scelti</h3>
              {myTeam.map((player) => (
                <div className="player-line selected" key={player.id}>
                  <div className="name">
                    {player.name} {player.surname}
                  </div>
                  <div className="value">{player.value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="stepper-footer">
          <div className="container">
            {activeStep > 1 && (
              <button
                className="btn btn-secondary prev"
                onClick={() => handlePrev()}
              >
                Prev
              </button>
            )}
            {activeStep == 2 && (
              <div className="info-creation">
                <p>
                  Crediti residui <strong>{credits}</strong>/400
                </p>
                <p className="mb-0">
                  Giocatori selezionati <strong>{myTeam.length}</strong>/10
                </p>
              </div>
            )}
            {activeStep == 1 && (
              <button
                className="btn btn-primary next"
                disabled={!squadName}
                onClick={() => handleNext()}
              >
                next
              </button>
            )}
            {activeStep == 2 && (
              <button
                className="btn btn-primary next"
                disabled={myTeam.length != 10}
                onClick={() => handleNext()}
              >
                next
              </button>
            )}
            {activeStep == 3 && (
              <button
                className="btn btn-primary next"
                onClick={() => handleCreateTeam()}
              >
                Crea squadra
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateStepper;
