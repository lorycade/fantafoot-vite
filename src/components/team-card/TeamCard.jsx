import { Link } from "react-router-dom"

function TeamCard({ user }) {
  return (
    <div className="user-card">
      <div className="circle-name">LC</div>
      <div className="team-name">{user.teamName}</div>
      <div className="user-name">{user.name} {user.surname}</div>
      <Link to={`/squadre/${user.id}`} className="link-detail">Vedi di più</Link>
    </div>
  );
}

export default TeamCard;
