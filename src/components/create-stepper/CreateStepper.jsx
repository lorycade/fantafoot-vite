import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { CashCoin, PersonFill, Search, XLg } from "react-bootstrap-icons";
import Offcanvas from "react-bootstrap/Offcanvas";
import { Alert } from "@mui/material";

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
  const [squadName, setSquadName] = useState('');
  const [fullPlayerList, setFullPlayerList] = useState([]);
  const [playerList, setPlayerlist] = useState([]);
  const [myTeam, setMyTeam] = useState([]);
  const [credits, setCredits] = useState(400);
  const [teamCreated, setTeamCreated] = useState(false);
  const [playerSearch, setPlayerSearch] = useState('');
  const [showPlayerCanvas, setPlayerCanvas] = useState(false);
  const [nameAdd, setNameAdd] = useState('');
  const [surnameAdd, setSurnameAdd] = useState('');
  const [addPlayerError, setAddPlayerError] = useState(false)

  const history = useNavigate();

  // const handleShow = () => setPlayerCanvas(true)
  const handleClose = () => {
    setPlayerCanvas(false);
    setNameAdd('')
    setSurnameAdd('')
    setAddPlayerError(false)
  }


  useEffect(() => {
    getPlayers();
  }, []);

  useEffect(() => {
    if (user && user.teamName != null) {
      initChangeMode();
    }
  }, [user]);

  useEffect(() => {
    if (playerSearch.length < 3) {
      getPlayers();
    } else {
      const filteredList = fullPlayerList.filter(
        (player) =>
          player.name
            .toLowerCase()
            .includes(playerSearch.toLowerCase()) ||
          player.surname
            .toLowerCase()
            .includes(playerSearch.toLowerCase())
      );

      setPlayerlist(filteredList);
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
      import.meta.env.VITE_API_URL + "/api/players?sort=value:desc"
    );
    setPlayerlist(response.data.data);
    setFullPlayerList(response.data.data)
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
    setMyTeam(user.players);
    setSquadName(user.teamName);
    if (user.players) {
      const myPlayersCost = user.players.reduce((accumulator, object) => {
        return accumulator + object.value;
      }, 0);
      setCredits(credits - myPlayersCost);
    }
    
    
  };

  const handleAddPlayer = () => {
    const surnameExist = fullPlayerList.filter(item => item.surname.toLowerCase() === surnameAdd.toLowerCase())
    console.log('surnameExist', surnameExist);
    if (surnameExist.length > 0) {
      console.log('log dentro if');
      const nameExist = surnameExist.filter(item => item.name.toLowerCase() === nameAdd.toLowerCase())

      if (nameExist.length > 0) {
        setAddPlayerError(true)
        return
      } 
    }

    axios
      .post(
        import.meta.env.VITE_API_URL + "/api/players",
        {
          data: {
            name: nameAdd,
            surname: surnameAdd,
            value: 10
          }
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      )
      .then((response) => {
        let newList = playerList
        newList.push(response.data.data)
        setPlayerlist(newList)
        setPlayerCanvas(false)
        setAddPlayerError(false)
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      });
  }

  const handleCreateTeam = async () => {
    axios
      .put(
        import.meta.env.VITE_API_URL + "/api/users/" + user.id,
        {
          players: myTeam,
          teamName: squadName,
          credits,
          lineups: null //modificare dopo prima giornata
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      )
      .then((response) => {
        const newUser = { ...response.data, players: myTeam };
        setUser(newUser);
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
        <Alert severity="success" className="alert-custom">Complimenti, hai creato la tua squadra !!</Alert>
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
                  <Search className="search-icon" />
                  {playerSearch.length >= 3 && (
                    <button
                      className="clear-input"
                      onClick={() => setPlayerSearch("")}
                    >
                      <XLg />
                    </button>
                  )}
                  <label htmlFor="floatingInput">Cerca giocatore</label>
                </div>
                <button
                  className="add-player btn btn-primary"
                  onClick={() => setPlayerCanvas(true)}
                >
                  Aggiungi giocatore
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleRemoveAll()}
                >
                  Elimina tutti
                </button>
              </div>
              <Offcanvas show={showPlayerCanvas} onHide={handleClose}>
                <Offcanvas.Header closeButton>
                  <Offcanvas.Title>Aggiungi Giocatore</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    value={nameAdd}
                    onChange={(event) => setNameAdd(event.target.value)}
                    className="form-control"
                    id="name"
                    placeholder="name@example.com"
                  />
                  <label htmlFor="name">Nome</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    value={surnameAdd}
                    onChange={(event) => setSurnameAdd(event.target.value)}
                    className="form-control"
                    id="surname"
                    placeholder="name@example.com"
                  />
                  <label htmlFor="surname">Cognome</label>
                </div>
                {addPlayerError && <p className="text-danger">Esiste già un giocatore con lo stesso Nome e Cognome, cerca nella lista dei giocatori.</p>}
                <button
                  className="add-player btn btn-primary"
                  onClick={() => handleAddPlayer()}
                >
                  Aggiungi giocatore
                </button>
                </Offcanvas.Body>
              </Offcanvas>
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
              {myTeam.length >= 0 &&
                myTeam.length < 10 &&
                playerList.map((player) => (
                  <button
                    className={
                      myTeam.length > 0 &&
                      myTeam.filter((item) => player.id == item.id).length == 1
                        ? "player-line selected"
                        : "player-line"
                    }
                    key={player.id}
                    onClick={() => handleSelection(player)}
                    disabled={
                      player.value > credits &&
                      myTeam.filter((item) => player.id == item.id).length != 1
                    }
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
                Indietro
              </button>
            )}
            {activeStep == 2 && (
              <ul className="info-creation">
                <li>
                  <CashCoin /> <strong>{credits}/400</strong>
                </li>
                <li>
                  <PersonFill /> <strong>{myTeam.length}/10</strong>
                </li>
              </ul>
            )}
            {activeStep == 1 && (
              <button
                className="btn btn-primary next"
                disabled={!squadName}
                onClick={() => handleNext()}
              >
                Avanti
              </button>
            )}
            {activeStep == 2 && (
              <button
                className="btn btn-primary next"
                disabled={myTeam.length != 10}
                onClick={() => handleNext()}
              >
                Avanti
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
