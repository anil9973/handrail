import { TutorialStep, ACTION_TYPES, STEP_STATUS } from "../../db/Step.js";
import { AskAiChatDialog } from "../ask-ai/ask-ai-chat-dialog.js";
import { getCrtTab } from "../../js/extractor.js";
import { html } from "../../js/om.compact.js";

export class StepActionBtn extends HTMLElement {
	/** @param {TutorialStep} step */
	constructor(step) {
		super();
		this.step = step;
	}

	openAIChatPopup({ pageY }) {
		this.appendChild(new AskAiChatDialog(pageY));
	}

	reFindElem() {
		if (this.step.state.targetElemStatus !== "Not_Found") return;
		fireEvent(this.parentElement, "highlightelem");
	}

	async navigate() {
		const crtTab = await getCrtTab();
		const targetUrl = "https://google.com"; // TODO
		await chrome.tabs.update(crtTab.id, { url: targetUrl });
		globalThis.zstate.once("pageload", () => (this.step.state.status = STEP_STATUS.COMPLETED));
	}

	async handleBtnClick() {
		fireEvent(this.parentElement, "highlightelem");
	}

	skipStep() {
		this.step.state.status = STEP_STATUS.SKIPPED;
	}

	render() {
		// element is highlight then show highlight, when user fill -> next button show
		const btnText = this.step.actionType === ACTION_TYPES.NAVIGATION ? "Go" : "Highlight";
		return html`${this.step.actionType === ACTION_TYPES.NAVIGATION
				? html`<button style="--btn-clr:dodgerblue" @click=${this.navigate.bind(this)}>${btnText}</button>`
				: html`${() =>
						this.step.state.targetElemStatus === "Found"
							? html`<button style="--btn-clr:dodgerblue" @click=${this.handleBtnClick.bind(this)}>
									${btnText}
							  </button>`
							: html`<span class="${this.step.state.targetElemStatus}" @click=${this.reFindElem.bind(this)}
									>${this.step.state.targetElemStatus ?? ""}</span
							  >`}`}

			<button class="outline-btn" style="--btn-clr:gray" @click=${this.skipStep.bind(this)}>Skip</button>
			<button class="ask-ai-btn" @click=${this.openAIChatPopup.bind(this)}>Ask AI</button>`;
	}

	connectedCallback() {
		this.replaceChildren(this.render());
	}
}

customElements.define("step-action-btns", StepActionBtn);
