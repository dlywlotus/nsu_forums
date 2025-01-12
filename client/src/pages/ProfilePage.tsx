import UserDetails from "../components/UserDetails";
import styles from "../styles/ProfilePage.module.css";
import PostDashboard from "../components/PostDashboard";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <header>
        <button className={styles.btn_back} onClick={() => navigate(-1)}>
          <i className='fa-solid fa-arrow-left-long'></i>
        </button>
        <h1>Profile</h1>
      </header>

      <UserDetails />
      <div className={styles.user_posts}>
        <h2>Your posts</h2>
        <PostDashboard selfPosted={true} />
      </div>
    </div>
  );
}
