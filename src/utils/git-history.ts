import { gitHubEditConfig } from "../config";
// Import json directly - Vite/Astro handles JSON imports
// @ts-ignore
import gitHistory from "../json/git-history.json";

export interface Commit {
	hash: string;
	date: string;
	message: string;
}

export function getPostHistory(postId: string): Commit[] {
	try {
		// Normalize ID to match keys in JSON (forward slashes)
		const normalizedId = postId.replace(/\\/g, "/");

		// Look up in the pre-generated history map
		if (gitHistory && gitHistory[normalizedId]) {
			return gitHistory[normalizedId];
		}

		return [];
	} catch (e) {
		console.error(`Failed to get git history for post: ${postId}`, e);
		return [];
	}
}

export function getCommitUrl(hash: string): string {
	if (!gitHubEditConfig.enable || !gitHubEditConfig.baseUrl) {
		return "#";
	}

	// extract repo url from edit url
	// edit url example: https://github.com/afoim/fuwari/blob/main/src/content/posts
	// commit url: https://github.com/afoim/fuwari/commit/HASH

	// Try to find the repo root
	// This is a simple heuristic: remove /blob/...
	const blobIndex = gitHubEditConfig.baseUrl.indexOf("/blob/");
	if (blobIndex !== -1) {
		const repoRoot = gitHubEditConfig.baseUrl.substring(0, blobIndex);
		return `${repoRoot}/commit/${hash}`;
	}

	// If structure is different, might just append to base if it was a repo root (unlikely given config name)
	// Fallback: assume baseUrl is close to repo root or user can't use this feature fully without config tweak
	return `${gitHubEditConfig.baseUrl}/../../commit/${hash}`; // Very rough guess if parsing fails
}
