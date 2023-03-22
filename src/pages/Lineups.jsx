import axios from "axios";
import { useEffect, useState } from "react";
import LineupCard from "../components/lineup-card/LineupCard";


function Lineups() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    const response = await axios.get(
      import.meta.env.VITE_API_URL + "/api/users?populate=*"
    );

    setUsers(response.data);
  };

  return (
    <div className="container">
      <div className="row my-5 g-4">
        {users.map((user) => (
          <div className="col-sm-6 col-md-4 col-lg-3" key={user.id}>
            <LineupCard user={user}/>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Lineups;
