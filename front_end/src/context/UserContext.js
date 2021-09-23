import { useState, useContext, createContext } from "react";
import checkUserLoggedIn from "../utils/AuthChecker";

const UserLoggedInContext = createContext();

export const UserLoggedInProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // call checkUserLoggedIn?
  checkUserLoggedIn()
    .then((loggedIn) => {
      if (loggedIn) setIsLoggedIn(true);
      else setIsLoggedIn(false);
    })
    .catch(console.error);

  return <UserLoggedInContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>{children}</UserLoggedInContext.Provider>;
};

export const useUserLoggedIn = () => useContext(UserLoggedInContext);
