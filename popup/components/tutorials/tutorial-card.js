import { getCrtTab } from "../../../panel/js/extractor.js";
import { html } from "../../../panel/js/om.compact.js";

export class TutorialCard extends HTMLElement {
	constructor(tutorial) {
		super();
		this.tutorial = tutorial;
	}

	async startTutorial() {
		const tab = await getCrtTab();
		await setStore({ currentTutorialId: this.tutorial.id });
		await chrome.sidePanel.open({ tabId: tab.id });
		setTimeout(() => close(), 2000);
	}

	render() {
		return html`<img src="${this.tutorial.metadata.thumbnail}" />
			<div class="column">
				<div class="tutorial-name">${this.tutorial.metadata.title}</div>
				<div class="tutorial-description">${this.tutorial.metadata.description}</div>
				<div class="tutorial-info">
					<div class="chip-item"><atom-icon ico="steps" title=""></atom-icon><span>20</span></div>
					<div class="chip-item"><atom-icon ico="status" title=""></atom-icon><span>Incomplete</span></div>
				</div>
			</div>`;
	}

	connectedCallback() {
		this.replaceChildren(this.render());
		$on(this, "click", this.startTutorial.bind(this));
	}
}

customElements.define("tutorial-card", TutorialCard);
