import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import LoginBackground from "../resources/imgaes/login-background.jpg";

function Login() {
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
    event.preventDefault();

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
            <form className="mt-5" onSubmit={handleSubmit}>
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
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="form-control"
                  id="floatingPassword"
                  placeholder="Password"
                />
                <label htmlFor="floatingPassword">Password</label>
              </div>
              {error && <p className="error-text">{error}</p>}
              <button className="btn btn-primary btn-lg login-btn mt-4">
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
            <form className="mt-5" onSubmit={handleRecoverPassword}>
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
              <button className="btn btn-primary btn-lg login-btn mt-4">
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
