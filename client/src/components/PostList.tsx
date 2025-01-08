import { useInView } from "react-intersection-observer";
import styles from "../styles/PostList.module.css";
import Post from "./Post";

export type post = {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  Title: string;
  Body: string;
  Category: string;
  AuthorID: string;
  Username: string;
  UserLiked: boolean;
  LikeCount: number;
  CommentCount: number;
  ProfilePic: string;
};

export type page = {
  posts: post[];
  currentPage: number;
  nextPage: number;
};

type props = {
  pagesOfPosts: page[];
  fetchNexPage: any;
  hasNextPage: boolean;
  selfPosted: boolean;
};

export default function PostList({
  pagesOfPosts,
  fetchNexPage,
  hasNextPage,
  selfPosted,
}: props) {
  const { ref } = useInView({
    onChange: (inView, _) => {
      if (inView && hasNextPage) {
        fetchNexPage();
      }
    },
  });

  return (
    <>
      {pagesOfPosts.map(page => (
        <div className={styles.page} key={page.currentPage}>
          {(page.posts ?? []).map(post => (
            <Post postContent={post} key={post.ID} editable={selfPosted} />
          ))}
        </div>
      ))}
      <div ref={ref} className={styles.end_of_page}>
        {hasNextPage || "No more posts"}
      </div>
    </>
  );
}
