
import { useUser, UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

import { useModal } from "../../contexts/ModalContext.jsx";
import styles from "./_UserLoginSignup.module.css"
function UserLoginSignup() {  
  
  const {openModal} = useModal();
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
  return <div className={styles.spinner}></div>;
  // return (
  //   <button
  //     className={styles.button}
  //     onClick={() => openModal("LoginSignupModal_Vis")}
  //   >
  //     Login
  //   </button>
  // )
  }
  
  return isSignedIn ? (
    <div className={styles.profileDiv}>
      <Link to="/profile">{user.username}</Link>
      {/* <img
        src={user.imageUrl}
        alt="User profile"
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          objectFit: "cover",
        }}
      /> */}
      <UserButton userProfileMode="modal"/>
    </div>
  ) : (
    <button
      className={styles.button}
      onClick={() => openModal("LoginSignupModal_Vis")}
    >
      Login
    </button>
  )
}

export default UserLoginSignup