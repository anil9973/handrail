import { html } from "../../js/om.compact.js";

export class ActionBar extends HTMLElement {
	constructor() {
		super();
	}

	askQuestion() {
		const question = this.firstElementChild.textContent;
		this.firstElementChild.textContent = "";
		fireEvent(this, "question", question);
	}

	onInputFieldKeyup({ shiftKey, code, target }) {
		if (code === "Enter") shiftKey || this.askQuestion();
	}

	render() {
		return html`<section
				contenteditable="true"
				placeholder="message instruction"
				@keyup=${this.onInputFieldKeyup.bind(this)}></section>
			<atom-icon ico="send" title="" @click=${this.askQuestion.bind(this)}></atom-icon>`;
	}

	connectedCallback() {
		this.replaceChildren(this.render());
	}
}

customElements?.define("action-bar", ActionBar);
