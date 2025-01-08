import UserDetails from "../components/UserDetails";
import styles from "../styles/ProfilePage.module.css";
import PostDashboard from "../components/PostDashboard";

export default function ProfilePage() {
  return (
    <div className={styles.container}>
      <h1>Profile</h1>
      <UserDetails />
      <div className={styles.user_posts}>
        <h2>Your posts</h2>
        <PostDashboard selfPosted={true} />
      </div>
    </div>
  );
}
