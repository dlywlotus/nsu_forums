import { useState } from "react";
import styles from "../styles/UsernameEditor.module.css";
import { z } from "zod";
import { useForm } from "react-hook-form";
import supabase from "../supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "../Hooks/useUser";

type props = {};

//Zod schema
const formSchema = z.object({
  username: z
    .string()
    .min(3, "Min length: 3 chars")
    .max(15, "Max length: 15 chars"),
});

// Infer form schema type
type FormData = z.infer<typeof formSchema>;

export default function UsernameEditor({}: props) {
  const { userId } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (formData: FormData): Promise<any> => {
    try {
      //get and refresh jwt token and userId
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const userId = session?.user.id;
      const token = session?.access_token;

      await axios.put(
        `${import.meta.env.VITE_SERVER_API_URL}/auth_req/change_username`,
        {
          userId,
          username: formData.username,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await refetch();
      setIsEditing(false);
    } catch (error) {
      setError("root", {
        type: "username",
        message: "Error changing username",
      });
      setIsEditing(false);
    }
  };

  const onStartEditing = () => {
    setIsEditing(true);
    //fill input field with fetched name
    reset({
      username: fetchedUsername,
    });
  };

  const fetchUsername = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_SERVER_API_URL}/user/${userId}`
      );
      return data.user.Username;
    } catch (error) {
      console.error(error);
    }
  };

  const { data: fetchedUsername, refetch } = useQuery({
    queryKey: ["username"],
    queryFn: fetchUsername,
    enabled: userId !== null,
  });

  return (
    <>
      {isEditing ? (
        <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
          <input type='text' {...register("username")} autoFocus />
          <button className={styles.btn_save}>
            <i className='fa-solid fa-check'></i>
          </button>
          {errors.username && (
            <p className={styles.err}>{errors.username.message}</p>
          )}
        </form>
      ) : (
        <div className={styles.container}>
          <div className={styles.name}>{fetchedUsername}</div>
          <button className={styles.btn_edit} onClick={onStartEditing}>
            <i className='fa-solid fa-pen'></i>
          </button>
        </div>
      )}

      {isSubmitting && <LoadingSpinner isLoading={isSubmitting} />}
    </>
  );
}
