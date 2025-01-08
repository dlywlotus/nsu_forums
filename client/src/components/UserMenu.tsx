import { useRef, useEffect } from "react";
import styles from "../styles/UserMenu.module.css";
import supabase from "../supabase";
import { useQueryClient } from "@tanstack/react-query";
import DarkModeButton from "./DarkModeButton";
import { useNavigate } from "react-router-dom";

type props = {
  buttonRef: React.MutableRefObject<any>;
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function UserMenu({
  buttonRef,
  isMenuOpen,
  setIsMenuOpen,
}: props) {
  const queryClient = useQueryClient();
  const modalRef = useRef<any>();
  const navigate = useNavigate();

  const onLogout = async () => {
    navigate("/");
    await supabase.auth.signOut();
    queryClient.clear();
  };

  const viewProfile = () => {
    navigate("/profile");
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      // Close modal if clicked outside both modal and button
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <>
      <div className={styles.modal} ref={modalRef} data-open={isMenuOpen}>
        <div className={styles.dark_mode}>
          <div>Theme </div>
          <DarkModeButton />
        </div>
        <div onClick={viewProfile}>View Profile</div>
        <div onClick={onLogout}>Logout</div>
      </div>
    </>
  );
}
