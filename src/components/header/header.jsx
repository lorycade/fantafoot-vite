import { NavLink, useNavigate } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";

function Header() {
  const history = useNavigate()
  const {user, setUser} = useContext(UserContext)

  const handleLogout = () => {
    localStorage.removeItem('jwt')
    setUser(null)
    history('/')
  }

  return (
    <header>
      <Navbar bg="light" expand="lg" sticky="top">
        <Container>
          <NavLink to="/" className="navbar-brand">FANTAFOOTGOLF</NavLink>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <NavLink to="/listone" className="nav-link">Listone</NavLink>
              <NavLink to="/classifica" className="nav-link">Classifica</NavLink>
              <NavLink to="/squadre" className="nav-link">Squadre</NavLink>
              {user && <NavLink to="/profilo" className="nav-link">Profilo</NavLink>}
              {!user && <NavLink to="/login" className="nav-link">Accedi</NavLink>}
              {user && <button onClick={handleLogout} className="nav-link logout">Esci</button>}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;