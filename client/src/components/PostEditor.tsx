import styles from "../styles/PostEditor.module.css";
import { post } from "./PostList";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";
import getSession from "../util/getSession";
import axios from "axios";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

type props = {
  postContent: post;
};

//Zod schema
const formSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(100, "Max characters: 100"),
  body: z
    .string()
    .min(15, "Body must be at least 15 characters long")
    .max(1000, "Max characters: 1000"),
});

// Infer form schema type
type FormData = z.infer<typeof formSchema>;

export default function PostEditor({ postContent }: props) {
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const onSubmit = async (formData: FormData): Promise<any> => {
    try {
      const { token } = await getSession();
      await axios.put(
        `${import.meta.env.VITE_SERVER_API_URL}/auth_req/edit_post/${
          postContent.ID
        }`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      queryClient.invalidateQueries({ queryKey: ["post"] });
      goToPost();
    } catch (error) {
      console.log(error);
      goToPost();
      //show alert
    }
  };

  const goToPost = () => {
    navigate(`/post/${postContent.ID}`);
  };

  //populate react hook form on mount
  useEffect(() => {
    reset({
      title: postContent.Title,
      body: postContent.Body,
    });
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <TextareaAutosize
        className={styles.title_input}
        id='title'
        minRows={1}
        {...register("title")}
      />
      {errors.title && <p className={styles.err}>{errors.title.message}</p>}
      <TextareaAutosize
        className={styles.body_input}
        id='body'
        minRows={5}
        {...register("body")}
      />
      {errors.body && <p className={styles.err}>{errors.body.message}</p>}
      <div className={styles.bottom_row}>
        <button type='button' onClick={goToPost}>
          Cancel
        </button>
        <button type='submit' disabled={isSubmitting}>
          Save
        </button>
      </div>
    </form>
  );
}
