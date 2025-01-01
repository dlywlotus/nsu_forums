import { useNavigate } from "react-router-dom";
import styles from "../styles/Post.module.css";
import PostLikes from "./PostLikes";
import { post } from "./PostList";
import { formatDistanceToNowStrict } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";

type props = {
  postContent: post;
  isExpanded?: boolean;
};

const icon: Record<string, string> = {
  romance: "fa-solid fa-heart",
  studies: "fa-solid fa-book",
  campus: "fa-solid fa-house",
  others: "fa-solid fa-compass",
};

export default function Post({ postContent, isExpanded }: props) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const timeElapsed = formatDistanceToNowStrict(
    new Date(postContent.CreatedAt)
  );
  const onClick = () => {
    queryClient.resetQueries({ queryKey: ["post"] });
    navigate(`/post/${postContent.ID}`);
  };

  return (
    <div
      className={styles.container}
      onClick={isExpanded ? undefined : onClick}
      data-expanded={isExpanded ?? false}
    >
      <div className={styles.category}>
        <i className={icon[postContent.Category]}></i> {postContent.Category}
      </div>
      <div className={styles.nameAndTime}>
        <span>{postContent.Username} &middot; </span>
        <span className={styles.time}>{timeElapsed} ago</span>
      </div>
      <div className={styles.post_title}>{postContent.Title}</div>
      <div className={styles.post_body}>{postContent.Body}</div>
      <div className={styles.social_counters}>
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
      </div>
    </div>
  );
}
