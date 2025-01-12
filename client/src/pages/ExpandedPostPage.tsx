import styles from "../styles/ExpandedPostPage.module.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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

type props = {
  isEditing?: boolean;
};

export default function ExpandedPostPage({ isEditing = false }: props) {
  const { postId } = useParams();
  const { userId } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const navBack = () => {
    location.key === "default" ? navigate("/") : navigate(-1);
  };

  const fetchPost = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_SERVER_API_URL}/post/${postId}?user_id=${userId}`
    );
    const data: postData = res.data;
    return data;
  };

  const { data, isFetching, isError } = useQuery({
    queryKey: ["post", Number(postId)],
    queryFn: fetchPost,
    enabled: userId !== null,
  });
  return (
    <div className={styles.wrapper}>
      {isError && <div>Error loading post 😢</div>}
      {isFetching && <LoadingSpinner isLoading={isFetching} />}
      {data && (
        <>
          {data?.post.ID !== 0 ? (
            <div className={styles.container}>
              <Post
                postContent={data.post}
                isExpanded={true}
                isEditing={isEditing}
              />
              <CommentSection comments={data.comments} postId={data.post.ID} />
              <button className={styles.btn_back} onClick={navBack}>
                <i className='fa-solid fa-arrow-left-long'></i>
              </button>
            </div>
          ) : (
            <div>Post does not exist 😢</div>
          )}
        </>
      )}
    </div>
  );
}
