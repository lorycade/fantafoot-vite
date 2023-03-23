import { createContext, useEffect, useState } from "react";
import axios from "axios";
export const UserContext = createContext(null);

export default ({ children }) => {
  const jwt = localStorage.getItem('jwt')
  // const jwtWxpiration = localStorage.getItem('jwt-expiration')
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!!jwt) {
      // checkExpiration()
      getMyData()
    }
  }, [])

  // const checkExpiration = () => {
  //   const now = new Date();
  //   const initialLogin = new Date(jwtWxpiration)

  //   const minutes = (((now - initialLogin)/1000)/60)
  //   console.log(minutes);

  //   if (minutes > 2) {
  //     setUser(null)
  //     localStorage.clear()
  //   }
  // }

  const getMyData = async () => {
    const response = await axios.get(
      import.meta.env.VITE_API_URL + "/api/users/me?populate=*",
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    
    setUser(response.data)
  };
  
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
