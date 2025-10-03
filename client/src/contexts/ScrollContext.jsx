import { createContext, useContext } from "react";
import useScrollDirection from "../hooks/useScrollDirection";

export const ScrollContext = createContext("up");

export const ScrollContextProvider = ({ children }) => {

  const scrollDirection = useScrollDirection();
  return (
    <ScrollContext.Provider value={scrollDirection}>
      {children}
    </ScrollContext.Provider>
  );
}

export const useScrollContext = () => useContext(ScrollContext);