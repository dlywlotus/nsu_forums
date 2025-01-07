import UserDetails from "../components/UserDetails";
import styles from "../styles/ProfilePage.module.css";
import PostDashboard from "./PostDashboardPage";

export default function ProfilePage() {
  //1. make a backend end point that fetches:
  //1.1 displayed name
  //1.2 posts made by user

  return (
    <div className={styles.container}>
      <UserDetails />
      <div className={styles.user_posts}>
        <div className={styles.header}>Your posts</div>
        <PostDashboard />
      </div>
    </div>
  );
}
