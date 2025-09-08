import { createContext, useContext, useState, useEffect } from "react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modals, setModals] = useState({
    LoginSignupModal_Vis: false,
  });

  const openModal = (modalName) => {
    setModals((prevModals) => ({ ...prevModals, [modalName]: true }));
  };

  const closeModal = (modalName) => {
    setModals((prevModals) => ({ ...prevModals, [modalName]: false }));
  };

  useEffect(() => {
    const isAnyModalOpen = Object.values(modals).some((isOpen) => isOpen);

    document.documentElement.style.overflow = isAnyModalOpen ? "hidden" : "auto";

    // Optional cleanup in case component unmounts
    return () => {
      document.documentElement.style.overflow = "auto";
    };
  }, [modals]);

  return (
    <ModalContext.Provider value={{ modals, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);