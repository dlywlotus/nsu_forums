import styles from "../styles/UserButton.module.css";
import { useUser } from "../Hooks/useUser";
import { useNavigate } from "react-router-dom";
import supabase, { getToken } from "../supabase";

type props = {};

export default function UserButton({}: props) {
  const navigate = useNavigate();
  const { isLoggedIn } = useUser();

  //TODO
  const openProfile = async () => {
    const jwtToken = await getToken();
    console.log(jwtToken);
  };

  const onSignout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const goToAuth = () => {
    navigate("/auth");
  };

  if (isLoggedIn) {
    return (
      <>
        <button className={styles.btn_logout} onClick={onSignout}>
          logout
        </button>
        <button className={styles.btn_icon} onClick={openProfile}>
          <i className='fa-solid fa-user'></i>
        </button>
      </>
    );
  } else {
    return (
      <button className={styles.btn_icon} onClick={goToAuth}>
        Login
      </button>
    );
  }
}
