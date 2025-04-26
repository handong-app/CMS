import fetch from "node-fetch";
import * as core from "@actions/core";
import { PullRequestData, Reviewer, ReviewerGroup } from "./interfaces";

export async function notifyDiscordDM(
  token: string,
  prReview: PullRequestData,
  reviewers: Reviewer[]
) {
  for (const reviewer of reviewers) {
    if (!reviewer.discordId) {
      core.warning(`No discordId for ${reviewer.github}, skipping DM`);
      continue;
    }

    const payload = {
      // content: `👋 Hey <@${reviewer.discordId}>, you've been assigned to review a new PR on GitHub!`,
      content: `## 📢  리뷰어로 할당되었습니다!!\n\n* **PR 제목:** ${
        prReview.title
      }\n* **담당자:** ${prReview.author}\n* **리뷰어:** ${reviewers
        .map((reviewer) => `${reviewer.github}(${reviewer.part})`)
        .join(", ")}\n* **리뷰하러 가기:** ${prReview.url}`,
      flags: 4,
    };

    const res = await fetch(`https://discord.com/api/v10/users/@me/channels`, {
      method: "POST",
      headers: {
        Authorization: `Bot ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ recipient_id: reviewer.discordId }),
    });

    if (!res.ok) {
      core.warning(
        `Failed to open DM channel with ${reviewer.github}: ${res.statusText}`
      );
      continue;
    }

    const channel = await res.json();

    const messageRes = await fetch(
      `https://discord.com/api/v10/channels/${channel.id}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bot ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!messageRes.ok) {
      core.warning(
        `Failed to send DM to ${reviewer.github}: ${messageRes.statusText}`
      );
    } else {
      core.info(`✅ DM sent to ${reviewer.github}`);
    }
  }
}
