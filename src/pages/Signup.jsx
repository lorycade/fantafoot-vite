import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoginBackground from "../resources/imgaes/login-background.jpg";

function Signup() {
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const history = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(name, surname, username, email, password);

    axios
      .post(import.meta.env.VITE_API_URL + "/api/auth/local/register", {
        name,
        surname,
        username,
        email,
        password,
        custom_result: [
          {
            "gamePoints": null,
            "leaderboardPoints": null
          },
          {
            "gamePoints": null,
            "leaderboardPoints": null
          },
          {
            "gamePoints": null,
            "leaderboardPoints": null
          },
          {
            "gamePoints": null,
            "leaderboardPoints": null
          },
          {
            "gamePoints": null,
            "leaderboardPoints": null
          },
          {
            "gamePoints": null,
            "leaderboardPoints": null
          },
          {
            "gamePoints": null,
            "leaderboardPoints": null
          }
        ]
      })
      .then((response) => {
        setSignupSuccess(true);
      })
      .catch((error) => {
        console.log("An error occurred:", error);

        if (
          error.response.data.error.message ==
          "Email or Username are already taken"
        ) {
          setError(
            "Email o Username già esistente, modificare oppure vai alla pagina di accesso"
          );
        } else {
          setError("Compila correttamente tutti i campi");
        }
      });
  };

  return (
    <>
      <div className="login-page">
        <img src={LoginBackground} alt="" />
        <div className="login-form">
          {!signupSuccess && (
            <>
              <h1>Registrazione</h1>
              <form className="mt-5" onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="form-control"
                    id="name"
                    placeholder="name@example.com"
                  />
                  <label htmlFor="name">Nome</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    value={surname}
                    onChange={(event) => setSurname(event.target.value)}
                    className="form-control"
                    id="surname"
                    placeholder="name@example.com"
                  />
                  <label htmlFor="surname">Cognome</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    className="form-control"
                    id="username"
                    placeholder="name@example.com"
                  />
                  <label htmlFor="username">Username</label>
                </div>
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
                  Registrati
                </button>
              </form>
            </>
          )}
          {signupSuccess && 
          <>
            <p>A breve riceverei una mail di conferma dell'avvenuta registrazione con il link di conferma, una volta confermato, potrai accedere al tuo profilo</p>
          </>}
        </div>
      </div>
    </>
  );
}

export default Signup;
