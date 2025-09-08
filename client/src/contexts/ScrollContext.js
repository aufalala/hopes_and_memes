import { createContext, useContext } from "react";

export const ScrollContext = createContext("up");

export const useScrollContext = () => {
  return useContext(ScrollContext);
};