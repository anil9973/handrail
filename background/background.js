export function setInstallation({ reason }) {
	async function oneTimeInstall() {
		//> uninstall survey setup
		const LAMBA_KD = crypto.randomUUID();
		const SURVEY_URL = `https://uninstall-feedback.pages.dev/?e=${chrome.runtime.id}&u=${LAMBA_KD}`;
		chrome.runtime.setUninstallURL(SURVEY_URL);
	}
	reason === "install" && oneTimeInstall();
	reason === "update" && onUpdate();

	async function onUpdate() {}

	const userProfile = {
		techLevel: "intermediate",
		learningStyle: "detailed",
		guidancePace: "moderate",
		profession: "Student",
		primaryUseCase: "Learning how to use webpage on desktop",
	};
	chrome.storage.local.get({ userProfile });
}

// installation setup
chrome.runtime.onInstalled.addListener(setInstallation);
