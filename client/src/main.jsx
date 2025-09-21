import React, { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import { HashRouter } from "react-router-dom";

import { ClerkProvider } from "@clerk/clerk-react";

import { ModalProvider } from "./contexts/ModalContext.jsx";
import { ScrollContextProvider } from "./contexts/ScrollContext.jsx";
import { UserDataProvider } from "./contexts/UserDataContext.jsx";

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
        <ModalProvider>
          <ScrollContextProvider>
        
                  <App />
            
          </ScrollContextProvider>
        </ModalProvider>
        
            </UserDataProvider>
      </ClerkProvider>
  
    </HashRouter>
  </StrictMode>
)
