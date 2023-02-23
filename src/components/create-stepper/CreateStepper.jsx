import { useState, useEffect } from "react";
import axios from "axios";

const steps = [
  {
    number: 1,
    head: "Inserisci Nome Squadra"
  },
  {
    number: 2,
    head: "Crea rosa"
  },
  {
    number: 3,
    head: "Riepilogo"
  }
]

const CreateStepper = () => {
  const user = JSON.parse(localStorage.getItem("user"))
  const jwt = JSON.parse(localStorage.getItem("jwt"))
  const [activeStep, setActiveStep] = useState(1)
  const [squadName, setSquadName] = useState(user.teamName)
  const [playerList, setPlayerlist] = useState([])
  const [myTeam, setMyTeam] = useState(user.players)
  const [credits, setCredits] = useState(400)

  useEffect(() => {
    getPlayers();
    if(user.teamName) initChangeMode()
  }, []);

  const handlePrev = () => {
    const isNotFirst = activeStep <= 3 && activeStep > 1
    
    if (isNotFirst) setActiveStep(activeStep - 1)
  }

  const handleNext = () => {
    const isNotLast = activeStep < 3 && activeStep >=1
    if (isNotLast) setActiveStep(activeStep + 1)
  }

  const getPlayers = async () => {
    const response = await axios.get(
      "http://localhost:1337/api/players?sort=value:desc"
    );
    setPlayerlist(response.data.data)
  };

  const handleSelection = (player) => {
    const isMyTeam = myTeam.filter(item => player.id == item.id).length == 1
    const playerCredits = player.value;

    let myTeamPlayers = [...myTeam];
    if (isMyTeam) {
      const newMyTeam = myTeam.filter(item => player.id != item.id)
      setMyTeam(newMyTeam)
      setCredits(credits + playerCredits)
    } else {
      myTeamPlayers.push(player)
      setMyTeam(myTeamPlayers)
      setCredits(credits - playerCredits)
    }
  };

  const handleRemoveAll = () => {
    setMyTeam([]);
    setCredits(400);
    const allPlayers = playerList.concat(myTeam);

    setPlayerlist(allPlayers);
  };

  const initChangeMode = () => {
    const myPlayersCost = myTeam.reduce((accumulator, object) => {
      return accumulator + object.value;
    }, 0);
    setCredits(credits - myPlayersCost)
  }

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
        console.log("data", response);
        // history("/");
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      });
  };

  return (
    <div className="container my-5">
      <div className="stepper">
        <div className="stepper-header">
          {steps.map((step) => (
            <button className={step.number == activeStep ? 'step-button active' : 'step-button'} onClick={() => setActiveStep(step.number)}>{step.head}</button>
          ))}
        </div>
        <div className="stepper-content">
          {activeStep == 1 && 
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
                <label htmlFor="squad-name">
                  Nome squadra
                </label>
              </div>
            </div>
          }
          {activeStep == 2 && 
            <div className="step-item active">
              <h2 className="mb-5">Lista giocatori</h2>
              <div className="filter-wrapper">
              <button className="my-3" onClick={() => handleRemoveAll()}>
                Elimina tutti
              </button>
              </div>
              {playerList.map((player) => (
                <button
                className={myTeam.filter(item => player.id == item.id).length == 1 ? 'player-line selected' : 'player-line'}
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
          }
          {activeStep == 3 && 
            <div className="step-item active">
              <h2 className="mb-5">Riepilogo</h2>
              <h3>Nome Squadra</h3>
              <p className="mb-5"><strong>{squadName}</strong></p>
              <h3>Giocatori scelti</h3>
              {myTeam.map((player) => (
                <div
                className="player-line selected"
                key={player.id}
              >
                <div className="name">
                  {player.name} {player.surname}
                </div>
                <div className="value">{player.value}</div>
              </div>
              ))}
            </div>
          }
        </div>
        <div className="stepper-footer">
          <div className="container">
          {activeStep > 1 && <button className="btn btn-secondary prev" onClick={() => handlePrev()}>Prev</button>}
          {activeStep == 2 &&
            <div className="info-creation">
              <p>Crediti residui <strong>{credits}</strong>/400</p>
              <p className="mb-0">Giocatori selezionati <strong>{myTeam.length}</strong>/10</p>
            </div>
          }
          {activeStep == 1 && <button className="btn btn-primary next" disabled={!squadName} onClick={() => handleNext()}>next</button>}
          {activeStep == 2 && <button className="btn btn-primary next" disabled={myTeam.length != 10} onClick={() => handleNext()}>next</button>}
          {activeStep == 3 && <button className="btn btn-primary next" onClick={() => handleCreateTeam()}>Crea squadra</button>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateStepper;
