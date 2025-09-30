import { useState } from "react";
import { useClerk, useUser, } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

import { useUserData } from "../../contexts/UserDataContext.jsx";
import { useModal } from "../../contexts/ModalContext.jsx";

import Spinner from "../__reuseables/Spinner.jsx";

import styles from "./_UserLoginSignup.module.css"
function UserLoginSignup() {  
  
  const {openModal} = useModal();
  const { user, isLoaded, isSignedIn } = useUser();
  useUserData

  // USING FAST USER DATA FROM CLERK
  const { userData } = useUserData();

  const { signOut } = useClerk();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!isLoaded) {
    return <div className={styles.spinner}><Spinner/></div>;
  }

  
  return isSignedIn ? (
    <div className={styles.profileDiv}>
      
      <div className={styles.userDataDiv}>
      
      { userData ? <div className={styles.userPoints}>{userData.points} 12312312 POINTS</div> : null}
      
      <Link to="/profile" className={styles.username}>{user.username.toUpperCase()}</Link>
      </div>

      <div style={{ position: "relative" }}>
        <img
          src={user.imageUrl}
          alt="User Avatar"
          className={styles.avatar}
          onClick={() => setMenuOpen(!menuOpen)}
        />
        {menuOpen && (
          <div className={styles.menuOverlay} onClick={() => setMenuOpen(!menuOpen)}>
              <div className={styles.menu} >
              <Link to="/profile" className={styles.menuButton}>
              VIEW PROFILE
              </Link>
              <button onClick={() => signOut()} className={styles.menuButton}>
                SIGN OUT
              </button>
            </div>
          </div>
        )}
      </div>
    
    </div>
  ) : (
    <button
      className={styles.loginButton}
      onClick={() => openModal("LoginSignupModal_Vis")}
    >
      Sign Up / Log In
    </button>
  )
}

export default UserLoginSignup