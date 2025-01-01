import styles from "../styles/CommentSection.module.css";
import CommentBar from "./CommentBar";
import Comment from "./Comment";

export type comment = {
  AuthorID: string;
  Body: string;
  CreatedAt: string;
  DeletedAt: string;
  ID: number;
  PostID: number;
  UpdatedAt: string;
  Username: string;
  ReplyID: number | null;
  Replies: comment[];
};

type props = {
  comments: comment[];
  postId: number;
};

export default function CommentSection({ comments, postId }: props) {
  return (
    <div className={styles.container}>
      <CommentBar postId={postId} />
      <div className={styles.comment_list}>
        {comments?.map(c => (
          <Comment key={c.ID} commentData={c} />
        ))}
      </div>
    </div>
  );
}
