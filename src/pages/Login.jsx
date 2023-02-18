import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const {user, setUser} = useContext(UserContext)

  const history = useNavigate()

  useEffect(() => {
    if (user) {
      history('/')
    }
  }, [user])

  const handleSubmit = async (event) => {
    event.preventDefault();

    axios
      .post("http://localhost:1337/api/auth/local", {
        identifier: email,
        password,
      })
      .then((response) => {
        console.log("User profile", response);
        // console.log("User token", response.data.jwt);
        setUser(response.data)
        localStorage.setItem('user', JSON.stringify(response.data))
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
        if (error.response.status == 400) {
          setError('Email o Password errate');
        }
      });
  };

  return (
    <>
      <div className="container">
        <h1>Login</h1>

        <form className="mt-5" onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <button>Login</button>
        </form>
        {error && <p>{error}</p>}
      </div>
    </>
  );
}

export default Login;
