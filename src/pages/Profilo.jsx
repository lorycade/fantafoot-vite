import { useState, useContext } from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { EyeFill, EyeSlashFill } from "react-bootstrap-icons";
import { Alert } from "@mui/material";

// import ModalTeamName from "../components/modal/ModalTeamName";

function Profilo() {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordChanged, setPasswordChanged] = useState(false);
  // const [showModal, setShowModal] = useState(false);
  const jwt = localStorage.getItem("jwt");
  // const userData = JSON.parse(localStorage.getItem("user"));
  // const userPlayers = JSON.parse(localStorage.getItem("userPlayers"));
  const { user, setUser } = useContext(UserContext);
  const history = useNavigate();

  useEffect(() => {
    if (!jwt) {
      history("/");
    }
    getMyData()
  }, []);

  const getMyData = async () => {
    const response = await axios.get(
      import.meta.env.VITE_API_URL + "/api/users/me?populate=*",
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    
    setUser(response.data)
  };

  const handleChangePassword = () => {
    axios
      .post(
        import.meta.env.VITE_API_URL + "/api/auth/change-password",
        {
          currentPassword: oldPassword,
          password: newPassword,
          passwordConfirmation: confirmNewPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      )
      .then((response) => {
        setPasswordChanged(true);

        setTimeout(() => {
          setPasswordChanged(false);
        }, 2000);
        // history('/')
        // setUser(response.data)
        // localStorage.setItem('user', JSON.stringify(response.data))
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
        // if (error.response.status == 400) {
        //   setError('Email o Password errate');
        // }
      });
  };

  return (
    <>
      {!!user && (
        <div className="container-lg">
          {passwordChanged && (
            <Alert severity="success" className="alert-custom">
              Password modificata correttamente
            </Alert>
          )}
          <div className="row mt-40 fx-center">
            <div className="col-12">
              <h2 className="follow-title t-bold text-center">Profilo</h2>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-lg-7">
              <div className="user-info mb-5">
                Ciao <strong>{user.name}</strong>
              </div>
              <div className="user-info mb-2">
                Crediti disponibili <strong>{user.credits}</strong>
              </div>
              <div className="user-info mb-5">
                Nome Squadra <strong>{user.teamName}</strong>
                {/* <button onClick={() => setShowModal(true)}>Modifica</button> */}
              </div>

              <p>
                Per modificare il nome della squadra o la tua rosa,
                clicca qui sotto
              </p>
              <Link to="/crea-squadra">
                {user && user.teamName ? "Modifica Squadra" : "Crea Squadra"}
              </Link>
            </div>
            <div className="col-lg-5">
              <h3>Modifica Password</h3>
              <div className="mt-5 change-password-form">
                <div className="form-floating mb-3">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    value={oldPassword}
                    onChange={(event) => setOldPassword(event.target.value)}
                    className="form-control"
                    id="old-password"
                    placeholder="Password"
                  />
                  <button
                    className="toggle-psw-btn"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                  >
                    {showOldPassword ? <EyeFill /> : <EyeSlashFill />}
                  </button>
                  <label htmlFor="old-password">Vecchia password</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    className="form-control"
                    id="new-password"
                    placeholder="Password"
                  />
                  <button
                    className="toggle-psw-btn"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeFill /> : <EyeSlashFill />}
                  </button>
                  <label htmlFor="new-password">Nuova password</label>
                </div>
                <div className="form-floating">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmNewPassword}
                    onChange={(event) =>
                      setConfirmNewPassword(event.target.value)
                    }
                    className="form-control"
                    id="confirm-password"
                    placeholder="Password"
                  />
                  <button
                    className="toggle-psw-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeFill /> : <EyeSlashFill />}
                  </button>
                  <label htmlFor="confirm-password">
                    Conferma nuova password
                  </label>
                </div>
                <button
                  className="btn btn-primary btn-lg mt-4"
                  onClick={() => handleChangePassword()}
                >
                  Modifica
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Profilo;
