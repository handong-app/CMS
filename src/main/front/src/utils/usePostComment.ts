import { useMutation } from "@tanstack/react-query";
import { useFetchBe } from "../tools/api";

interface UpsertCommentPayload {
  targetId: string;
  categoryId: string;
  content: string;
}

export const usePostComment = () => {
  const fetchBe = useFetchBe();

  return useMutation({
    mutationFn: (payload: UpsertCommentPayload) =>
      fetchBe("/v1/comments", {
        method: "POST",
        body: payload,
      }),
  });
};
