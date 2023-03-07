import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import LoginBackground from "../resources/imgaes/login-background.jpg";
import { EyeFill, EyeSlashFill } from 'react-bootstrap-icons';

function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [isRecover, setIsRecover] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { user, setUser } = useContext(UserContext);

  const history = useNavigate();


  useEffect(() => {
    if (user) {
      history("/");
    }
  }, [user]);

  const handleSubmit = async (event) => {
    axios
      .post(import.meta.env.VITE_API_URL + "/api/auth/local", {
        identifier: email,
        password,
      })
      .then((response) => {
        setUser(response.data.user);
        // localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("jwt", response.data.jwt);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
        if (error.response.status == 400) {
          setError("Email o Password errate");
        }
      });
  };

  const handleRecoverPassword = () => {
    axios
      .post(import.meta.env.VITE_API_URL + "/api/auth/forgot-password", {
        email: email,
      })
      .then((response) => {
        console.log("Your user received an email", response);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      });
  };

  return (
    <>
      <div className="login-page">
        <img src={LoginBackground} alt="" />
        <div className="login-form">
          <h1>{isRecover ? "Recupera Password" : "Accedi"}</h1>
          {!isRecover && (
            <form className="mt-5" onSubmit={(e) => e.preventDefault()}>
              <div className="form-floating mb-3">
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="form-control"
                  id="floatingInput"
                  placeholder="name@example.com"
                />
                <label htmlFor="floatingInput">Email</label>
              </div>
              <div className="form-floating">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="form-control"
                  id="floatingPassword"
                  placeholder="Password"
                />
                <button className="toggle-psw-btn" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeFill/> : <EyeSlashFill/>}
                </button>
                <label htmlFor="floatingPassword">Password</label>
              </div>
              {error && <p className="error-text">{error}</p>}
              <button onClick={() => handleSubmit()} className="btn btn-primary btn-lg login-btn mt-4">
                Accedi
              </button>
              <button
                className="recover-link"
                onClick={() => setIsRecover(!isRecover)}
              >
                Password dimenticata ?
              </button>
            </form>
          )}
          {isRecover && (
            <form className="mt-5" onSubmit={(e) => e.preventDefault()}>
              <div className="form-floating mb-3">
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="form-control"
                  id="floatingInput"
                  placeholder="name@example.com"
                />
                <label htmlFor="floatingInput">Email</label>
              </div>
              <button onClick={() => handleRecoverPassword()} className="btn btn-primary btn-lg login-btn mt-4">
                Recupera password
              </button>
              <button
                className="recover-link"
                onClick={() => setIsRecover(!isRecover)}
              >
                Accedi
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

export default Login;
