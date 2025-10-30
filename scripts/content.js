globalThis.$ = (selector, scope) => (scope || document).querySelector(selector);
globalThis.$on = (target, type, /** @type {Function} */ callback) => target.addEventListener(type, callback);

function getWebPageInfo() {
	function getMetaContent(property) {
		const meta = document.querySelector(`meta[property="${property}"], meta[name="${property}"]`);
		return meta?.["content"] || "";
	}

	return {
		url: location.href,
		title: getMetaContent("og:title") || document.title,
		description: getMetaContent("og:description") || getMetaContent("description"),
		author: getMetaContent("author"),
	};
}

async function extractRelatedElements(stepType) {
	const { DOMElementExtractor } = await import(chrome.runtime.getURL("/scripts/extractor/dom-element-extractor.js"));
	return await new DOMElementExtractor().extractAllElements(stepType);
}

function waitForPageLoad(e) {
	return new Promise((resolve, reject) => document.addEventListener("load", resolve));
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request === "ping") {
		document.readyState === "complete" ? sendResponse("pong") : waitForPageLoad().then(sendResponse);
		return true;
	} else if (request.msg === "highlightElemForClick") {
		import(chrome.runtime.getURL("scripts/highlight-elem.js")).then(({ elementHighlighter }) => {
			elementHighlighter.highlightElemForClick(request.elementData, request.stepNum, request.actionType);
			sendResponse("working...");
		});
	} else if (request.msg === "extractRelatedElements") {
		extractRelatedElements(request.stepType).then(sendResponse);
		return true;
	} else if (request === "getWebPageInfo") sendResponse(getWebPageInfo());
});
