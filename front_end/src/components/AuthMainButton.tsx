import styles from "../styles/AuthMainButton.module.css";

type props = {
  isLogin: boolean;
  isLoading: boolean;
  onLogin: () => Promise<void>;
  onSignUp: () => Promise<void>;
};

export default function AuthMainButton({
  isLogin,
  isLoading,
  onLogin,
  onSignUp,
}: props) {
  return (
    <button
      className={styles.btn_authenticate}
      onClick={isLogin ? onLogin : onSignUp}
      disabled={isLoading}
    >
      {isLogin ? "Log in" : "Sign up"}
    </button>
  );
}
