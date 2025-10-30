export class MarkWriterPad extends HTMLElement {
	constructor() {
		super();
	}

	renderContent(content) {
		if (!content) return;
		this.insertAdjacentHTML("beforeend", content);
	}

	static inputProcessor;

	connectedCallback() {
		this.contentEditable = "true";
		this.spellcheck = false;
	}
}

// @ts-ignore
MarkWriterPad = customElements.define("mark-writer-pad", MarkWriterPad);
