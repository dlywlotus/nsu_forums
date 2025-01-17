import styles from "../styles/AuthModal.module.css";
import supabase from "../supabase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthCallToAction from "./AuthCallToAction";
import AuthHeader from "./AuthHeader";
import AuthError from "./AuthError";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import PulseLoader from "react-spinners/PulseLoader";

// Infer form schema type
type FormData = {
  username: string;
  email: string;
  password: string;
};

export default function AuthModal() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isShowError, setIsShowError] = useState(false);

  const formSchema = z.object({
    username: isLogin
      ? z.string().optional()
      : z
          .string()
          .min(3, "Min length: 3 characters")
          .max(15, "Max length: 15 characters"),
    email: z.string().email("Invalid email format"),
    password: z
      .string()
      .min(6, "Min length: 6 characters")
      .max(30, "Max length: 30 characters"),
  });

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const flashErrorMessage = () => {
    setIsShowError(true);
    setTimeout(() => setIsShowError(false), 2000);
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
      throw new Error("Error creating user");
    }
  };

  const onLogin = async (formData: FormData) => {
    let { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });
    if (error) throw new Error(error.message);
  };

  const onSignUp = async (formData: FormData) => {
    let { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });
    if (error) throw new Error(error.message);
    await createUser({
      id: data.user?.id || "",
      username: formData.username,
    });
  };

  const onSubmit = async (formData: FormData) => {
    try {
      isLogin ? await onLogin(formData) : await onSignUp(formData);
      navigate("/");
    } catch (error) {
      console.log(error);
      flashErrorMessage();
    }
  };
  return (
    <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
      <AuthHeader />
      <AuthError isShowError={isShowError} />
      {!isLogin && (
        <>
          <div className={styles.label}>Username</div>
          <input {...register("username")} />
          {errors.username && (
            <p className={styles.err}>{errors.username.message}</p>
          )}
        </>
      )}
      <div className={styles.label}>Email</div>
      <input type='email ' {...register("email")} />
      {errors.email && <p className={styles.err}>{errors.email.message}</p>}
      <div className={styles.label}>Password</div>
      <input type='password' {...register("password")} />
      {errors.password && (
        <p className={styles.err}>{errors.password.message}</p>
      )}
      <button
        type='submit'
        className={styles.btn_authenticate}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <PulseLoader
            loading={isSubmitting}
            size={8}
            color='var(--clr-body)'
            cssOverride={{ marginTop: ".1rem" }}
            speedMultiplier={1}
          />
        ) : isLogin ? (
          "Log in"
        ) : (
          "Sign up"
        )}
      </button>
      <AuthCallToAction
        isLogin={isLogin}
        setIsLogin={setIsLogin}
        reset={reset}
      />
    </form>
  );
}
