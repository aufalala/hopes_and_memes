// import { useState } from "react";
// import { useSignIn } from "@clerk/clerk-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useModal } from "../../contexts/ModalContext";
// import styles from "./_LoginSignupModal.module.css";

// function LoginSignupModal() {
//   const { modals, closeModal } = useModal();
//   const isOpen = modals.LoginSignupModal_Vis;

//   const { signIn, setActive, isLoaded } = useSignIn();
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setError("");

//     if (!isLoaded) return;

//     try {
//       const signInAttempt = await signIn.create({
//         identifier: username,
//         password,
//       });

//       if (signInAttempt.status === "complete") {
//         await setActive({ session: signInAttempt.createdSessionId });
//         closeModal("LoginSignupModal_Vis");
//       } else {
//         console.log("Further steps required", signInAttempt);
//       }
//     } catch (err) {
//       setError(err.errors?.[0]?.longMessage || "Login failed");
//     }
//   };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           className={styles.modalOverlay}
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           transition={{ duration: 0.3 }}
//           onClick={() => closeModal("LoginSignupModal_Vis")}
//         >
//           <motion.div
//             className={styles.modalContent}
//             initial={{ scale: 0.95, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             exit={{ scale: 0.95, opacity: 0 }}
//             transition={{ duration: 0.3 }}
//             onClick={(event) => event.stopPropagation()} 
//           >
//             {/* ----------------------------------------------------------------------- */}
//             <button className={styles.closeButton} onClick={() => closeModal("LoginSignupModal_Vis")}>×</button>
//             <h3>CLOCK IN</h3>

//             <form  onSubmit={handleSubmit}>
//               <div className={styles.form}>
//                 <input
//                   type="text"
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                   placeholder="Username"
//                   required
//                 />
//                 <input
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="Password"
//                   required
//                 />
//                 <button type="submitButton">Log In</button>
//                 {error && <p className={styles.error}>{error}</p>}
//               </div>
//             </form>
//             {/* ----------------------------------------------------------------------- */}

//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// }

// export default LoginSignupModal;


import { useEffect, useState } from "react";
import { useSignIn, useSignUp } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";

import { useModal } from "../../contexts/ModalContext";
import Spinner from "../__reuseables/Spinner";

import styles from "./_LoginSignupModal.module.css";

function LoginSignupModal() {
  const { modals, closeModal } = useModal();
  const isOpen = modals.LoginSignupModal_Vis;

  const { signIn, setActive, isLoaded: signInLoaded } = useSignIn();
  const { signUp, isLoaded: signUpLoaded } = useSignUp();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // steps for "username" | "login" | "signup" in modal
  const [step, setStep] = useState("username");
  // disable submits and set spinner
  const [loading, setLoading] = useState(false);


  useEffect((e) => {
    handleResetAndBack();
  }, [isOpen]);

  const handleResetAndBack = async (e) => {
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
    } catch (err) {
      // If error is "identifier not found", treat as signup
      const msg = err.errors?.[0]?.code;
      if (msg === "form_identifier_not_found") {
        setStep("signup");
      } else {
        setError(err.errors?.[0]?.longMessage || "Something went wrong");
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
    } catch (err) {
      setError(err.errors?.[0]?.longMessage || "Login failed");
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
    } catch (err) {
      setError(err.errors?.[0]?.longMessage || "Signup failed");
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
            <button className={styles.closeButton} onClick={() => closeModal("LoginSignupModal_Vis")}>×</button>

            {/* --------------------------------- Username Step */}
            {step === "username" && (
              <>
              <h3>IDENTIFY YOURSELF!</h3>
              <form onSubmit={handleUsernameSubmit}>
                <div className={styles.form}>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                  />
                  {loading ? <div className={styles.spinner}><Spinner /></div> : 
                  <button type="submit" className={styles.submitButton} disabled={loading}>
                  CONTINUE
                  </button>}

                  {error && (
                    <div className={styles.error}>
                      {error.split('\n').map((line, idx) => (
                        <p key={idx}>{line}</p>
                      ))}
                    </div>
                  )}

                </div>
              </form>
              </>
            )}

            {/* --------------------------------- Login Step */}
            {step === "login" && (
              <>
              <h3>WELCOME BACK {username.toUpperCase()}</h3>
              
              <form onSubmit={handleLoginSubmit}>
                <div className={styles.form}>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                  />
                  {loading ? <div className={styles.spinner}><Spinner /></div> : 
                  <button type="submit" className={styles.submitButton} disabled={loading}>
                  LOG IN
                  </button>}
                  
                  {error && (
                    <div className={styles.error}>
                      {error.split('\n').map((line, idx) => (
                        <p key={idx}>{line}</p>
                      ))}
                    </div>
                  )}

                </div>
              </form>
              
              <h4 onClick={handleResetAndBack} className={styles.backTextButton}>
                &lt;&lt;&lt; Back
              </h4>
              </>
            )}

            {/* --------------------------------- Signup Step */}
            {step === "signup" && (
              <>
              <h3>CREATING A NEW ACCOUNT</h3>
              <h3>{username.toUpperCase()}</h3>
              <form onSubmit={handleSignupSubmit}>
                <div className={styles.form}>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create Password"
                    required
                  />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    required
                  />
                  {loading ? <div className={styles.spinner}><Spinner /></div> : 
                  <button type="submit" className={styles.submitButton} disabled={loading}>
                  CREATE ACCOUNT
                  </button>}

                  {error && (
                    <div className={styles.error}>
                      {error.split('\n').map((line, idx) => (
                        <p key={idx}>{line}</p>
                      ))}
                    </div>
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
