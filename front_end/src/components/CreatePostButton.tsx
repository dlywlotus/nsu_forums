import { useNavigate } from "react-router-dom";
import styles from "../styles/createPostButton.module.css";
import { useMediaQuery } from "react-responsive";
import { useUser } from "../Hooks/useUser";

type props = {};

export default function CreatePostButton({}: props) {
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ query: "(max-width: 765px)" });
  const { isLoggedIn } = useUser();

  const onClick = () => navigate(isLoggedIn ? "/create" : "/auth");

  return (
    <button className={styles.btn_create} onClick={onClick}>
      <i className='fa-solid fa-plus'></i>
      {!isMobile && <span>Post</span>}
    </button>
  );
}
