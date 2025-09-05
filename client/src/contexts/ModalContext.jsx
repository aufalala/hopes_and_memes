import { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modals, setModals] = useState({
    LoginModal: false,
    SignupModal: false,
  });

  const openModal = (modalName) => {
    setModals((prevModals) => ({ ...prevModals, [modalName]: true }));
  };

  const closeModal = (modalName) => {
    setModals((prevModals) => ({ ...prevModals, [modalName]: false }));
  };

  return (
    <ModalContext.Provider value={{ modals, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);