export class ActionBar extends HTMLElement {
	constructor() {
		super();
	}

	sendInstruction({ currentTarget }) {
		fireEvent(this, "sendinstruction", target.value);
	}

	onInputFieldKeyup({ shiftKey, code, target }) {
		if (code === "Enter")
			shiftKey || (fireEvent(this, "sendinstruction", target.textContent), (target.textContent = ""));
	}

	render() {
		return `<section
				contenteditable="true"
				placeholder="message instruction"></section>
			<svg class="stop" viewBox="0 0 24 24">
				<title>Send instruction</title>
				<path />
			</svg>`;
	}

	connectedCallback() {
		this.innerHTML = this.render();
		this.firstElementChild.addEventListener("keyup", this.onInputFieldKeyup.bind(this));
		this.lastElementChild.addEventListener("click", this.sendInstruction.bind(this));
	}
}

// @ts-ignore
ActionBar = customElements?.define("action-bar", ActionBar);
