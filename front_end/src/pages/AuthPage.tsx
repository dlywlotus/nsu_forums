import AuthModal from "../components/AuthModal";
import styles from "../styles/AuthPage.module.css";

type props = {};

export default function AuthPage({}: props) {
  return (
    <div className={styles.backdrop}>
      <AuthModal />
    </div>
  );
}
