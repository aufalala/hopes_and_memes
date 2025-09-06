import { useState } from "react";
import { useSignIn } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";
import { useModal } from "../../contexts/ModalContext";
import styles from "./_LoginSignupModal.module.css";

function LoginSignupModal() {
  const { modals, closeModal } = useModal();
  const isOpen = modals.LoginSignupModal_Vis;

  const { signIn, setActive, isLoaded } = useSignIn();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.create({
        identifier: username,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        closeModal("LoginSignupModal_Vis");
      } else {
        console.log("Further steps required", signInAttempt);
      }
    } catch (err) {
      setError(err.errors?.[0]?.longMessage || "Login failed");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.modalOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          onClick={() => closeModal("LoginSignupModal_Vis")}
        >
          <motion.div
            className={styles.modalContent}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 1 }}
            onClick={(event) => event.stopPropagation()} 
          >
            {/* ----------------------------------------------------------------------- */}
            <button className={styles.closeButton} onClick={() => closeModal("LoginSignupModal_Vis")}>×</button>
            <h3>CLOCK IN</h3>

            <form  onSubmit={handleSubmit}>
              <div className={styles.form}>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  required
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                />
                <button type="submitButton">Log In</button>
                {error && <p className={styles.error}>{error}</p>}
              </div>
            </form>
            {/* ----------------------------------------------------------------------- */}

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default LoginSignupModal;
