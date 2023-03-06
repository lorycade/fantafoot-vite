import { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function InserimentoFormazione() {
  const jwt = localStorage.getItem("jwt");
  const { user, setUser } = useContext(UserContext)
  const [players, setPlayers] = useState([])
  const [teamInsert, setTeamInsert] = useState(false)
  const [captainCount, setCaptainCount] = useState(0)
  const [singlePlayerCount, setSinglePlayerCount] = useState(0)
  const [coupleCount, setCoupleCount] = useState(0)
  const [benchCount, setBenchCount] = useState(0)
  const history = useNavigate()

  useEffect(() => {
    if (!jwt) {
      history('/')
    }
  }, [])

  useEffect(() => {
    if (user && user.lineups) {
      setPlayers(user.lineups[0].formation)
    } else if(user) {
      setPlayers(user.players)
    }
  }, [user]);

  useEffect(() => {
    const countCaptains = players.filter(item => item.captain == true).length;
    const countSinglePlayer = players.filter(item => item.captain == false && item.starter == true && item.couple == false).length;
    const countCouple = players.filter(item => item.couple == true).length;
    const countBench = players.filter(item => item.starter == false && item.bench == true).length;

    setCaptainCount(countCaptains)
    setSinglePlayerCount(countSinglePlayer)
    setCoupleCount(countCouple)
    setBenchCount(countBench)
  }, [players]);

  const onDragOver = (e) => {
    e.preventDefault();
  };
  const onDragStart = (e, id) => {
    e.dataTransfer.setData("id", id);
  };
  const onDrop = (e, cat, role) => {
    let id = Number(e.dataTransfer.getData("id"));
    let tasks;

    switch (role) {
      case "captain":
        tasks = players.map((item) =>
          item.id === id
            ? (item = { ...item, starter: cat, captain: true, bench: false, couple: false })
            : item
        );
        break;
      case "single":
        tasks = players.map((item) =>
          item.id === id
            ? (item = { ...item, starter: cat, captain: false, couple: false, bench: false })
            : item
        );
        break;
      case "couple":
        tasks = players.map((item) =>
          item.id === id
            ? (item = { ...item, starter: cat, couple: true, captain: false, bench: false })
            : item
        );
        break;
      case "bench":
        tasks = players.map((item) =>
          item.id === id
            ? (item = { ...item, starter: cat, bench: true, captain: false, couple: false })
            : item
        );
        break;

      default:
        tasks = players.map((item) =>
          item.id === id
            ? (item = { ...item, starter: cat, bench: false, captain: false, couple: false })
            : item
        );
        break;
    }

    setPlayers(tasks);
  };

  const handleSaveSquad = () => {
    const areAllInsert = players.filter(item => item.starter === false && item.bench === false)
    
    if (areAllInsert.length > 0) return
    const lineup = {
      tappa: 1,
      formation: players
    }
    // console.log(players);
    let array = []

    array.push(lineup)

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
        const newUser = {...response.data, lineups: array}
        console.log(newUser);
        setUser(newUser)
        setTeamInsert(true);

        setTimeout(() => {
          setTeamInsert(false);
        }, 3000);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      });
    
  }


  return (
    <>
      <div className="container mb-5">
      {teamInsert && (
        <div
          className="password-alert alert alert-success d-flex align-items-center"
          role="alert"
        >
          <div>Complimenti, hai salvato la tua formazione !!</div>
        </div>
      )}
        <div className="row mt-40 fx-center">
          <div className="col-12">
            <h2 className="follow-title t-bold text-center">
              Inserisci Formazione
            </h2>
          </div>
        </div>
        <div className="row drag-wrapper my-5">
          <div
            className="col-lg-3"
            onDragOver={(e) => onDragOver(e)}
            onDrop={(e) => {
              onDrop(e, false, "");
            }}
          >
            {user &&
              players
                .map((subItem) => (
                  <div
                    key={subItem.id}
                    onDragStart={(e) => onDragStart(e, subItem.id)}
                    draggable
                    className={subItem.starter === false && subItem.bench === false ? 'draggable' : 'draggable used'}
                  >
                    {subItem.name} {subItem.surname}
                  </div>
                ))}
          </div>
          <div
            className="col-lg-6 offset-lg-3"
            onDragOver={(e) => onDragOver(e)}
          >
            <div className="formation-wrapper">
              <div
                className="captain"
                onDrop={captainCount == 1 ? (e) => e.preventDefault() : (e) => onDrop(e, true, "captain")}
              >
                <h4>capitano {captainCount}/1</h4>
                {players
                  .filter(
                    (item) => item.starter === true && item.captain === true
                  )
                  .map((subItem) => (
                    <div
                      key={subItem.id}
                      onDragStart={(e) => onDragStart(e, subItem.id)}
                      draggable
                      className="draggable"
                    >
                      {subItem.name} {subItem.surname}
                    </div>
                  ))}
              </div>
              <div
                className="single-players"
                onDrop={singlePlayerCount == 3 ? (e) => e.preventDefault() : (e) => onDrop(e, true, "single")}
              >
                <h4>Giocatori Singoli {singlePlayerCount}/3</h4>
                {players
                  .filter(
                    (item) => item.starter === true && item.captain === false && item.couple === false
                  )
                  .map((subItem) => (
                    <div
                      key={subItem.id}
                      onDragStart={(e) => onDragStart(e, subItem.id)}
                      draggable
                      className="draggable"
                    >
                      {subItem.name} {subItem.surname}
                    </div>
                  ))}
              </div>
              <div className="couple" onDrop={coupleCount == 2 ? (e) => e.preventDefault() : (e) => onDrop(e, true, "couple")}>
                <h4>Coppia {coupleCount}/2</h4>
                {players
                  .filter(
                    (item) =>
                      item.starter === true &&
                      item.captain === false &&
                      item.couple === true
                  )
                  .map((subItem) => (
                    <div
                      key={subItem.id}
                      onDragStart={(e) => onDragStart(e, subItem.id)}
                      draggable
                      className="draggable"
                    >
                      {subItem.name} {subItem.surname}
                    </div>
                  ))}
              </div>
              <div className="bench" onDrop={benchCount == 4 ? (e) => e.preventDefault() : (e) => onDrop(e, false, "bench")}>
                <h4>Panchina {benchCount}/4</h4>
                {players
                  .filter(
                    (item) => item.starter === false && item.bench === true
                  )
                  .map((subItem) => (
                    <div
                      key={subItem.id}
                      onDragStart={(e) => onDragStart(e, subItem.id)}
                      draggable
                      className="draggable"
                    >
                      {subItem.name} {subItem.surname}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
        <button onClick={() => handleSaveSquad()}>Salva formazione</button>
      </div>
    </>
  );
}

export default InserimentoFormazione;
