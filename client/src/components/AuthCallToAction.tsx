import styles from "../styles/AuthCallToAction.module.css";

type props = {
  isLogin: boolean;
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
  setInput: React.Dispatch<
    React.SetStateAction<{
      username: string;
      email: string;
      password: string;
    }>
  >;
};

export default function AuthCallToAction({
  isLogin,
  setIsLogin,
  setInput,
}: props) {
  const onClick = () => {
    setIsLogin(!isLogin);
    setInput({ username: "", email: "", password: "" });
  };

  const message = isLogin
    ? "Don't have an account ? "
    : "Already have an account ? ";

  return (
    <div className={styles.small_text}>
      {message}
      <span className={styles.link} onClick={onClick}>
        {isLogin ? "Sign up" : "Login"}
      </span>
    </div>
  );
}
