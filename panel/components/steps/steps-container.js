import { cleanLink, STEP_STATUS, TutorialStep } from "../../db/Step.js";
import { getCrtTab } from "../../js/extractor.js";
import { TimelineBar } from "./timeline-bar.js";
import { react } from "../../js/om.compact.js";
import { AIChatSession } from "../../AI/ai.js";
import { StepCard } from "./step-card.js";
import { ZState } from "../../js/zstate.js";
// @ts-ignore
import stepsCss from "../../style/steps.css" with { type: "css" };
document.adoptedStyleSheets.push(stepsCss);

export class TutorialStepsContainer extends HTMLElement {
	/** @param {TutorialStep[]} steps  */
	constructor(steps, aiSession) {
		super();
		this.steps = steps;
	}

	render(aiSession) {
		return this.steps.map((step) => new StepCard(step, aiSession));
	}

	async connectedCallback() {
		const aiSession = new AIChatSession();
		await aiSession.initialize();

		const tab = await getCrtTab();
		globalThis.zstate = new ZState(tab);

		const timelineBar = new TimelineBar(this.steps.length);
		const stepList = document.createElement("steps-list");
		stepList.append(...this.render(aiSession));
		this.replaceChildren(timelineBar, stepList);
		StepCard.timelineBar = timelineBar;

		$on(stepList, "nextstep", ({ target }) => (target.nextElementSibling.step.state.status = STEP_STATUS.ACTIVE));
		$('step-card[data-status="active"]', stepList) ??
			(stepList.firstElementChild["step"].state.status = STEP_STATUS.ACTIVE);

		this.setMessageListener(stepList);
	}

	setMessageListener(stepList) {
		chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
			if (request.msg === "stepCompleted") {
				setTimeout(() => (stepList.children[request.stepNum - 1]["step"].state.status = STEP_STATUS.COMPLETED)), 1000;
			} else if (request.msg === "select" || request.msg === "inputfieldfill") {
				stepList.children[request.stepNum - 1];
				// TODO wait for user -> next button click
			}
		});
	}
}

customElements.define("tutorial-steps-container", TutorialStepsContainer);
