export const ACTION_TYPES = {
	NAVIGATION: "navigate", // Go to URL, back, forward, refresh
	CLICK: "click", // Click button, link, checkbox, etc.
	INPUT: "input", // Text input, textarea
	SELECT: "select", // Dropdown selection
	READ: "read", // Wait for user to read/understand
	UPLOAD: "upload", // File upload
	VERIFY: "verify", // Check if something is correct
	WAIT: "wait", // Wait for page load/animation
};

export const STEP_STATUS = {
	PENDING: "pending",
	ACTIVE: "active",
	COMPLETED: "completed",
	SKIPPED: "skipped",
	FAILED: "failed",
};

export class Tutorial {
	constructor(id, url, metadata, targetWebsite, stats) {
		this.id = id ?? URLToHash(url);
		this.srcUrl = url;
		this.metadata = {
			title: metadata.title,
			description: metadata.description,
			thumbnail: metadata.thumbnail,
		};
		this.targetWebsite = targetWebsite;
		this.userInstruction = "";
		this.status = "incomplete";
		this.stats = {
			totalSteps: 0,
			completeSteps: 0,
		};
		this.createAt = Date.now();
	}
}

export class TutorialStep {
	constructor(
		{
			stepNum,
			actionType,
			action,
			targetElement,
			instruction,
			explanation = null,
			userGuidance,
			pauseDuration = 2000,
			alternativeMethods = [],
			confidence,
		},
		tutorialId
	) {
		this.id = tutorialId + stepNum;
		this.tutorialId = tutorialId;
		this.stepNum = stepNum;
		this.actionType = actionType;
		this.action = action;
		this.targetElement = targetElement;
		this.instruction = instruction;
		this.explanation = explanation;
		this.userGuidance = userGuidance;
		this.pauseDuration = pauseDuration;
		this.alternativeMethods = alternativeMethods;
		this.confidence = confidence;
		this.state = { status: STEP_STATUS.PENDING, targetElemStatus: "finding" };
	}
}

export function URLToHash(url) {
	let hash = 2166136261;

	for (let i = 0; i < url.length; i++) {
		hash ^= url.charCodeAt(i);
		hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
	}

	return hash >>> 0;
}

export function cleanLink(tabUrl) {
	const url = new URL(tabUrl);
	return url.origin + url.pathname;
}
