import * as core from "@actions/core";
import * as github from "@actions/github";
import { readFileSync } from "fs";
import { resolve } from "path";
import { Reviewer, ReviewerGroup } from "./interfaces";
import { notifyDiscordDM } from "./notifyDiscord";

function getReviewers(): ReviewerGroup {
  const path = resolve(__dirname, "../reviewers.json");
  const data = readFileSync(path, "utf-8");
  return JSON.parse(data) as ReviewerGroup;
}

function addReviewerFromGroup(
  groupCandidates: Reviewer[],
  existingReviewers: Set<string>,
  part: "FE" | "BE",
  selected: Reviewer[]
): void {
  if (
    groupCandidates.every(
      (candidate) => !existingReviewers.has(candidate.github)
    )
  ) {
    if (groupCandidates.length > 0)
      selected.push({ ...selectRandom(groupCandidates), part });
  }
}

function detectChangedGroups(files: string[]): {
  front: boolean;
  back: boolean;
} {
  let front = false;
  let back = false;

  for (const file of files) {
    if (file.startsWith("src/main/front")) {
      front = true;
    }
    if (
      file.startsWith("src/main/java") ||
      file.startsWith("src/main/resources")
    ) {
      back = true;
    }
  }

  return { front, back };
}

function selectRandom<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

async function getCandidates(token: string): Promise<Reviewer[]> {
  const octokit = github.getOctokit(token);
  const pr = github.context.payload.pull_request;
  const repo = github.context.repo;

  if (!pr) {
    throw new Error("Not a pull request event");
  }

  const prNumber = pr.number;
  const prAuthor = pr.user.login;

  const changedFiles: string[] = [];

  // ACT 모드이면 payload 파일 사용.
  const files = !process.env.ACT
    ? await octokit.paginate(octokit.rest.pulls.listFiles, {
        owner: repo.owner,
        repo: repo.repo,
        pull_number: prNumber,
        per_page: 100,
      })
    : github.context.payload.pull_request?.files || [];

  for (const file of files) {
    changedFiles.push(file.filename);
  }

  const groupFlags = detectChangedGroups(changedFiles);
  const reviewersData = getReviewers();

  // Reviewer 있으면 하지 말기
  const existingReviewers = new Set<string>(
    pr.requested_reviewers
      .map((r: { login: string }) => r.login)
      .filter((r: string) => !r.includes("[bot]"))
  );

  const selected: Reviewer[] = [];

  if (groupFlags.front) {
    const candidates = reviewersData.front.filter((r) => r.github !== prAuthor);
    addReviewerFromGroup(candidates, existingReviewers, "FE", selected);
  }

  if (groupFlags.back) {
    const candidates = reviewersData.back.filter((r) => r.github !== prAuthor);
    addReviewerFromGroup(candidates, existingReviewers, "BE", selected);
  }

  return selected;
}

async function run() {
  try {
    const token = core.getInput("github-token", { required: true });
    const octokit = github.getOctokit(token);

    const pr = github.context.payload.pull_request;
    if (!pr) {
      core.info("This is not a pull request event. Skipping.");
      return;
    }

    const author = pr.user.login;
    core.info(`PR author: ${author}`);

    // Reviewer 선정 & 할당
    const reviewers = await getCandidates(token);

    if (reviewers.length > 0) {
      // ACT 환경에서 실행 중이면 리뷰어 할당 안함
      if (!process.env.ACT) {
        await octokit.rest.pulls.requestReviewers({
          owner: github.context.repo.owner,
          repo: github.context.repo.repo,
          pull_number: github.context.issue.number,
          reviewers: reviewers.map((r) => r.github),
        });

        // PR 에 코멘트 남기기
        const commentBody = `## 👋 리뷰어가 할당되었습니다!\n\n👀 **리뷰어:** ${reviewers
          .map((reviewer) => `@${reviewer.github} (${reviewer.part})`)
          .join(", ")}\n\n 빠른 리뷰 부탁드립니다!`;

        await octokit.rest.issues.createComment({
          owner: github.context.repo.owner,
          repo: github.context.repo.repo,
          issue_number: github.context.issue.number,
          body: commentBody,
        });
      } else {
        core.info("Running in ACT, skipping reviewer assignment");
      }

      // Notify Discord DM
      const discordToken = core.getInput("discord-token", { required: true });
      try {
        await notifyDiscordDM(
          discordToken,
          {
            title: pr.title,
            url: pr.html_url || "",
            author: author,
          },
          reviewers
        );
        core.info("Discord notifications sent successfully");
      } catch (error) {
        core.warning(
          `Failed to send Discord notifications: ${(error as Error).message}`
        );
      }
    }

    core.info("🎯 Custom action ran successfully!");
  } catch (error) {
    core.setFailed(`Action failed: ${(error as Error).message}`);
  }
}

run();
