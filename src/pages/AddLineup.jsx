import { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function InserimentoFormazione() {
  const jwt = localStorage.getItem("jwt");
  const { user, setUser } = useContext(UserContext);
  const [players, setPlayers] = useState([]);
  const [teamInsert, setTeamInsert] = useState(false);

  const [age, setAge] = useState('');

  // const [captainCount, setCaptainCount] = useState(0);
  // const [singlePlayerCount, setSinglePlayerCount] = useState(0);
  // const [coupleCount, setCoupleCount] = useState(0);
  // const [benchCount, setBenchCount] = useState(0);
  const history = useNavigate();

  const handleRoleChange = (e, role, benchOrder) => {
    // console.log(e.target, role);
    // console.log(id);
    const id = e.target.value;
    let tasks;
    switch (role) {
      case "captain":
        tasks = players.map((item) =>
          item.id === id
            ? (item = {
                ...item,
                starter: true,
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
                couple: true,
                captain: false,
                bench: false,
              })
            : item
        );
        break;
      case "bench":
        tasks = players.map((item) =>
          item.id === id
            ? (item = {
                ...item,
                starter: false,
                bench: true,
                captain: false,
                couple: false,
                benchOrder,
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

    console.log("task", tasks);
    setPlayers(tasks);
  };

  useEffect(() => {
    if (!jwt) {
      history("/");
    }
  }, []);

  useEffect(() => {
    if (user && user.lineups) {
      setPlayers(user.lineups[0].formation);
    } else if (user) {
      setPlayers(user.players);
    }
  }, [user]);

  // useEffect(() => {
  //   const countCaptains = players.filter((item) => item.captain == true).length;
  //   const countSinglePlayer = players.filter(
  //     (item) =>
  //       item.captain == false && item.starter == true && item.couple == false
  //   ).length;
  //   const countCouple = players.filter((item) => item.couple == true).length;
  //   const countBench = players.filter(
  //     (item) => item.starter == false && item.bench == true
  //   ).length;

  //   setCaptainCount(countCaptains);
  //   setSinglePlayerCount(countSinglePlayer);
  //   setCoupleCount(countCouple);
  //   setBenchCount(countBench);
  // }, [players]);

  const handleSaveSquad = () => {
    const areAllInsert = players.filter(
      (item) => item.starter === false && item.bench === false
    );

    if (areAllInsert.length > 0) return;
    const lineup = {
      tappa: 1,
      formation: players,
    };
    // console.log(players);
    let array = [];

    array.push(lineup);

    console.log(array);
    axios
      .put(
        import.meta.env.VITE_API_URL + "/api/users/" + user.id,
        {
          lineups: array,
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      )
      .then((response) => {
        const newUser = { ...response.data, lineups: array };
        console.log(newUser);
        setUser(newUser);
        setTeamInsert(true);

        setTimeout(() => {
          setTeamInsert(false);
        }, 3000);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      });
  };

  const handleChange = (event) => {
    setAge(event.target.value);
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
        <div className="mb-5"></div>

        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Capitano</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={players.filter(item => item.captain == true).name}
            label="Age"
            onChange={(e) => handleRoleChange(e, "captain")}
          >
            {players.map(player => (
              <MenuItem value={player.id}>{player.name} {player.surname}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <div className="mb-5"></div>
        <button className="btn btn-primary" onClick={() => handleSaveSquad()}>
          Salva formazione
        </button>
      </div>
    </>
  );
}

export default InserimentoFormazione;
