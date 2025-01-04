import styles from "../styles/UserButton.module.css";
import { useUser } from "../Hooks/useUser";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import UserMenu from "./UserMenu";

type props = {};

export default function UserButton({}: props) {
  const navigate = useNavigate();
  const { isLoggedIn } = useUser();
  const buttonRef = useRef<any>();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  //TODO
  const openMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const goToAuth = () => {
    navigate("/auth");
  };

  return (
    <>
      {isLoggedIn ? (
        <>
          <button
            className={styles.btn_icon}
            onMouseDown={openMenu}
            ref={buttonRef}
          >
            <i className='fa-solid fa-user'></i>
          </button>
          <UserMenu
            buttonRef={buttonRef}
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
          />
        </>
      ) : (
        <button className={styles.btn_icon} onClick={goToAuth} ref={buttonRef}>
          <i className='fa-solid fa-right-to-bracket'></i>
        </button>
      )}
    </>
  );
}
