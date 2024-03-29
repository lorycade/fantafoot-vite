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
