import { TutorialStepsContainer } from "./steps/steps-container.js";
import { extractYoutubeTransScript, getCrtTab } from "../js/extractor.js";
import { tutorialdb } from "../db/tutorial-db.js";
import { AIChatSession, aiService } from "../AI/ai.js";
import { stepdb } from "../db/step-db.js";
import { Tutorial, TutorialStep } from "../db/Step.js";
import { db, Store } from "../db/db.js";

export class HandrailPanel extends HTMLElement {
	constructor() {
		super();
	}

	render() {
		const image = new Image();
		image.src = "/assets/loading.svg";
		return image;
	}

	async connectedCallback() {
		this.replaceChildren(this.render()); // TODO analyzing animation
		const tutorialId = (await getStore("currentTutorialId")).currentTutorialId;
		if (!tutorialId) return chrome.action.openPopup();

		const tutorial = await tutorialdb.getTutorialById(tutorialId);
		const steps = (await stepdb.getAllTutorialSteps(tutorialId)).sort((a, b) => a.stepNum - b.stepNum);
		if (steps.length !== 0) return this.replaceChildren(new TutorialStepsContainer(steps));

		// Extract steps from videos
		/** @type {import("../AI/ai.js").VideoContext} */
		const videoData = await extractYoutubeTransScript();
		const guide = await aiService.extractStepsFromVideo(videoData);
		tutorial.targetWebsite = guide.targetLinkUrl;
		tutorial.stats.totalSteps = guide.steps.length;
		await stepdb.insertTutorialAllSteps(guide.steps, tutorialId);
		db.update(Store.TutorialSteps, tutorialId, {
			targetWebsite: guide.targetLinkUrl,
			stats: { totalSteps: guide.steps.length },
		});
		this.replaceChildren(new TutorialStepsContainer(guide.steps.map((step) => new TutorialStep(step, tutorialId))));
	}
}

customElements.define("handrail-panel", HandrailPanel);
