import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import LoginBackground from "../resources/imgaes/login-background.jpg";
import { useParams } from "react-router-dom";
import { EyeFill, EyeSlashFill } from "react-bootstrap-icons";
import { Alert } from "@mui/material";

function RecoverPassword() {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { recoverCode } = useParams();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordChanged, setPasswordChanged] = useState(false);

  const history = useNavigate();

  const handleSubmit = async (event) => {
    axios
      .post(import.meta.env.VITE_API_URL + "/api/auth/reset-password", {
        code: recoverCode, // code contained in the reset link of step 3.
        password: password,
        passwordConfirmation: confirmPassword,
      })
      .then((response) => {
        console.log("Your user's password has been reset.");
        setPasswordChanged(true);

        setTimeout(() => {
          setPasswordChanged(false);
          history("/login");
        }, 3000);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response.data.error.message);
        if (error.response.data.error.message == "Passwords do not match") {
          setError("Le password devono essere uguali");
        }
        if (error.response.data.error.message === "Incorrect code provided") {
          setError(
            "Questa pagina è scaduta, richiedi nuovamente il reset della password"
          );
        }
      });
  };

  return (
    <>
      <div className="login-page">
        <img src={LoginBackground} alt="" />
        {passwordChanged && (
          <Alert severity="success" className="alert-custom">
            Password modificata correttamente
          </Alert>
        )}
        <div className="login-form">
          <h1>Inserisci nuova password</h1>
          <form className="mt-5" onSubmit={(e) => e.preventDefault()}>
            <div className="form-floating mb-3">
              <input
                type={showNewPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="form-control"
                id="newPassword"
                placeholder="Password"
              />
              <button
                className="toggle-psw-btn"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeFill /> : <EyeSlashFill />}
              </button>
              <label htmlFor="newPassword">Nuova password</label>
            </div>
            <div className="form-floating">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="form-control"
                id="confirmPassword"
                placeholder="Password"
              />
              <button
                className="toggle-psw-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeFill /> : <EyeSlashFill />}
              </button>
              <label htmlFor="confirmPassword">Conferma assword</label>
            </div>
            {error && <p className="error-text">{error}</p>}
            <button
              onClick={() => handleSubmit()}
              className="btn btn-primary btn-lg login-btn mt-4"
            >
              Salva
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default RecoverPassword;
