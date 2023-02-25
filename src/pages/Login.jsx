import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

function Login() {
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
        setUser(response.data);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("jwt", JSON.stringify(response.data.jwt));
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
        if (error.response.status == 400) {
          setError("Email o Password errate");
        }
      });
  };

  return (
    <>
      <div className="container my-5">
        <h1>Login</h1>

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
          <button className="btn btn-primary btn-lg mt-4">Accedi</button>
        </form>
        {error && <p>{error}</p>}
      </div>
    </>
  );
}

export default Login;
