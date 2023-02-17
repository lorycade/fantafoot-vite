
import { useContext } from "react";
import { UserContext } from "../context/UserContext";


function Profilo() {

  const {user, setUser} = useContext(UserContext)
  console.log(user);

  return (
    <>
      <p>Profilo</p>
    </>
  );
}

export default Profilo;