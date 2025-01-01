import { useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import PostFilterBar from "../components/PostFilterBar";
import PostList from "../components/PostList";
import { useUser } from "../Hooks/useUser";
import LoadingSpinner from "../components/LoadingSpinner";
// import styles from "../styles/PostDashboardPage.module.css";

export type filterOptions = {
  sortBy: "new" | "likes";
  category: "romance" | "studies" | "campus" | "others" | "all";
  searchKeyword: string;
  selfPosted?: boolean;
};

export default function PostDashboard() {
  const { userId } = useUser();
  const filterRef = useRef<filterOptions>({
    sortBy: "new",
    category: "all",
    searchKeyword: "",
    selfPosted: false,
  });
  const fetchPosts = async ({ pageParam }: { pageParam: number }) => {
    let res = await fetch(
      `http://localhost:3000/posts?cat=${filterRef.current.category}&sort=${filterRef.current.sortBy}&page=${pageParam}&user_id=${userId}&self=${filterRef.current.selfPosted}&q=${filterRef.current.searchKeyword}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!res.ok) {
      throw new Error("Failed to fetch posts");
    }
    return await res.json();
  };

  //the "enabled" option makes useQuery wait until the condition is satisfied before fetching the data
  //the userId data starts of null and resolves to the user id or an emptry string
  //before the userId is resolved to either, the fetch is put on standby
  const { data, isError, isFetching, fetchNextPage, hasNextPage, refetch } =
    useInfiniteQuery({
      queryKey: ["posts"],
      queryFn: fetchPosts,
      initialPageParam: 1,
      getNextPageParam: lastPage => lastPage.nextPage,
      enabled: userId != null, //still works when userId is ""
    });
  console.log(data);
  return (
    <>
      <PostFilterBar filterRef={filterRef} refetch={refetch} />
      {isError && <div>Error loading posts</div>}
      {isFetching && <LoadingSpinner isLoading={isFetching} />}
      {data && (
        <PostList
          pagesOfPosts={data.pages}
          fetchNexPage={fetchNextPage}
          hasNextPage={hasNextPage}
        />
      )}
    </>
  );
}
