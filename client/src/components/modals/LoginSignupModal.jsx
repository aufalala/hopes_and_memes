import { useEffect, useState } from "react";
import { useSignIn, useSignUp } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";

import { useClerkAuthFetch } from "../../hooks/useClerkAuthFetch";

import { useModal } from "../../contexts/ModalContext";
import Spinner from "../__reuseables/Spinner";

import styles from "./_LoginSignupModal.module.css";

function LoginSignupModal() {
  const { modals, closeModal } = useModal();
  const isOpen = modals.LoginSignupModal_Vis;

  const { signIn, setActive, isLoaded: signInLoaded } = useSignIn();
  const { signUp, isLoaded: signUpLoaded } = useSignUp();

  // flag for steps for "username" | "login" | "signup" in modal
  const [step, setStep] = useState("username");

  // flag disable submits and set spinner
  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    handleResetAndBack();
  }, [isOpen]);

  const handleResetAndBack = async () => {
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setError("");
    setStep("username");
    setLoading(false);
  }

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!signInLoaded) return;

    if (username.length < 4 || !/[a-zA-Z]/.test(username)) {
      setError(
        `Username must:\n- Be at least 4 characters long\n- Contain at least one letter`
      );
      setLoading(false);
      return;
    }

    try {
      // Check if username exists (attempt sign-in without password)
      const result = await signIn.create({ identifier: username });

      if (result.firstFactorVerification) {
        // Username exists — go to login step
        setStep("login");
      } else {
        throw new Error("Unexpected response from Clerk");
      }
    } catch (e) {
      // If error is "identifier not found", treat as signup
      const msg = e.errors?.[0]?.code;
      if (msg === "form_identifier_not_found") {
        setStep("signup");
      } else {
        setError(e.errors?.[0]?.longMessage || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn.create({
        identifier: username,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        closeModal("LoginSignupModal_Vis");
      } else {
        setError("Unexpected step during login");
      }
    } catch (e) {
      setError(e.errors?.[0]?.longMessage || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false)
      return;
    }

    if (password.length <8) {
      setError("Password must be:\n- 8 characters or more");
      setLoading(false)
      return;
    }

    if (!signUpLoaded) return;

    try {
      const result = await signUp.create({
        username,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        closeModal("LoginSignupModal_Vis");
      } else {
        setError("Unexpected step during signup");
      }
    } catch (e) {
      setError(e.errors?.[0]?.longMessage || "Signup failed");
    } finally {
      setLoading(false);
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
          transition={{ duration: 0.3 }}
          onClick={() => closeModal("LoginSignupModal_Vis")}
        >
          <motion.div
            className={styles.modalContent}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.closeButton} onClick={() => closeModal("LoginSignupModal_Vis")}>
              ×
            </button>

            {/* --------------------------------- Username Step */}
            {step === "username" && (
              <>
                <br></br>
                <h3>IDENTIFY YOURSELF!</h3>

                <form onSubmit={handleUsernameSubmit}>
                  <div className={styles.form}>

                    {loading ? (
                      <div className={styles.spinner}>
                        <Spinner />
                      </div>
                    ) : (
                      <>
                        <input
                          className={styles.input}
                          type="text"
                          value={username}
                          onChange={(e) => {
                            setUsername(e.target.value)
                            setError("");
                          }}
                          placeholder="Username"
                          required
                        />

                        <AnimatePresence mode="wait">
                          {(error || !username) ? (
                            <div className={styles.error}>
                              {error.split("\n").map((line, index) => (
                                <p key={index}>{line}</p>
                              ))}
                            </div>

                          ) : (
                            <motion.div
                              key="continue-button"
                              initial={{ opacity: 0, translateY: -20 }}
                              animate={{ opacity: 1, translateY: 0 }}
                              exit={{ opacity: 0, translateY: -20 }}
                              transition={{ duration: 0.1 }}
                            >
                              <button
                                type="submit"
                                className={styles.submitButton}
                                disabled={loading}
                              >
                                CONTINUE
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>

                      </>
                    )}

                  </div>
                </form>
              </>
            )}

            {/* --------------------------------- Login Step */}
            {step === "login" && (
              <>
                <h3>WELCOME BACK</h3>
                <h3>{username.toUpperCase()}</h3>

                <form onSubmit={handleLoginSubmit}>
                  <div className={styles.form}>

                    {loading ? (
                      <div className={styles.spinner}>
                        <Spinner />
                      </div>
                    ) : (
                      <>
                        <input
                          className={styles.input}
                          type="password"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            setError("");
                          }}
                          placeholder="Password"
                          required
                        />

                        <AnimatePresence>
                          {(error || !password) ? (
                            <div className={styles.error}>
                              {error.split("\n").map((line, index) => (
                                <p key={index}>{line}</p>
                              ))}
                            </div>

                          ) : (
                            <motion.div
                              key="signin-button"
                              initial={{ opacity: 0, translateY: -20 }}
                              animate={{ opacity: 1, translateY: 0 }}
                              exit={{ opacity: 0, translateY: -20 }}
                              transition={{ duration: 0.1 }}
                            >
                              <button 
                                type="submit"
                                className={styles.submitButton}
                                disabled={loading}
                                >
                                LOG IN
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>

                      </>
                    )}

                  </div>
                </form>

                <h4 onClick={handleResetAndBack} className={styles.backTextButton}>
                  &lt; Back
                </h4>
                
              </>
            )}

            {/* --------------------------------- Signup Step */}
            {step === "signup" && (
              <>
                <h3>HI {username.toUpperCase()}</h3>
                <h3>CREATE A PASSWORD</h3>

                <form onSubmit={handleSignupSubmit}>
                  <div className={styles.form}>
                    
                    {loading ? (
                      <div className={styles.spinner}>
                        <Spinner />
                      </div>
                    ) : (
                      <>
                        <input
                          className={styles.input}
                          type="password"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            setError("");
                          }}
                          placeholder="Create Password"
                          required
                        />

                        <input
                          className={styles.input}
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setError("");
                          }}
                          placeholder="Confirm Password"
                          required
                        />

                        <AnimatePresence>
                          {(error || !confirmPassword) ? (
                            <div className={styles.error}>
                              {error.split("\n").map((line, index) => (
                                <p key={index}>{line}</p>
                              ))}
                            </div>

                          ) : (
                            <motion.div
                              key="create-button"
                              initial={{ opacity: 0, translateY: -20 }}
                              animate={{ opacity: 1, translateY: 0 }}
                              exit={{ opacity: 0, translateY: -20 }}
                              transition={{ duration: 0.1 }}
                            >
                              <button
                                type="submit"
                                className={styles.submitButton}
                                disabled={loading}
                              >
                                CREATE ACCOUNT
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>

                      </>
                    )}

                  </div>
                </form>

                <h4 onClick={handleResetAndBack} className={styles.backTextButton}>
                  &lt;&lt;&lt; Back
                </h4>

              </>
            )}

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default LoginSignupModal;
