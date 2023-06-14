import {
  Copyright,
  Group,
  Looks3,
  Looks4,
  LooksOne,
  LooksTwo,
  Person,
} from "@mui/icons-material";

function LineupCard({ user, activeGame }) {
  // console.log('card', user.lineups[3]);
  return (
    <div className="lineup-card">
      <div className="card-head">
        <p className="team-name">{user.teamName}</p>
        <p className="player-name">
          {user.name} {user.surname}
        </p>
      </div>
      {user.lineups == null || user.lineups[activeGame].formation.length === 0 && 
        <p className="no-lineup">Formazione non inserita</p>
      }
      {user.lineups != null && user.lineups[activeGame].formation.length > 0 && 
        <div className="lineup-wrapper">
          {user.lineups[activeGame].formation
            .filter((item) => item.captain == true)
            .map((player) => (
              <div className="player-wrapper" key={player.id}>
                <div className="icon-box">
                  <Copyright />
                </div>
                <div className="player">
                  {player.name} {player.surname}
                </div>
              </div>
            ))}

          {user.lineups[activeGame].formation
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
                <div className="player">
                  {player.name} {player.surname}
                </div>
              </div>
            ))}

          {user.lineups[activeGame].formation
            .filter(
              (item) =>
                item.captain == false &&
                item.starter == true &&
                item.couple == true
            )
            .map((player) => (
              <div className="player-wrapper" key={player.id}>
                <div className="icon-box">
                  <Group />
                </div>
                <div className="player">
                  {player.name} {player.surname}
                </div>
              </div>
            ))}
          <div className="bench">Panchina</div>

          {user.lineups[activeGame].formation
            .filter((item) => item.starter == false && item.benchOrder == 1)
            .map((player) => (
              <div className="player-wrapper" key={player.id}>
                <div className="icon-box">
                  <LooksOne />
                </div>
                <div className="player">
                  {player.name} {player.surname}
                </div>
              </div>
            ))}

          {user.lineups[activeGame].formation
            .filter((item) => item.starter == false && item.benchOrder == 2)
            .map((player) => (
              <div className="player-wrapper" key={player.id}>
                <div className="icon-box">
                  <LooksTwo />
                </div>
                <div className="player">
                  {player.name} {player.surname}
                </div>
              </div>
            ))}

          {user.lineups[activeGame].formation
            .filter((item) => item.starter == false && item.benchOrder == 3)
            .map((player) => (
              <div className="player-wrapper" key={player.id}>
                <div className="icon-box">
                  <Looks3 />
                </div>
                <div className="player">
                  {player.name} {player.surname}
                </div>
              </div>
            ))}

          {user.lineups[activeGame].formation
            .filter((item) => item.starter == false && item.benchOrder == 4)
            .map((player) => (
              <div className="player-wrapper" key={player.id}>
                <div className="icon-box">
                  <Looks4 />
                </div>
                <div className="player">
                  {player.name} {player.surname}
                </div>
              </div>
            ))}
        </div>
      }
    </div>
  );
}

export default LineupCard;
