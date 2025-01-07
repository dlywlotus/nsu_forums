import styles from "../styles/CreatePostPage.module.css";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import supabase from "../supabase";
import { useNavigate } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";

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
  category: z.enum(["romance", "studies", "campus", "others"]),
});

// Infer form schema type
type FormData = z.infer<typeof formSchema>;

export default function CreatePostPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (formData: FormData): Promise<any> => {
    try {
      //get and refresh jwt token and userId
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const userId = session?.user.id;
      const jwtToken = session?.access_token;

      //create post
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_API_URL}/auth_req/create_post`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({
            ...formData,
            authorID: userId,
          }),
        }
      );

      if (!res.ok) throw new Error();

      navigate("/");
    } catch (error) {
      setError("root", { type: "server", message: "Failed to create post" });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>Create a post</div>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <label htmlFor='title'>Title</label>
        <TextareaAutosize
          className={styles.title_input}
          id='title'
          minRows={1}
          {...register("title")}
        />
        {errors.title && <p className={styles.err}>{errors.title.message}</p>}

        <label htmlFor='body'>Body</label>
        <TextareaAutosize
          className={styles.body_input}
          id='body'
          minRows={5}
          {...register("body")}
        />
        {errors.body && <p className={styles.err}>{errors.body.message}</p>}

        <label htmlFor='category'>Category</label>
        <select id='category' {...register("category")}>
          <option value=''>Select a category</option>
          <option value='romance'>romance</option>
          <option value='studies'>studies</option>
          <option value='campus'>campus</option>
          <option value='others'>others</option>
        </select>
        {errors.category && <p className={styles.err}>Invalid option</p>}

        <div className={styles.bottom_row}>
          <button type='submit' disabled={isSubmitting}>
            {isSubmitting ? "Posting" : "Create"}
          </button>
          {errors.root && <p className={styles.err}>{errors.root.message}</p>}
        </div>
      </form>
    </div>
  );
}
