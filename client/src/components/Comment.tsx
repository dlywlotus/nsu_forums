import { useState } from "react";
import styles from "../styles/Comment.module.css";
import { comment } from "./CommentSection";
import { formatDistanceToNowStrict } from "date-fns";
import CommentBar from "./CommentBar";

type props = {
  commentData: comment;
};

export default function Comment({ commentData }: props) {
  const [isReplying, setIsReplying] = useState(false);
  const timeElapsed = formatDistanceToNowStrict(
    new Date(commentData.CreatedAt)
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.nameAndTime}>
          <span className={styles.author}>
            {commentData.Username} &middot;{" "}
          </span>
          <span className={styles.time}>{timeElapsed} ago</span>
        </div>
        {commentData.ReplyID === null && (
          <button
            className={styles.btn_reply}
            onClick={() => setIsReplying(!isReplying)}
          >
            <i className='fa-solid fa-reply'></i>
          </button>
        )}
      </div>
      <div className={styles.comment_body}>{commentData.Body}</div>
      {(commentData.Replies || isReplying) && (
        <div className={styles.replies}>
          {commentData.Replies &&
            commentData.Replies.map(c => (
              <Comment key={c.ID} commentData={c} />
            ))}
          {isReplying && (
            <CommentBar postId={commentData.PostID} replyId={commentData.ID} />
          )}
        </div>
      )}
    </div>
  );
}
