import { visit } from "unist-util-visit";

export function remarkSpoiler() {
	return (tree) => {
		// Handle inline spoilers within a single text node (original logic)
		// AND cross-node spoilers

		// Strategy: Process paragraph nodes.
		// Iterate through children. If a text node contains '||', split it.
		// Maintain a state `inSpoiler`.
		// Replace '||' with HTML span tags.

		visit(tree, "paragraph", (node) => {
			// node.children.unshift({type: 'text', value: 'DEBUG_SPOILER '});
			// console.log('Checking paragraph:', JSON.stringify(node.children.map(c => ({type: c.type, value: c.value}))));
			const newChildren = [];
			let inSpoiler = false;

			// Check if any child contains '||'
			const hasSpoiler = node.children.some(
				(child) =>
					child.type === "text" && child.value && child.value.includes("||"),
			);

			if (!hasSpoiler) return;
			// console.log('Found spoiler in paragraph');

			for (const child of node.children) {
				if (child.type === "text") {
					// Split by '||', capturing the delimiter
					// Use a regex that matches '||' but also handles the case where it might be part of other text
					// We can just use split and iterate
					const parts = child.value.split("||");

					// If no split happened (length 1), just push the node
					if (parts.length === 1) {
						newChildren.push(child);
						continue;
					}

					// Iterate parts. The split consumes '||', so we need to insert the span tag between parts.
					parts.forEach((part, index) => {
						if (part) {
							newChildren.push({ type: "text", value: part });
						}

						// If not the last part, it means we hit a '||'
						if (index < parts.length - 1) {
							if (!inSpoiler) {
								newChildren.push({
									type: "html",
									value: '<span class="spoiler" title="点击显示">',
								});
								inSpoiler = true;
							} else {
								newChildren.push({
									type: "html",
									value: "</span>",
								});
								inSpoiler = false;
							}
						}
					});
				} else {
					// Non-text node (e.g. image, link, code), just push it
					newChildren.push(child);
				}
			}

			// If spoiler was left open at the end of paragraph, close it
			if (inSpoiler) {
				newChildren.push({
					type: "html",
					value: "</span>",
				});
			}

			node.children = newChildren;
		});
	};
}
