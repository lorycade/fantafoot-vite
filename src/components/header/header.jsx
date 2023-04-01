import React, { useEffect, useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { Close, Menu } from "@mui/icons-material";

function Header() {
  const { user, setUser } = useContext(UserContext);
  const history = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    window.addEventListener("resize", () => {
      if (window.matchMedia("(min-width: 1024px)").matches) {
        setMenuOpen(false)
      }
    });
  }, []);

  const menuToggleHandler = () => {
    const body = document.querySelector('body')
    if (menuOpen === false) {
      body.style.overflowY = 'hidden'
    } else {
      body.removeAttribute('style')
    }
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setMenuOpen(false)
    history("/");
  };

  return (
    <header className="header">
      <div className="container-lg">
        <div className="header__content">
          <NavLink to="/" className="header__content__logo">
            Fantafootgolf
          </NavLink>
          <nav
            className={
              menuOpen === false
                ? "header__content__nav"
                : "header__content__nav isMenu"
            }
          >
            <ul>
              <li>
                <NavLink to="/listone" className="nav-link" onClick={() => setMenuOpen(false)}>
                  Listone
                </NavLink>
              </li>
              <li>
                <NavLink to="/classifica" className="nav-link" onClick={() => setMenuOpen(false)}>
                  Classifica
                </NavLink>
              </li>
              <li>
                <NavLink to="/formazioni" className="nav-link" onClick={() => setMenuOpen(false)}>
                  Formazioni
                </NavLink>
              </li>
              <li>
                <NavLink to="/squadre" className="nav-link" onClick={() => setMenuOpen(false)}>
                  Squadre
                </NavLink>
              </li>
              {user && user.confirmed && (
                <li>
                  <NavLink to="/profilo" className="nav-link" onClick={() => setMenuOpen(false)}>
                    Profilo
                  </NavLink>
                </li>
              )}
              {!user && (
                <li>
                  <NavLink to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>
                    Accedi
                  </NavLink>
                </li>
              )}
              {user && user.confirmed && (
                <li>
                  <button onClick={handleLogout} className="nav-link logout">
                    Esci
                  </button>
                </li>
              )}
            </ul>
          </nav>
          <div className="header__content__toggle">
            {menuOpen === true ? (
              <Close onClick={menuToggleHandler} fontSize="large" />
              
              
            ) : (
              <Menu onClick={menuToggleHandler} fontSize="large" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
