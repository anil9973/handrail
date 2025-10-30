export async function extractTranscript() {
	let transcriptContainer = document.getElementById("segments-container");
	if (!transcriptContainer) {
		document.querySelectorAll("ytd-structured-description-content-renderer")[1].querySelector("button")["click"]();
		await new Promise((r) => setTimeout(r, 1200));
	}
	transcriptContainer = document.getElementById("segments-container");
	const transcriptStrings = transcriptContainer.querySelectorAll("yt-formatted-string");
	const transcript = Array.prototype.map.call(transcriptStrings, (elem) => elem.textContent).join(" ");

	function getMetaContent(property) {
		const meta = document.querySelector(`meta[property="${property}"], meta[name="${property}"]`);
		return meta?.["content"] || "";
	}

	return {
		transcript,
		url: location.href,
		title: getMetaContent("og:title") || document.title,
		description: getMetaContent("og:description") || getMetaContent("description"),
		author: getMetaContent("author"),
	};
}
