import { createContext, useEffect, useState } from "react";

export const UserContext = createContext(null);

export default ({ children }) => {
  const userStored = localStorage.getItem('user')
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!!userStored) {
      setUser(userStored)
    }
  }, [])
  
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
