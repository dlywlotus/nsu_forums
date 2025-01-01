import { useUser } from "./useUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { post } from "../components/PostList";
import { comment } from "../components/CommentSection";

type data = {
  post: post;
  comments: comment[];
};

type mutationProps = {
  postId: number;
  isLiked: boolean;
};

const useMutateExpandedPostLikes = () => {
  const { userId } = useUser();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ postId, isLiked }: mutationProps) => {
      if (isLiked) {
        await axios.delete(`${import.meta.env.VITE_SERVER_API_URL}/likes`, {
          data: { userId, postId },
        });
      } else {
        await axios.post(`${import.meta.env.VITE_SERVER_API_URL}/likes`, {
          userId,
          postId,
        });
      }
    },
    onMutate: async ({ isLiked }: mutationProps) => {
      const previousData = queryClient.getQueryData(["post"]);

      //Update the like count
      queryClient.setQueryData(["post"], (data: data) => {
        let newPost = {
          ...data.post,
          LikeCount: isLiked
            ? data.post.LikeCount - 1
            : data.post.LikeCount + 1,
          UserLiked: !data.post.UserLiked,
        };
        return {
          ...data,
          post: newPost,
        };
      });

      return { previousData };
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(["post"], context?.previousData);
      console.log(err);
    },
  });

  return mutation;
};

export default useMutateExpandedPostLikes;
