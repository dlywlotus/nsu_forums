import { useNavigate } from "react-router-dom";
import styles from "../styles/Post.module.css";
import { post } from "./PostList";
import "react-confirm-/src/react-confirm-.css";
import PostSocialCounters from "./PostSocialCounters";
import PostControls from "./PostControls";
import PostHeader from "./PostHeader";
import PostEditor from "./PostEditor";

type props = {
  postContent: post;
  isShowControls?: boolean;
  isExpanded?: boolean;
  isEditing?: boolean;
};

export default function Post({
  postContent,
  isShowControls = false,
  isExpanded = false,
  isEditing = false,
}: props) {
  const navigate = useNavigate();

  const expandPost = () => {
    navigate(`/post/${postContent.ID}`);
  };

  return (
    <div
      className={styles.container}
      onClick={isExpanded ? undefined : expandPost}
      data-expanded={isExpanded}
    >
      <PostHeader postContent={postContent} />
      {isEditing && <PostEditor postContent={postContent} />}
      {!isEditing && (
        <>
          <div className={styles.post_title}>{postContent.Title}</div>
          <p className={styles.post_body}>{postContent.Body}</p>
        </>
      )}
      <PostSocialCounters postContent={postContent} isExpanded={isExpanded} />
      {isShowControls && <PostControls postId={postContent.ID} />}
    </div>
  );
}
