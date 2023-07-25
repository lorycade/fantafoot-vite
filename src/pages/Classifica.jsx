import { useEffect, useState, useContext } from "react";
import axios, { all } from "axios";
import { UserContext } from "../context/UserContext";
import { Copyright, Group, Person } from "@mui/icons-material";
import {StageContext} from "../context/StageContext";

function Classifica() {
  const [detailOpen, setDetailOpen] = useState(null);
  const [userPlayers, setUserPlayers] = useState([]);
  const { user } = useContext(UserContext);
  const [sortType, setSortType] = useState(null);
  const jwt = localStorage.getItem("jwt");
  const { nextStage } = useContext(StageContext);

  useEffect(() => {
    getUserPlayers();
  }, []);

  const getUserPlayers = async () => {
    const response = await axios.get(
      import.meta.env.VITE_API_URL + "/api/users?sort=points:desc&populate=*"
    );

    setUserPlayers(response.data);
  };

  const calculatePoints = (tappaId) => {
    userPlayers.forEach((user) => {
      if (!user.lineups) return;

      console.log('formazioni',user.surname, user.lineups[tappaId].formation);

      let playerResults;
      if (user.lineups[tappaId]) {
        playerResults = user.lineups[tappaId].formation.map((obj) => {
          obj.results = user.players.find(({ id }) => id === obj.id)?.results;
          return obj;
        });
      }

      let captainResult = Number(
        playerResults.find((item) => item.captain == true)?.results[tappaId]?.result
      );

      const singlePlayers = playerResults.filter(
        (item) =>
          item.captain == false && item.starter == true && item.couple == false
      );

      const singlesResults = singlePlayers.reduce((accumulator, object) => {
        console.log('object.results', object);
        return accumulator + Number(object.results && object.results[tappaId]?.result);
      }, 0);

      const singleBestResult = Math.min(
        ...singlePlayers.map((item) => item.results[tappaId]?.result)
      );

      if (captainResult <= singleBestResult) {
        captainResult = captainResult + -5;
        playerResults.find((item) => item.captain == true).captainBest = true;
      }

      const couplePlayers = playerResults.filter(
        (item) =>
          item.captain == false && item.starter == true && item.couple == true
      );

      var coupleBestResult = Math.min(
        ...couplePlayers.map((item) => item.results[tappaId]?.result)
      );

      const best = playerResults.find(
        (item) =>
          item.results[tappaId]?.result === coupleBestResult &&
          item.couple === true
      )

      if (!!best) {
        best.coupleBest = true;
      }

      const totalPoints = captainResult + singlesResults + coupleBestResult;

      user.custom_result[tappaId].gamePoints = totalPoints;
    });
    calculateTourLeaderboards(tappaId);
  };

  const calculateTourLeaderboards = (tappaId) => {
    const orderByResult = userPlayers.sort((a, b) =>
      a.custom_result[tappaId].gamePoints > b.custom_result[tappaId].gamePoints
        ? 1
        : -1
    );

    let leaderboardPoint;
    orderByResult.forEach((user, i) => {
      switch (i + 1) {
        case 1:
          leaderboardPoint = 50;
          break;
        case 2:
          leaderboardPoint = 45;
          break;
        case 3:
          leaderboardPoint = 41;
          break;
        case 4:
          leaderboardPoint = 37;
          break;
        case 5:
          leaderboardPoint = 34;
          break;
        case 6:
          leaderboardPoint = 31;
          break;
        case 7:
          leaderboardPoint = 28;
          break;
        case 8:
          leaderboardPoint = 25;
          break;
        case 9:
          leaderboardPoint = 22;
          break;
        case 10:
          leaderboardPoint = 20;
          break;
        case 11:
          leaderboardPoint = 18;
          break;
        case 12:
          leaderboardPoint = 16;
          break;
        case 13:
          leaderboardPoint = 14;
          break;
        case 14:
          leaderboardPoint = 12;
          break;
        case 15:
          leaderboardPoint = 11;
          break;
        case 16:
          leaderboardPoint = 10;
          break;
        case 17:
          leaderboardPoint = 9;
          break;
        case 18:
          leaderboardPoint = 8;
          break;
        case 19:
          leaderboardPoint = 7;
          break;
        case 20:
          leaderboardPoint = 6;
          break;
        case 21:
          leaderboardPoint = 5;
          break;
        case 22:
          leaderboardPoint = 4;
          break;
        case 23:
          leaderboardPoint = 3;
          break;
        case 24:
          leaderboardPoint = 2;
          break;

        default:
          leaderboardPoint = 1;
          break;
      }

      user.custom_result[tappaId].leaderboardPoints = leaderboardPoint;
    });

    checkForSameGamePoints(tappaId);
  };

  const checkForSameGamePoints = (tappaId) => {
    const lookup = userPlayers.reduce((a, e) => {
      a.set(
        e.custom_result[tappaId].gamePoints,
        (a.get(e.custom_result[tappaId].gamePoints) ?? 0) + 1
      );
      return a;
    }, new Map());

    const duplicates = userPlayers
      .slice(0, 30)
      .filter((e) => lookup.get(e.custom_result[tappaId].gamePoints) > 1);

    const output = duplicates.reduce(
      (a, v) => (
        (a[v.custom_result[tappaId].gamePoints] =
          a[v.custom_result[tappaId].gamePoints] || []).push(v),
        a
      ),
      {}
    );

    const newArray = Object.values(output);

    newArray.forEach((element) => {
      let singlesResults = element.reduce((accumulator, object) => {
        return (
          accumulator + Number(object.custom_result[tappaId].leaderboardPoints)
        );
      }, 0);

      element.forEach((dupObj) => {
        const player = userPlayers.find((item) => item.id == dupObj.id);
        player.custom_result[tappaId].leaderboardPoints = (
          singlesResults / element.length
        ).toFixed(1);
      });
    });

    userPlayers.forEach((user) => {
      let pointsSum = user.custom_result.reduce((accumulator, object) => {
        return accumulator + Number(object.leaderboardPoints);
      }, 0);

      user.points = pointsSum;

      handleCalculate(user);
    });
  };

  const handleCalculate = (user) => {
    axios
      .put(
        import.meta.env.VITE_API_URL + "/api/users/" + user.id,
        {
          points: user.points,
          custom_result: user.custom_result,
          lineups: user.lineups,
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      )
      .then((response) => {
        console.log("response", response);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      });
  };

  const updateusersForCalculate = (user) => {
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
        console.log("response", response);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      });
  };

  const handleLeaderboard = (tappa) => {
    setSortType(tappa);
  };

  const handleDetailOpen = (user) => {
    if (user.teamName !== detailOpen) {
      setDetailOpen(user.teamName);
    } else {
      setDetailOpen(null);
    }
  };

  const getAllPlayers = async (index) => {
    const response = await axios
      .get(import.meta.env.VITE_API_URL + "/api/players")
      .then((response) => {
        const allPlayers = response.data.data;
        handleUpdateLineupResult(allPlayers, index);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      });
  };

  const handleUpdateLineupResult = async (allPlayers, tappa) => {
    userPlayers.forEach((user) => {
      const lineupPlayers = user.lineups[tappa].formation;
      lineupPlayers.forEach((player) => {
        const single = allPlayers.find((item) => item.id === player.id);
        player.results = single.results;
      });

      updateusersForCalculate(user);
    });
  };

  return (
    <>
      <div className="container-lg">
        <div className="row mt-40 fx-center">
          <div className="col-12">
            <h2 className="follow-title t-bold text-center">Classifica</h2>
          </div>
        </div>
        <div className="leaderboard-filters-wrapper mt-5">
          <button
            className={sortType == null ? "active" : ""}
            onClick={() => handleLeaderboard(null)}
          >
            Generale
          </button>
          <button
            className={sortType == 0 ? "active" : ""}
            onClick={() => handleLeaderboard(0)}
          >
            Tappa 1
          </button>
          <button
            className={sortType == 1 ? "active" : ""}
            onClick={() => handleLeaderboard(1)}
          >
            Tappa 2
          </button>
          <button
            className={sortType == 2 ? "active" : ""}
            onClick={() => handleLeaderboard(2)}
          >
            Tappa 3
          </button>
          <button
            className={sortType == 3 ? "active" : ""}
            onClick={() => handleLeaderboard(3)}
          >
            Tappa 4
          </button>
          <button
            className={sortType == 4 ? "active" : ""}
            onClick={() => handleLeaderboard(4)}
          >
            Tappa 5
          </button>
          <button
            disabled
            className={sortType == 5 ? "active" : ""}
            onClick={() => handleLeaderboard(5)}
          >
            Tappa 6
          </button>
          <button
            disabled
            className={sortType == 6 ? "active" : ""}
            onClick={() => handleLeaderboard(6)}
          >
            Tappa 7
          </button>
        </div>
        <div className="leaderboard mt-5">
          <div
            className={sortType != null ? "line head single-tour" : "line head"}
          >
            <div className="cell">Pos.</div>
            <div className="cell">Giocatore</div>
            {sortType !== null && <div className="cell">Punteggio</div>}
            <div className="cell">Punti</div>
          </div>
          {sortType === null &&
            userPlayers
              .sort((a, b) => (a.points > b.points ? -1 : 1))
              .map((user, i) => (
                <div className="line body" key={user.id}>
                  <div className="cell">{i + 1}</div>
                  <div className="cell teamname">{user.teamName} - <i>({user.name.split('')[0] + '. '}{user.surname})</i></div>
                  <div className="cell">{user.points}</div>
                </div>
              ))}
          {sortType !== null &&
            userPlayers
              .sort((a, b) =>
                a.custom_result[sortType].gamePoints >
                b.custom_result[sortType].gamePoints
                  ? 1
                  : -1
              )
              .map((user, i) => (
                <>
                  <div className="line body single-tour" key={user.id}>
                    <div className="cell">{i + 1}</div>
                    <div className="cell teamname">{user.teamName} - <i>({user.name.split('')[0] + '. '}{user.surname})</i></div>
                    <div className="cell">
                      {user.custom_result[sortType].gamePoints}
                    </div>
                    <div className="cell">
                      {user.custom_result[sortType].leaderboardPoints}
                    </div>
                    <button
                      className="detail-btn"
                      type="button"
                      onClick={() => handleDetailOpen(user)}
                    >
                      Dettagli
                    </button>
                  </div>
                  {detailOpen === user.teamName && (
                    <div className="lineup-wrapper-leaderboard">
                      {user.lineups[sortType].formation
                        .filter((item) => item.captain == true)
                        .map((player) => (
                          <div className="player-wrapper" key={player.id}>
                            <div className="icon-box">
                              <Copyright />
                            </div>
                            <div className="player"> {player.surname}</div>
                            <div className="result">
                              {player.results[sortType].result}
                            </div>
                            {player.captainBest && (
                              <span className="bonus">-5</span>
                            )}
                          </div>
                        ))}

                      {user.lineups[sortType].formation
                        .filter(
                          (item) =>
                            item.captain == false &&
                            item.starter == true &&
                            item.couple == false
                        )
                        .map((player) => (
                          <div className="player-wrapper" key={player.id}>
                            <div className="icon-box">
                              <Person />
                            </div>
                            <div className="player">{player.surname}</div>
                            <div className="result">
                              {player.results[sortType].result}
                            </div>
                          </div>
                        ))}

                      {user.lineups[sortType].formation
                        .filter(
                          (item) =>
                            item.captain == false &&
                            item.starter == true &&
                            item.couple == true
                        )
                        .map((player) => (
                          <div
                            className={
                              player.coupleBest
                                ? "player-wrapper couple best"
                                : "player-wrapper couple"
                            }
                            key={player.id}
                          >
                            <div className="icon-box">
                              <Group />
                            </div>
                            <div className="player"> {player.surname}</div>
                            <div className="result">
                              {player.results[sortType].result}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </>
              ))}
        </div>
        {user && user.role && user.role.type == "admin" && (
          <>
            <button onClick={() => getAllPlayers(nextStage - 1)}>
              Aggiorna punteggi giocatori
            </button>
            <button onClick={() => calculatePoints(nextStage - 1)}>
              Calcola giornata {nextStage}
            </button>
          </>
        )}
      </div>
    </>
  );
}

export default Classifica;
