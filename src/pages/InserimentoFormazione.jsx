import { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";

function InserimentoFormazione() {
  const jwt = localStorage.getItem("jwt");
  const { user, setUser } = useContext(UserContext);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    if (user && user.lineups) {
      console.log(user.lineups.tappa1);
      setPlayers(user.lineups.tappa1)
    } else {
      setPlayers(user.players)
    }
  }, [user]);

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
      "tappa1": players
    }

    axios
      .put(
        "http://localhost:1337/api/users/" + user.id,
        {
          players,
          lineups: lineup,
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      )
      .then((response) => {
        const newUser = {...response.data, players: players, lineups: lineup}
        setUser(newUser)
        // setTeamCreated(true);

        // setTimeout(() => {
        //   setTeamCreated(false);
        //   history("/profilo");
        // }, 3000);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      });
    
  }


  return (
    <>
      <div className="container mb-5">
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
                onDrop={(e) => onDrop(e, true, "captain")}
              >
                <h4>capitano</h4>
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
                onDrop={(e) => onDrop(e, true, "single")}
              >
                <h4>Giocatori Singoli</h4>
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
              <div className="couple" onDrop={(e) => onDrop(e, true, "couple")}>
                <h4>Coppia</h4>
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
              <div className="bench" onDrop={(e) => onDrop(e, false, "bench")}>
                <h4>Panchina</h4>
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
