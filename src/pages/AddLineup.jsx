import { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  CCircleFill,
  PeopleFill,
  PersonFill,
  PersonFillSlash,
} from "react-bootstrap-icons";

function InserimentoFormazione() {
  const jwt = localStorage.getItem("jwt");
  const { user, setUser } = useContext(UserContext);
  const [players, setPlayers] = useState([]);
  const [teamInsert, setTeamInsert] = useState(false);
  const [insertCorrect, setInsertCorrect] = useState(false);

  const [allPlayers, setAllPlayers] = useState([]);

  const [captainCount, setCaptainCount] = useState(0);
  const [singlePlayerCount, setSinglePlayerCount] = useState(0);
  const [coupleCount, setCoupleCount] = useState(0);
  const [benchCount, setBenchCount] = useState(0);
  const history = useNavigate();

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

    getAllPlayers()
    
  }, []);

  const getAllPlayers = async () => {
    const response = await axios.get(import.meta.env.VITE_API_URL + "/api/players?sort=value:desc");
    setAllPlayers(response.data.data);
  };

  useEffect(() => {
    if (user && user.lineups) {
      setPlayers(user.lineups[0].formation);
    } else if (user) {
      setPlayers(user.players);
    }
  }, [user]);

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
      tappa: 1,
      formation: players,
    };

    let oldLineups;
    if (user.lineups == null) {
      let emptyArr = []
      emptyArr.push(lineup)
      oldLineups = emptyArr;
    } else {
      const isSetYet = user.lineups.filter(
        (item) => item.tappa == lineup.tappa
      );

      if (isSetYet.length === 1) {
        const index = user.lineups.indexOf(isSetYet[0])
        user.lineups[index] = lineup
        oldLineups = user.lineups
      } else {
        user.lineups.push(lineup)
        oldLineups = user.lineups
      }
    }

    axios
      .put(
        import.meta.env.VITE_API_URL + "/api/users/" + user.id,
        {
          lineups: oldLineups,
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      )
      .then((response) => {
        const newUser = { ...response.data, lineups: oldLineups };
        console.log(newUser);
        setUser(newUser);
        setTeamInsert(true);

        setTimeout(() => {
          setTeamInsert(false);
        }, 3000);
      })
      .catch((error) => {
        console.log("An error occurred:", error);
      });
  };

  return (
    <>
      <div className="container mb-5 formation-container">
        {teamInsert && (
          <div
            className="password-alert alert alert-success d-flex align-items-center"
            role="alert"
          >
            <div>Complimenti, hai salvato la tua formazione !!</div>
          </div>
        )}

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
                {!allPlayers.slice(0, 9).includes(player) && (
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
                  selected={player.starter == false && player.benchOrder === 1}
                >
                  Panchina 1
                </option>
                <option
                  value="bench-2"
                  selected={player.starter == false && player.benchOrder === 2}
                >
                  Panchina 2
                </option>
                <option
                  value="bench-3"
                  selected={player.starter == false && player.benchOrder === 3}
                >
                  Panchina 3
                </option>
                <option
                  value="bench-4"
                  selected={player.starter == false && player.benchOrder === 4}
                >
                  Panchina 4
                </option>
              </select>
            </div>
          ))}
        </div>

        <div className="bottom-action">
          <div className="container">
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
      </div>
    </>
  );
}

export default InserimentoFormazione;
