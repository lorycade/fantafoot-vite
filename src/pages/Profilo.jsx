import { useState, useContext } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Profilo() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordChanged, setPasswordChanged] = useState(false);
  const jwt = JSON.parse(localStorage.getItem("jwt"));
  const userData = JSON.parse(localStorage.getItem("user"));
  console.log(userData);

  // useEffect(() => {
  //   getPlayers();
  // }, []);

  const handleChangePassword = () => {
    console.log("jnnjnjj");
    axios
      .post(
        "http://localhost:1337/api/auth/change-password",
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
        console.log("data", response);
        setPasswordChanged(true);

        setTimeout(() => {
          setPasswordChanged(false);
        }, 2000);
        // history('/')
        // console.log("User token", response.data.jwt);
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
      <div className="container">
        {passwordChanged && (
          <div
            className="password-alert alert alert-success d-flex align-items-center"
            role="alert"
          >
            <div>Password modificata con successo</div>
          </div>
        )}
        <div className="row mt-40 fx-center">
          <div className="col-12">
            <h2 className="follow-title t-bold text-center">Profilo</h2>
          </div>
        </div>
        <div className="row mt-5">
          <div className="col-lg-7">
            <div className="user-info">
              Ciao <strong>{userData.name}</strong>
            </div>

            <Link to="/crea-squadra">{userData.players.length > 0 ? 'Modifica Squadra' : 'Crea Squadra'}</Link>
          </div>
          <div className="col-lg-5">
            <h3>Modifica Password</h3>
            <div className="mt-5 change-password-form">
              <div className="form-floating mb-3">
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(event) => setOldPassword(event.target.value)}
                  className="form-control"
                  id="old-password"
                  placeholder="Password"
                />
                <label htmlFor="old-password">Vecchia password</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  className="form-control"
                  id="new-password"
                  placeholder="Password"
                />
                <label htmlFor="new-password">Nuova password</label>
              </div>
              <div className="form-floating">
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(event) =>
                    setConfirmNewPassword(event.target.value)
                  }
                  className="form-control"
                  id="confirm-password"
                  placeholder="Password"
                />
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
    </>
  );
}

export default Profilo;
