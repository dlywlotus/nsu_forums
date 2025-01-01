import styles from "../styles/ExpandedPostPage.module.css";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Post from "../components/Post";
import axios from "axios";
import { useUser } from "../Hooks/useUser";
import CommentSection, { comment } from "../components/CommentSection";
import { post } from "../components/PostList";
import LoadingSpinner from "../components/LoadingSpinner";

export type postData = {
  post: post;
  comments: comment[];
};

type props = {};

export default function ExpandedPostPage({}: props) {
  const { postId } = useParams();
  const { userId } = useUser();

  const fetchPost = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_SERVER_API_URL}/post/${postId}?user_id=${userId}`
    );
    const data: postData = res.data;
    return data;
  };

  const { data, isPending, isError } = useQuery({
    queryKey: ["post"],
    queryFn: fetchPost,
    enabled: userId !== null,
  });

  return (
    <>
      {isError && <div>Error loading post</div>}
      {isPending && <LoadingSpinner isLoading={isPending} />}
      {data && (
        <div className={styles.container}>
          <Post postContent={data.post} isExpanded={true} />
          <CommentSection comments={data.comments} postId={data.post.ID} />
        </div>
      )}
    </>
  );
}
