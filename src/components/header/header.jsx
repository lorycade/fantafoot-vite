import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";

const Header = ({ toggleModal }) => {

  const {user} = useContext(UserContext)

  console.log(user);

  return (
    <header>
      <ul className="nav nav-pills">
        <li className="nav-item"><NavLink to="/" className="nav-link" end>Home</NavLink></li>
        <li className="nav-item"><NavLink to="/listone" className="nav-link">Listone</NavLink></li>
        <li className="nav-item"><NavLink to="/classifica" className="nav-link">Classifica</NavLink></li>
        {user && <li className="nav-item"><NavLink to="/profilo" className="nav-link">
            Profilo
          </NavLink></li>}
        {!user && <li className="nav-item"><NavLink to="/login" className="nav-link">Login</NavLink></li>}
        {/* <div className="nav-item"><Button className="nav-link" onClick={toggleModal}>Accedi</Button></div> */}
      </ul>
    </header>
  )
}

export default Header
