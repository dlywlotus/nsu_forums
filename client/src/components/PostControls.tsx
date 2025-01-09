import styles from "../styles/PostControls.module.css";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import getSession from "../util/getSession";
import { confirmAlert } from "react-confirm-alert";
import { useNavigate } from "react-router-dom";

type props = {
  postId: number;
};

export default function PostControls({ postId }: props) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const deletePost = async (postId: number) => {
    try {
      const { token } = await getSession();
      await axios.delete(
        `http://localhost:3000/auth_req/delete_post/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      queryClient.refetchQueries({ queryKey: ["posts"] });
    } catch (error) {
      console.error(error);
    }
  };

  const editPost = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    navigate(`/edit/${postId}`);
  };

  const onDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    confirmAlert({
      title: "Delete post",
      message: "Are you sure you want to continue?",
      buttons: [
        {
          label: "Yes",
          onClick: () => deletePost(postId),
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  return (
    <div className={styles.post_controls}>
      <button onClick={onDelete}>
        <i className='fa-solid fa-trash'></i>
      </button>
      <button onClick={editPost}>
        <i className='fa-solid fa-pen'></i>
      </button>
    </div>
  );
}
