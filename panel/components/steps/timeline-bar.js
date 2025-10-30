export class TimelineBar extends HTMLElement {
	constructor(stepCount) {
		super();
		this.stepCount = stepCount;
	}

	handleStatusUpdate({ detail }) {
		this.children[detail.stepNum - 1]["dataset"].status = detail.status;
	}

	render() {
		return Array.from({ length: this.stepCount }, (_, index) => new TimelineDot(index + 1));
	}

	connectedCallback() {
		this.replaceChildren(...this.render());
		$on(this, "updatestatus", this.handleStatusUpdate.bind(this));
	}
}

customElements.define("timeline-bar", TimelineBar);

export class TimelineDot extends HTMLElement {
	constructor(index) {
		super();
		this._internals = this.attachInternals();
		this.style.setProperty("position-anchor", "--step-anchor-" + index);
	}

	connectedCallback() {
		this.appendChild(document.createElement("div"));
	}
}

customElements.define("timeline-dot", TimelineDot);
