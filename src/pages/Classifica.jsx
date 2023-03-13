import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";

function Classifica() {
  const [userPlayers, setUserPlayers] = useState([]);
  const { user } = useContext(UserContext);
  const [sortType, setSortType] = useState(null);
  const jwt = localStorage.getItem("jwt");

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

      let playerResults;
      if (user.lineups[tappaId]) {
        playerResults = user.lineups[tappaId].formation.map((obj) => {
          obj.results = user.players.find(({ id }) => id === obj.id).results;
          return obj;
        });
      } else {
        playerResults = user.lineups[tappaId - 1].formation.map((obj) => {
          obj.results = user.players.find(({ id }) => id === obj.id).results;
          return obj;
        });
      }
      

      let captainResult = Number(
        playerResults.find((item) => item.captain == true).results[tappaId]
          .result
      );

      const singlePlayers = playerResults.filter(
        (item) =>
          item.captain == false && item.starter == true && item.couple == false
      );

      const singlesResults = singlePlayers.reduce((accumulator, object) => {
        return accumulator + Number(object.results[tappaId].result);
      }, 0);

      const captainIsBest = singlePlayers.filter(
        (item) => Number(item.results[tappaId].result) <= captainResult
      );

      if (captainIsBest.length == 0) {
        captainResult = captainResult + -5;
      }

      const couplePlayers = playerResults.filter(
        (item) =>
          item.captain == false && item.starter == true && item.couple == true
      );

      var coupleBestResult = Math.min(
        ...couplePlayers.map((item) => item.results[tappaId].result)
      );

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
    console.log("orderByResult", orderByResult);

    const foundDuplicateName = orderByResult.find((nnn, index) => {
      return orderByResult.find(
        (x, ind) =>
          x.custom_result[tappaId].gamePoints ===
            nnn.custom_result[tappaId].gamePoints && index !== ind
      );
    });

    // const duplicatePoint = foundDuplicateName.custom_result[tappaId].gamePoints;

    // const listOfDuplicates = orderByResult.filter(item => item.custom_result[tappaId].gamePoints == duplicatePoint)

    // const sumPointsDivider = listOfDuplicates.reduce((accumulator, object) => {
    //   return accumulator + Number(object.custom_result[tappaId].leaderboardPoints);
    // }, 0);

    // const pointsForPlayersDivider = sumPointsDivider / listOfDuplicates.length;

    // console.log("non ce la farò", pointsForPlayersDivider);

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
      
      console.log(user);

      user.custom_result[tappaId].leaderboardPoints = leaderboardPoint;
      user.points = user.points + leaderboardPoint;
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
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      )
      .then((response) => {
        console.log("response", response);
        // setUser(newUser)
        // setTeamCreated(true);

        // setTimeout(() => {
        //   setTeamCreated(false);
        //   history("/profilo");
        // }, 3000);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      });
  };

  const handleLeaderboard = (tappa) => {
    setSortType(tappa);
  };

  return (
    <>
      <div className="container">
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
            disabled
            className={sortType == 2 ? "active" : ""}
            onClick={() => handleLeaderboard(1)}
          >
            Tappa 3
          </button>
          <button
            disabled
            className={sortType == 3 ? "active" : ""}
            onClick={() => handleLeaderboard(1)}
          >
            Tappa 4
          </button>
          <button
            disabled
            className={sortType == 4 ? "active" : ""}
            onClick={() => handleLeaderboard(1)}
          >
            Tappa 5
          </button>
          <button
            disabled
            className={sortType == 5 ? "active" : ""}
            onClick={() => handleLeaderboard(1)}
          >
            Tappa 6
          </button>
          <button
            disabled
            className={sortType == 6 ? "active" : ""}
            onClick={() => handleLeaderboard(1)}
          >
            Tappa 7
          </button>
        </div>
        <div className="leaderboard mt-5">
          <div className={sortType != null ? 'line head single-tour' : 'line head'}>
            <div className="cell">Pos.</div>
            <div className="cell">Giocatore</div>
            {sortType !== null && <div className="cell">Punteggio</div>}
            <div className="cell">Punti</div>
          </div>
          {sortType == null &&
            userPlayers
              .sort((a, b) => (a.points > b.points ? -1 : 1))
              .map((user, i) => (
                <>
                  <div className="line body" key={i}>
                    <div className="cell">{i + 1}</div>
                    <div className="cell">{user.teamName}</div>
                    <div className="cell">{user.points}</div>
                  </div>
                </>
              ))}
          {sortType != null &&
            userPlayers
              .sort((a, b) =>
                a.custom_result[sortType].leaderboardPoints >
                b.custom_result[sortType].leaderboardPoints
                  ? -1
                  : 1
              )
              .map((user, i) => (
                <>
                  <div className="line body single-tour" key={i}>
                    <div className="cell">{i + 1}</div>
                    <div className="cell">{user.teamName}</div>
                    <div className="cell">{user.custom_result[0].gamePoints}</div>
                    <div className="cell">
                      {user.custom_result[sortType].leaderboardPoints}
                    </div>
                  </div>
                </>
              ))}
        </div>
        {user && user.role.type == "admin" && (
          <>
            <button onClick={() => calculatePoints(0)}>
              Calcola giornata 1
            </button>
            <button onClick={() => calculatePoints(1)}>
              Calcola giornata 2
            </button>
          </>
        )}
      </div>
    </>
  );
}

export default Classifica;
