import styles from "../styles/AuthModal.module.css";
import supabase from "../supabase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthInputField from "./AuthInputField";
import AuthCallToAction from "./AuthCallToAction";
import AuthHeader from "./AuthHeader";
import AuthError from "./AuthError";
import AuthMainButton from "./AuthMainButton";

type props = {};

export default function AuthModal({}: props) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowError, setIsShowError] = useState(false);
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });

  const flashErrorMessage = () => {
    setIsShowError(true);
    setTimeout(() => setIsShowError(false), 1500);
  };

  const createUser = async (userData: { id: string; username: string }) => {
    const res = await fetch(`${import.meta.env.VITE_SERVER_API_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    if (!res.ok) {
      console.log(res);
      throw new Error("Error creating user");
    }
  };

  const onLogin = async () => {
    console.log("logging in...........");
    setIsLoading(true);
    let { error } = await supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });
    if (error) {
      flashErrorMessage();
      setIsLoading(false);
      return console.log(error.message);
    }

    navigate("/");
  };

  const onSignUp = async () => {
    try {
      setIsLoading(true);
      let { data, error } = await supabase.auth.signUp({
        email: input.email,
        password: input.password,
      });

      if (error) throw new Error(error.message);

      await createUser({
        id: data.user?.id || "",
        username: input.username,
      });
      navigate("/");
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      flashErrorMessage();
    }
  };

  return (
    <>
      <div className={styles.container}>
        <AuthHeader />
        <AuthError isShowError={isShowError} />
        {!isLogin && (
          <AuthInputField
            label='Username'
            inputType='username'
            input={input}
            setInput={setInput}
          />
        )}
        <AuthInputField
          label='Email'
          inputType='email'
          input={input}
          setInput={setInput}
        />
        <AuthInputField
          label='Password'
          inputType='password'
          input={input}
          setInput={setInput}
        />
        <AuthMainButton
          isLogin={isLogin}
          isLoading={isLoading}
          onSignUp={onSignUp}
          onLogin={onLogin}
        />
        <AuthCallToAction
          isLogin={isLogin}
          setIsLogin={setIsLogin}
          setInput={setInput}
        />
      </div>
    </>
  );
}
