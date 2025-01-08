import { useMutation } from "@tanstack/react-query";
import styles from "../styles/CommentBar.module.css";
import { useState } from "react";
import axios from "axios";
import TextareaAutosize from "react-textarea-autosize";
import getSession from "../util/getSession";
import { useUser } from "../Hooks/useUser";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { postData } from "../pages/ExpandedPostPage";
import LoadingSpinner from "./LoadingSpinner";

type props = {
  postId: number;
  replyId?: number;
};

type mutationProps = {
  input: string;
  postId: number;
  replyId?: number;
};

export default function CommentBar({ postId, replyId }: props) {
  const [input, setInput] = useState("");
  const { userId, isLoggedIn } = useUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({ postId, replyId, input }: mutationProps) => {
      //Refresh token if expired and get current session
      const { token } = await getSession();
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_API_URL}/auth_req/create_comment`,
        {
          Body: input,
          AuthorID: userId,
          PostID: postId,
          ReplyID: replyId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data.created_comment;
    },
    onSuccess: commentData => {
      //insert new parent/child comment into comments array
      queryClient.setQueryData(["post"], (postData: postData) => {
        let newComments = replyId
          ? postData.comments.map(c =>
              c.ID === replyId
                ? { ...c, Replies: [commentData, ...(c.Replies || [])] }
                : c
            )
          : [commentData, ...postData.comments];
        return {
          post: {
            ...postData.post,
            CommentCount: postData.post.CommentCount + 1,
          },
          comments: newComments,
        };
      });
    },
  });

  const onSubmit = (e: any) => {
    e.preventDefault();
    if (isLoggedIn) {
      //renders new comment
      if (input === "") return;
      mutation.mutate({ postId, replyId, input });
      setInput("");
    } else {
      navigate("/auth");
    }
  };

  return (
    <form className={styles.comment_bar} onSubmit={onSubmit}>
      <TextareaAutosize
        className={styles.comment_input}
        minRows={1}
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={replyId ? "Reply" : "Add a comment"}
      />
      <button className={styles.btn_send}>
        <i className='fa-solid fa-paper-plane'></i>
      </button>
      {mutation.isPending && <LoadingSpinner isLoading={mutation.isPending} />}
    </form>
  );
}
