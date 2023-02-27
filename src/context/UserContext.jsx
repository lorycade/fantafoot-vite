import { createContext, useEffect, useState } from "react";
import axios from "axios";
export const UserContext = createContext(null);

export default ({ children }) => {
  const jwt = localStorage.getItem('jwt')
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!!jwt) {
      getMyData()
    }
  }, [])

  const getMyData = async () => {
    const response = await axios.get(
      "http://localhost:1337/api/users/me?populate=*",
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    console.log('context', response);
    
    setUser(response.data)
    // setMyPlayers(response.data.players);
  };
  
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
