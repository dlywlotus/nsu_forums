import { useNavigate } from "react-router-dom";
import styles from "../styles/Post.module.css";
import PostLikes from "./PostLikes";
import { post } from "./PostList";
import { formatDistanceToNowStrict } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import getSession from "../util/getSession";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import profileIcon from "../images/defaultProfileIcon.png";

type props = {
  postContent: post;
  editable: boolean;
  isExpanded?: boolean;
};

const icon: Record<string, string> = {
  romance: "fa-solid fa-heart",
  studies: "fa-solid fa-book",
  campus: "fa-solid fa-house",
  others: "fa-solid fa-compass",
};

export default function Post({ postContent, editable, isExpanded }: props) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const timeElapsed = formatDistanceToNowStrict(
    new Date(postContent.CreatedAt)
  );

  const onDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    confirmAlert({
      title: "Delete post",
      message: "Are you sure you want to continue?",
      buttons: [
        {
          label: "Yes",
          onClick: () => mutation.mutate(postContent.ID),
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

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
    } catch (error) {
      console.error(error);
    }
  };

  const mutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["posts"] });
    },
  });

  const expandPost = () => {
    navigate(`/post/${postContent.ID}`);
  };

  const editPost = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    navigate("/edit");
  };

  return (
    <div
      className={styles.container}
      onClick={isExpanded ? undefined : expandPost}
      data-expanded={isExpanded ?? false}
    >
      {editable && (
        <div className={styles.post_controls}>
          <button onClick={onDelete}>
            <i className='fa-solid fa-trash'></i>
          </button>
          <button onClick={editPost}>
            <i className='fa-solid fa-pen'></i>
          </button>
        </div>
      )}
      <section className={styles.post_upper}>
        <img src={postContent.ProfilePic ?? profileIcon} alt='user_icon'></img>
        <div className={styles.post_details}>
          <div className={styles.categoryAndTime}>
            <div className={styles.category}>
              <i className={icon[postContent.Category]}></i>
              <span>{postContent.Category}</span>
            </div>
            <span>&middot;</span>
            <span className={styles.time}>{timeElapsed} ago</span>
          </div>
          <div className={styles.name}>
            <span>{postContent.Username}</span>
          </div>
        </div>
      </section>

      <div className={styles.post_title}>{postContent.Title}</div>
      <p className={styles.post_body}>{postContent.Body}</p>
      <section className={styles.social_counters}>
        <PostLikes
          postId={postContent.ID}
          count={postContent.LikeCount}
          isLiked={postContent.UserLiked}
          isExpanded={isExpanded}
        />
        <div className={styles.comment_count}>
          <i className='fa-solid fa-comment'></i>
          <span>{postContent.CommentCount}</span>
        </div>
      </section>
    </div>
  );
}
