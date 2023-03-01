import { useEffect, useState } from "react";
import axios from "axios";

function Classifica() {
  const [userPlayers, setUserPlayers] = useState([]);
  // const [resultArray, setresultArray] = useState([]);
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    getUserPlayers();
  }, []);

  const getUserPlayers = async () => {
    const response = await axios.get(
      import.meta.env.VITE_API_URL + "/api/users?populate=*"
    );

    console.log('initial', response.data);

    setUserPlayers(response.data);
  };

  const calculatePoints = (tappaId) => {
    userPlayers.forEach((user) => {
      if (!user.lineups) return;

      const playerResults = user.lineups[0].formation.map((obj) => {
        obj.results = user.players.find(({ id }) => id === obj.id).results;
        return obj;
      });

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
        (item) => Number(item.results[tappaId].result) < captainResult
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

        default:
          break;
      }

      user.custom_result[tappaId].leaderboardPoints = leaderboardPoint;
      user.points = user.points + leaderboardPoint;
      handleCalculate(user)
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

  // const handleLeaderboard = (tappa) => {
  //   const orderByResult = userPlayers.sort((a, b) =>
  //     a.userResult[tappa].leaderboardPoint > b.userResult[tappa].leaderboardPoint ? 1 : -1
  //   )

  //   console.log(orderByResult);
  // }

  return (
    <>
      <div className="container">
        <div className="row mt-40 fx-center">
          <div className="col-12">
            <h2 className="follow-title t-bold text-center">Classifica</h2>
          </div>
        </div>
        <div className="filter-wrapper">
          <button onClick={() => handleLeaderboard(0)}>Generale</button>
          <button onClick={() => handleLeaderboard(1)}>Tappa 1</button>
          <button onClick={() => handleLeaderboard(2)}>Tappa 2</button>
        </div>
        <div className="leaderboard mt-5">
          <div className="line head">
            <div className="cell">Posizione</div>
            <div className="cell">Giocatore</div>
            <div className="cell">Punti</div>
          </div>
          {userPlayers.map((user, i) => (
            <>
              <div className="line body">
                <div className="cell">{i + 1}</div>
                <div className="cell">{user.teamName}</div>
                <div className="cell">{user.points}</div>
              </div>
            </>
          ))}
        </div>
        <button onClick={() => calculatePoints(0)}>Calcola giornata 1</button>
        <button onClick={() => calculatePoints(1)}>Calcola giornata 2</button>
      </div>
    </>
  );
}

export default Classifica;
