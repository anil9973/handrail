import { MarkdownParser } from "../../logic/markdown/parser/mark-htmldom/parser.js";
import { MarkWriterPad } from "./mark-writer-pad.js";
import { ActionBar } from "./action-bar.js";
// @ts-ignore
import askAiCss from "../../style/ask-ai.css" with { type: "css" };
document.adoptedStyleSheets.push(askAiCss);

export class AskAiChatDialog extends HTMLElement {
	constructor(pageY) {
		super();
		this.popover = "";
		this.style.top = pageY + "px";
	}

	/** @param {AsyncGenerator<any, void, unknown>} readStream */
	async parseMarkDomStream(readStream) {
		this.markWriterPad.replaceChildren();
		const markParser = new MarkdownParser();
		for await (const contentFrag of markParser.parseStream(readStream)) this.markWriterPad.appendChild(contentFrag);
	}

	async onQuestionReceived({ detail: promptText }) {
		const chatSession = this.parentElement.parentElement["aiChatSession"];
		const responseStream = await chatSession.askQuestion(promptText);
		await this.parseMarkDomStream(responseStream);
	}

	render() {
		this.markWriterPad = new MarkWriterPad();
		return this.markWriterPad;
	}

	async connectedCallback() {
		const actionBar = new ActionBar();
		this.replaceChildren(this.render(), actionBar);
		this.showPopover();

		$on(actionBar, "question", this.onQuestionReceived.bind(this));
	}

	disconnectedCallback() {}
}

customElements?.define("ask-ai-chat-dialog", AskAiChatDialog);
