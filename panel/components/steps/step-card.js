import { ACTION_TYPES, STEP_STATUS, TutorialStep } from "../../db/Step.js";
import { getCrtTab, injectContentScript } from "../../js/extractor.js";
import { StepActionBtn } from "./step-action-btn.js";
import { html, react } from "../../js/om.compact.js";
import { stepdb } from "../../db/step-db.js";
import { AIChatSession } from "../../AI/ai.js";

export class StepCard extends HTMLElement {
	/** @param {TutorialStep} step */
	constructor(step, aiChatSession) {
		super();
		this.step = step;
		this.aiChatSession = aiChatSession;
		this.style.setProperty("anchor-name", "--step-anchor-" + this.step.stepNum);
		this.dataset.status = step.state.status;
		this.step.state = react(step.state);
	}

	static timelineBar;
	static #activeStep;

	static set activeStep(stepCard) {
		StepCard.#activeStep;
	}

	render() {
		return html`<header>
				<svg class="icon"><use href="/assets/icons.svg#${this.step.actionType}"></use></svg>
				<h3>${this.step.action}</h3>
			</header>
			<p class="step-instruction">${this.step.instruction}</p>
			${this.step.userGuidance.visualHint
				? html`<blockquote>
						<strong>👁️ Visual Hint:</strong>
						<span>${this.step.userGuidance.visualHint}</span>
				  </blockquote>`
				: ""} `;
	}

	connectedCallback() {
		this.replaceChildren(this.render());
		this.step.state["$on"]("status", this.onStatusUpdate.bind(this));
		$on(this, "click", () => (this.collapsed = !this.collapsed));
		$on(this, "highlightelem", this.highlightElemOnWebpage.bind(this));

		// Validation
		if (this.step.state.status === STEP_STATUS.ACTIVE) {
			// If required not match, go to previous step and if required condition matched, then next step
			this.appendChild(new StepActionBtn(this.step));
			this.step.actionType !== ACTION_TYPES.NAVIGATION && this.highlightElemOnWebpage();
		}
	}

	onStatusUpdate() {
		this.dataset.status = this.step.state.status;
		this.saveState();

		switch (this.step.state.status) {
			case STEP_STATUS.ACTIVE:
				this.appendChild(new StepActionBtn(this.step));
				if (this.step.actionType !== ACTION_TYPES.NAVIGATION) this.highlightElemOnWebpage();
				break;

			case STEP_STATUS.SKIPPED:
				// Update visual
				this.dispatchEvent(new Event("nextstep", { bubbles: true }));
				break;

			case STEP_STATUS.COMPLETED:
				// Update visual
				this.dispatchEvent(new Event("nextstep", { bubbles: true }));
				break;
		}

		// Update timelineBar
		fireEvent(StepCard.timelineBar, "updatestatus", { stepNum: this.step.stepNum, status: this.step.state.status });
	}

	async findElementOnWebpage(tabId) {
		this.step.state.targetElemStatus = "Finding";
		tabId ??= (await getCrtTab()).id;
		await injectContentScript(tabId);

		const message = { msg: "extractRelatedElements", stepType: this.step.actionType };
		const elementDataTree = await chrome.tabs.sendMessage(tabId, message);
		const pageInfo = await chrome.tabs.sendMessage(tabId, "getWebPageInfo");
		const targetElement = await this.aiChatSession.getOnPageGuidance(this.step, pageInfo, elementDataTree);
		if (!targetElement.elementId) {
			this.step.state.targetElemStatus = "Not_Found";
			return notify("Element not found", "error");
		}

		this.step.state.targetElemStatus = "Found";
		this.step.state.targetElement = targetElement;
		this.step.state.linkUrl = pageInfo.url;
		this.saveState();
	}

	async highlightElemOnWebpage() {
		const tab = await getCrtTab();
		await new Promise((r) => setTimeout(r, 2000));
		if (!this.step.state.targetElement?.elementId) await this.findElementOnWebpage(tab.id);
		if (!this.step.state.targetElement.elementId) return;
		// Match tabUrl with step tab url
		// If not matched navigate to url,
		// if redirect, go to prev step tabUrl, if go ... until first step
		await injectContentScript(tab.id);
		const targetElement = this.step.state.targetElement;
		const elementData = {
			elementId: targetElement.elementId,
			indexPath: targetElement.indexPath,
			instructionText: targetElement.instructionText,
			highlightIntensity: targetElement.highlightIntensity,
			waitForUser: targetElement.waitForUser,
			autoAdvanceDelay: targetElement.autoAdvanceDelay,
		};

		const message = {
			msg: "highlightElemForClick",
			elementData,
			stepNum: this.step.stepNum,
			actionType: this.step.actionType,
		};
		await chrome.tabs.sendMessage(tab.id, message);

		globalThis.zstate.once("pageload", (url) => {
			this.step.state.triggerUrl = url;
			this.step.state.status = STEP_STATUS.COMPLETED;
			this.saveState();
		});
	}

	saveState() {
		const state = Object.assign({}, this.step.state);
		if (state.targetElement) {
			state.targetElement = Object.assign({}, this.step.state.targetElement);
			state.targetElement.indexPath = Object.assign([], this.step.state.targetElement.indexPath);
			state.targetElement.alternatives = Object.assign([], this.step.state.targetElement.alternatives);
		}
		// stepdb.updateTutorialStep(this.step.id, "state", state);
	}
}

customElements.define("step-card", StepCard);
