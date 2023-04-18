import { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  CCircleFill,
  PeopleFill,
  PersonFill,
  PersonFillSlash,
} from "react-bootstrap-icons";
import { Alert } from "@mui/material";
import {StageContext} from "../context/StageContext";

function AddLineup() {
  const jwt = localStorage.getItem("jwt");
  const { user, setUser } = useContext(UserContext);
  // const { nextStage } = useContext(StageContext);
  const [players, setPlayers] = useState([]);
  const [teamInsert, setTeamInsert] = useState(false);
  const [insertCorrect, setInsertCorrect] = useState(false);

  const [playerLengthOk, setPlayerLengthOk] = useState(false);

  const [captainCount, setCaptainCount] = useState(0);
  const [singlePlayerCount, setSinglePlayerCount] = useState(0);
  const [coupleCount, setCoupleCount] = useState(0);
  const [benchCount, setBenchCount] = useState(0);
  const history = useNavigate();
  // const nextStage = getNextStage();

  const handleRoleChange = (e, player) => {
    const role = e.target.value;
    const id = player.id;
    let tasks;

    switch (role) {
      case "captain":
        tasks = players.map((item) =>
          item.id === id
            ? (item = {
                ...item,
                starter: true,
                benchOrder: null,
                captain: true,
                bench: false,
                couple: false,
              })
            : item
        );
        break;
      case "single":
        tasks = players.map((item) =>
          item.id === id
            ? (item = {
                ...item,
                starter: true,
                benchOrder: null,
                captain: false,
                couple: false,
                bench: false,
              })
            : item
        );
        break;
      case "couple":
        tasks = players.map((item) =>
          item.id === id
            ? (item = {
                ...item,
                starter: true,
                benchOrder: null,
                couple: true,
                captain: false,
                bench: false,
              })
            : item
        );
        break;
      case "bench-1":
        tasks = players.map((item) =>
          item.id === id
            ? (item = {
                ...item,
                starter: false,
                bench: true,
                captain: false,
                couple: false,
                benchOrder: 1,
              })
            : item
        );
        break;
      case "bench-2":
        tasks = players.map((item) =>
          item.id === id
            ? (item = {
                ...item,
                starter: false,
                bench: true,
                captain: false,
                couple: false,
                benchOrder: 2,
              })
            : item
        );
        break;
      case "bench-3":
        tasks = players.map((item) =>
          item.id === id
            ? (item = {
                ...item,
                starter: false,
                bench: true,
                captain: false,
                couple: false,
                benchOrder: 3,
              })
            : item
        );
        break;
      case "bench-4":
        tasks = players.map((item) =>
          item.id === id
            ? (item = {
                ...item,
                starter: false,
                bench: true,
                captain: false,
                couple: false,
                benchOrder: 4,
              })
            : item
        );
        break;

      default:
        tasks = players.map((item) =>
          item.id === id
            ? (item = {
                ...item,
                starter: false,
                bench: false,
                captain: false,
                couple: false,
                benchOrder: null,
              })
            : item
        );
        break;
    }

    setPlayers(tasks);
  };

  useEffect(() => {
    if (!jwt) {
      history("/");
    }
  }, []);

  useEffect(() => {
    // if (!nextStage) return
    if (user && user.lineups) {
      setPlayers(user.lineups[1].formation);
    } else if (user) {
      setPlayers(user.players);
    }

    if (user && user.players) {
      user.players.length === 10
        ? setPlayerLengthOk(true)
        : setPlayerLengthOk(false);
    }
  }, [user]); // aggiungere nextStage

  useEffect(() => {
    const countCaptains = players.filter((item) => item.captain == true).length;
    const countSinglePlayer = players.filter(
      (item) =>
        item.captain == false && item.starter == true && item.couple == false
    ).length;
    const countCouple = players.filter((item) => item.couple == true).length;
    const countBench = players.filter(
      (item) => item.starter == false && item.bench == true
    ).length;

    setCaptainCount(countCaptains);
    setSinglePlayerCount(countSinglePlayer);
    setCoupleCount(countCouple);
    setBenchCount(countBench);

    const allRight =
      countCaptains === 1 &&
      countSinglePlayer === 3 &&
      countCouple === 2 &&
      countBench === 4;

    setInsertCorrect(allRight);
  }, [players]);

  const handleSaveSquad = () => {
    const areAllInsert = players.filter(
      (item) => item.starter === false && item.bench === false
    );

    if (areAllInsert.length > 0) return;
    const lineup = {
      tappa: 2, // aggiungere (nextStage + 1)
      formation: players,
    };

    console.log('lineup', lineup);

    let oldLineups;
    if (user && user.lineups == null) {
      let emptyArr = [];
      emptyArr.push(lineup);
      oldLineups = emptyArr;
    } else {
      // console.log('nel salva in pratica', );
      user.lineups[1] = lineup;
    }

    console.log('user lineup', user.lineups);

    axios
      .put(
        import.meta.env.VITE_API_URL + "/api/users/" + user.id,
        {
          lineups: user.lineups,
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      )
      .then((response) => {
        const newUser = {
          ...response.data,
          lineups: oldLineups,
          players: user.players,
        };
        setUser(newUser);
        setTeamInsert(true);

        setTimeout(() => {
          setTeamInsert(false);
          history("/profilo");
        }, 3000);
      })
      .catch((error) => {
        console.log("An error occurred:", error);
      });
  };

  return (
    <>
      <div className="container-lg mb-5 formation-container">
        {teamInsert && (
          <Alert severity="success" className="alert-custom">
            Formazione inserita correttamente
          </Alert>
        )}

        {!playerLengthOk && (
          <>
            <div className="text-center my-5">
              <h2 className="mb-5">Completa la tua rosa</h2>
              <p>
                La tua rosa non è completa, questo può succedere perchè è stato
                rilevato un giocatore doppione, e quindi di conseguenza è stato
                eliminato.
              </p>
              <p>
                Torna alla creazione squadra per completarla e poi inserire la
                tua formazione
              </p>
              <Link to="/crea-squadra">Completa Squadra</Link>
            </div>
          </>
        )}

        {playerLengthOk && (
          <>
            <div className="role-selection-wrapper">
              {players.map((player) => (
                <div className="player-item" key={player.id}>
                  <div className="player-info">
                    {player.name} {player.surname}
                  </div>
                  <select
                    onChange={(e) => handleRoleChange(e, player)}
                    name={`select-role`}
                    id={`select-role`}
                  >
                    <option
                      value=""
                      disabled
                      selected={
                        player.captain == false &&
                        player.starter == false &&
                        player.couple == false &&
                        player.bench == false
                      }
                    >
                      Seleziona ruolo
                    </option>
                    {player.id > 10 && (
                      <option value="captain" selected={player.captain == true}>
                        Capitano
                      </option>
                    )}

                    <option
                      value="single"
                      selected={
                        player.captain == false &&
                        player.starter == true &&
                        player.couple == false
                      }
                    >
                      Singolo
                    </option>
                    <option
                      value="couple"
                      selected={
                        player.captain == false &&
                        player.starter == true &&
                        player.couple == true
                      }
                    >
                      Coppia
                    </option>
                    <option
                      value="bench-1"
                      selected={
                        player.starter == false && player.benchOrder === 1
                      }
                    >
                      Panchina 1
                    </option>
                    <option
                      value="bench-2"
                      selected={
                        player.starter == false && player.benchOrder === 2
                      }
                    >
                      Panchina 2
                    </option>
                    <option
                      value="bench-3"
                      selected={
                        player.starter == false && player.benchOrder === 3
                      }
                    >
                      Panchina 3
                    </option>
                    <option
                      value="bench-4"
                      selected={
                        player.starter == false && player.benchOrder === 4
                      }
                    >
                      Panchina 4
                    </option>
                  </select>
                </div>
              ))}
            </div>

            <div className="bottom-action">
              <div className="container-lg">
                <ul className="count-wrapper">
                  <li>
                    <CCircleFill /> {captainCount}/1
                  </li>
                  <li>
                    <PersonFill /> {singlePlayerCount}/3
                  </li>
                  <li>
                    <PeopleFill /> {coupleCount}/2
                  </li>
                  <li>
                    <PersonFillSlash /> {benchCount}/4
                  </li>
                </ul>
                <button
                  disabled={!insertCorrect}
                  className="btn btn-primary"
                  onClick={() => handleSaveSquad()}
                >
                  Salva formazione
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default AddLineup;
