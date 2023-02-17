import { Link } from "react-router-dom";

const InsertTeamBanner = ({ toggleModal }) => {
  return (
    <div className="banner-action">
      <div className="container">
        <Link to="/inserisci-formazione" className="action-link">
          Inserisci formazione
        </Link>
      </div>
    </div>
  );
};

export default InsertTeamBanner;
