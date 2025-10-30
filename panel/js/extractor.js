import { extractTranscript } from "../../scripts/extractor/extract-tutorial.js";
export const getCrtTab = async () => (await chrome.tabs.query({ active: true, currentWindow: true }))[0];

export async function extractYoutubeTransScript() {
	const tabId = (await getCrtTab()).id;
	try {
		return await injectFuncScript(extractTranscript, tabId);
	} catch (error) {
		console.error(error);
	}
}

/**@param {(...args: any[]) => any} func*/
export async function injectFuncScript(func, tabId, ...args) {
	const results = await chrome.scripting.executeScript({
		target: { tabId },
		func: func,
		args: args,
	});
	return results?.[0]?.result;
}

export async function injectContentScript(tabId) {
	tabId ??= await getCrtTab();
	const injection = {
		target: { tabId: tabId },
		func: (script) => import(chrome.runtime.getURL(script)),
		args: ["scripts/content.js"],
	};
	const execScript = async () => await chrome.scripting.executeScript(injection).catch((err) => console.warn(err));
	try {
		await chrome.tabs.sendMessage(tabId, "ping");
	} catch (error) {
		execScript();
		await new Promise((r) => setTimeout(r, 1000));
	}
}
