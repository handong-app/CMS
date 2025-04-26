export interface Reviewer {
  github: string;
  discordId: string;
  part: "FE" | "BE";
}

export interface ReviewerGroup {
  front: Reviewer[];
  back: Reviewer[];
}

export interface PullRequestData {
  title: string;
  author: string;
  url: string;
}
