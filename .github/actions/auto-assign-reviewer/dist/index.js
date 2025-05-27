"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const fs_1 = require("fs");
const path_1 = require("path");
const notifyDiscord_1 = require("./notifyDiscord");
function getReviewers() {
    const path = (0, path_1.resolve)(__dirname, "../reviewers.json");
    const data = (0, fs_1.readFileSync)(path, "utf-8");
    return JSON.parse(data);
}
function addReviewerFromGroup(groupCandidates, existingReviewers, part, selected) {
    if (groupCandidates.every((candidate) => !existingReviewers.has(candidate.github))) {
        if (groupCandidates.length > 0)
            selected.push({ ...selectRandom(groupCandidates), part });
    }
}
function detectChangedGroups(files) {
    let front = false;
    let back = false;
    for (const file of files) {
        if (file.startsWith("src/main/front")) {
            front = true;
        }
        if (file.startsWith("src/main/java") ||
            file.startsWith("src/main/resources")) {
            back = true;
        }
    }
    return { front, back };
}
function selectRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
}
async function getCandidates(token) {
    const octokit = github.getOctokit(token);
    const pr = github.context.payload.pull_request;
    const repo = github.context.repo;
    if (!pr) {
        throw new Error("Not a pull request event");
    }
    const prNumber = pr.number;
    const prAuthor = pr.user.login;
    const changedFiles = [];
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
    const existingReviewers = new Set(pr.requested_reviewers
        .map((r) => r.login)
        .filter((r) => !r.includes("[bot]")));
    const selected = [];
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
        // Check for coderabbitai[bot] approval
        const reviews = await octokit.rest.pulls.listReviews({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            pull_number: pr.number,
        });
        const coderabbitaiApproval = reviews.data.find((review) => review.user?.login === "coderabbitai[bot]" &&
            review.state === "APPROVED");
        if (!coderabbitaiApproval) {
            core.info("coderabbitai[bot] has not approved this PR. Skipping reviewer assignment.");
            return;
        }
        core.info("coderabbitai[bot] has approved the PR. Proceeding with reviewer assignment.");
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
            }
            else {
                core.info("Running in ACT, skipping reviewer assignment");
            }
            // Notify Discord DM
            const discordToken = core.getInput("discord-token", { required: true });
            try {
                await (0, notifyDiscord_1.notifyDiscordDM)(discordToken, {
                    title: pr.title,
                    url: pr.html_url || "",
                    author: author,
                }, reviewers);
                core.info("Discord notifications sent successfully");
            }
            catch (error) {
                core.warning(`Failed to send Discord notifications: ${error.message}`);
            }
        }
        core.info("🎯 Custom action ran successfully!");
    }
    catch (error) {
        core.setFailed(`Action failed: ${error.message}`);
    }
}
run();
