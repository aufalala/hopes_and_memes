import React, { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import { HashRouter } from "react-router-dom";

import { ClerkProvider } from "@clerk/clerk-react";

import { UserDataProvider } from "./contexts/UserDataContext.jsx";
import { UserRatingsProvider } from "./contexts/UserRatingsContext.jsx";
import { ModalProvider } from "./contexts/ModalContext.jsx";
import { ScrollContextProvider } from "./contexts/ScrollContext.jsx";

import App from "./App.jsx"

import "./index.css"

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key!")
}

createRoot(document.getElementById("root")).render(
  
  <StrictMode>
    <HashRouter>
        
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <UserDataProvider>
          <UserRatingsProvider>
            <ModalProvider>
              <ScrollContextProvider>
            
                <App />
                
              </ScrollContextProvider>
            </ModalProvider>
          </UserRatingsProvider>
        </UserDataProvider>
      </ClerkProvider>
  
    </HashRouter>
  </StrictMode>
)
