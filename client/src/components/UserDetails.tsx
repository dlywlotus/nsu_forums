import styles from "../styles/UserDetails.module.css";
import ProfileIcon from "../components/ProfileIcon";
import UsernameEditor from "./UsernameEditor";
type props = {};

export default function UserDetails({}: props) {
  return (
    <section className={styles.user_details}>
      <ProfileIcon />
      <UsernameEditor />
    </section>
  );
}
