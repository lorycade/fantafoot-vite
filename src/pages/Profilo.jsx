// import { useContext } from "react";
// import { UserContext } from "../context/UserContext";
import { Link } from "react-router-dom"

function Profilo() {
  // const {user, setUser} = useContext(UserContext)
  

  return (
    <>
      <div className="container">
        <div className="row mt-40 fx-center">
          <div className="col-12">
            <h2 className="follow-title t-bold text-center">Profilo</h2>
          </div>
        </div>
        <Link to="/crea-squadra">Crea squadra</Link>
      </div>
    </>
  );
}

export default Profilo;
