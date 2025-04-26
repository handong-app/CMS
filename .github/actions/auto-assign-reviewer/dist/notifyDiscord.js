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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyDiscordDM = notifyDiscordDM;
const node_fetch_1 = __importDefault(require("node-fetch"));
const core = __importStar(require("@actions/core"));
async function notifyDiscordDM(token, prReview, reviewers) {
    for (const reviewer of reviewers) {
        if (!reviewer.discordId) {
            core.warning(`No discordId for ${reviewer.github}, skipping DM`);
            continue;
        }
        const payload = {
            // content: `👋 Hey <@${reviewer.discordId}>, you've been assigned to review a new PR on GitHub!`,
            content: `📢 **리뷰어로 할당되었습니다!!**\n\n📝 **PR 제목:** ${prReview.title}\n👤 **담당자:** ${prReview.author}\n👀 **리뷰어:** ${reviewers
                .map((reviewer) => `${reviewer.github}(${reviewer.part})`)
                .join(", ")}\n🔗 **리뷰하러 가기:** ${prReview.url}`,
            flags: 4,
        };
        const res = await (0, node_fetch_1.default)(`https://discord.com/api/v10/users/@me/channels`, {
            method: "POST",
            headers: {
                Authorization: `Bot ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ recipient_id: reviewer.discordId }),
        });
        if (!res.ok) {
            core.warning(`Failed to open DM channel with ${reviewer.github}: ${res.statusText}`);
            continue;
        }
        const channel = await res.json();
        const messageRes = await (0, node_fetch_1.default)(`https://discord.com/api/v10/channels/${channel.id}/messages`, {
            method: "POST",
            headers: {
                Authorization: `Bot ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
        if (!messageRes.ok) {
            core.warning(`Failed to send DM to ${reviewer.github}: ${messageRes.statusText}`);
        }
        else {
            core.info(`✅ DM sent to ${reviewer.github}`);
        }
    }
}
