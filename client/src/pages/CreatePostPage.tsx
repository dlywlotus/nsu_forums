import styles from "../styles/CreatePostPage.module.css";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";
import getSession from "../util/getSession";
import SelectMenu from "../components/SelectMenu";

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

const categoryOptions = [
  { value: "romance", label: "romance" },
  { value: "studies", label: "studies" },
  { value: "campus", label: "campus" },
  { value: "others", label: "others" },
];

// Infer form schema type
type FormData = z.infer<typeof formSchema>;

export default function CreatePostModal() {
  const navigate = useNavigate();
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSelect = (option: any, _: string) => {
    reset({
      category: option.value,
    });
  };
  const onSubmit = async (formData: FormData): Promise<any> => {
    try {
      const { userId, token } = await getSession();

      //create post
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_API_URL}/auth_req/create_post`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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
      <div className={styles.header}>Create post</div>
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

        <div className={styles.label}>Category</div>
        <SelectMenu options={categoryOptions} onChange={onSelect} />

        <div className={styles.bottom_row}>
          <button type='submit' disabled={isSubmitting}>
            {isSubmitting ? "...Posting" : "Create"}
          </button>
          {errors.root && <p className={styles.err}>{errors.root.message}</p>}
        </div>
      </form>
    </div>
  );
}
