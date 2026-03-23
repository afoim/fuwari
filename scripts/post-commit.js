import { execSync } from "child_process";
import fs from "fs";
import path from "path";

function getGitUnstagedFiles() {
	const output = execSync("git status --porcelain", { encoding: "utf-8" });
	return output
		.trim()
		.split("\n")
		.map((line) => line.slice(3))
		.filter(Boolean);
}

function parseFrontmatter(content) {
	const match = content.match(/^---\n([\s\S]*?)\n---/);
	if (!match) return null;

	const frontmatter = {};
	const lines = match[1].split("\n");

	for (const line of lines) {
		const colonIdx = line.indexOf(":");
		if (colonIdx === -1) continue;

		const key = line.slice(0, colonIdx).trim();
		let value = line.slice(colonIdx + 1).trim();

		if (value.startsWith('"') && value.endsWith('"')) {
			value = value.slice(1, -1);
		} else if (value.startsWith("'") && value.endsWith("'")) {
			value = value.slice(1, -1);
		}

		frontmatter[key] = value;
	}

	return frontmatter;
}

function findPostFile(files) {
	const postDir = "src/content/posts";
	for (const file of files) {
		if (file.startsWith(postDir + "/") && file.endsWith(".md")) {
			return file;
		}
	}
	return null;
}

function isNewFile(file) {
	try {
		execSync(`git ls-files --error-unmatch "${file}"`, { encoding: "utf-8" });
		return false;
	} catch {
		return true;
	}
}

function main() {
	const files = getGitUnstagedFiles();

	if (files.length === 0) {
		console.error("Error: No unstaged changes found");
		process.exit(1);
	}

	const postFile = findPostFile(files);

	if (!postFile) {
		console.error("Error: No post file found in unstaged changes");
		process.exit(1);
	}

	const content = fs.readFileSync(postFile, "utf-8");
	const fm = parseFrontmatter(content);

	if (!fm || !fm.title) {
		console.error("Error: Post file missing title in frontmatter");
		process.exit(1);
	}

	const title = fm.title;
	const description = fm.description || "";
	const isNew = isNewFile(postFile);
	const action = isNew ? "发布" : "更新";

	const commitMsg = `posts: ${action}文章：《${title}》，${description}`;

	execSync(`git add .`, { encoding: "utf-8" });
	execSync(`git commit -m "${commitMsg}"`, { encoding: "utf-8" });

	console.log(`Committed: ${commitMsg}`);
}

main();
