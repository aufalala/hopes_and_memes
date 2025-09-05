import { motion, AnimatePresence } from "framer-motion";
import { useModal } from "../../contexts/ModalContext";
import "./Modal.css";

function LoginModal() {
  const { modals, closeModal } = useModal();
  const isOpen = modals.LoginModal;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="modal-content"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2>Login</h2>
            <button onClick={() => closeModal("LoginModal")}>Close</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default LoginModal;
