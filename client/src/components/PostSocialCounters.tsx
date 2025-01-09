import styles from "../styles/PostSocialCounters.module.css";
import PostLikes from "./PostLikes";
import { post } from "./PostList";

type props = {
  postContent: post;
  isExpanded: boolean;
};

export default function PostSocialCounters({ postContent, isExpanded }: props) {
  return (
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
  );
}
