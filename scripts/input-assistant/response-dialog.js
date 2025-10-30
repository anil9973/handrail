import { MarkWriterPad } from "./mark-writer-pad.js";
import { ActionBar } from "./action-bar.js";
// @ts-ignore
import popupCss from "./prompt-response.css" with { type: "css" };

export class AiAssistantDialog extends HTMLElement {
	constructor() {
		super();
	}

	render() {
		this.writingPad = new MarkWriterPad();
		return [this.writingPad];
	}

	async connectedCallback() {
		const actionBar = new ActionBar();
		this.popover = "";
		this.attachShadow({ mode: "open" });
		this.shadowRoot.adoptedStyleSheets = [popupCss];
		this.shadowRoot.replaceChildren(...this.render(), actionBar);
		this.showPopover();
	}

	disconnectedCallback() {}
}

// @ts-ignore
AiAssistantDialog = customElements?.define("ai-assistant-dialog", AiAssistantDialog);
