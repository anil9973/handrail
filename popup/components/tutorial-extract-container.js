import { getCrtTab, injectFuncScript } from "../../panel/js/extractor.js";
import { extractPageThumbnail } from "../../scripts/func-script.js";
import { html } from "../../panel/js/om.compact.js";
import { Tutorial } from "../../panel/db/Step.js";
import { db, Store } from "../../panel/db/db.js";
// @ts-ignore
import tutorialCss from "../style/tutorial.css" with { type: "css" };
document.adoptedStyleSheets.push(tutorialCss);

export class TutorialExtractContainer extends HTMLElement {
	constructor() {
		super();
	}

	async startTutorial(tab) {
		db.put(Store.Tutorials, this.tutorial);
		await setStore({ currentTutorialId: this.tutorial.id });
		await chrome.sidePanel.open({ tabId: tab.id });
		setTimeout(() => close(), 3000);
	}

	onInstructionUpdate({ target }) {
		this.tutorial.userInstruction = target.value;
	}

	render(tab, thumbnail) {
		return html`<h3>${tab.title}</h3>
			<img src="${thumbnail}" />
			<label>
				<span>Enter custom instruction (optional)</span>
				<textarea @click=${this.onInstructionUpdate.bind(this)}></textarea>
			</label>
			<button @click=${this.startTutorial.bind(this, tab)}>🚀 Start Guided Tutorial</button>`;
	}

	async connectedCallback() {
		const tab = await getCrtTab();
		const videoId = new URL(tab.url).searchParams.get("v");
		const [description, thumbnail] = await injectFuncScript(extractPageThumbnail, tab.id);
		this.tutorial = new Tutorial(videoId, tab.url, { title: tab.title, description, thumbnail });
		this.replaceChildren(this.render(tab, thumbnail));
	}
}

customElements.define("tutorial-extract-container", TutorialExtractContainer);
