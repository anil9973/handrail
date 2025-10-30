import { db, Store } from "../../../panel/db/db.js";
import { TutorialCard } from "./tutorial-card.js";

export class PreviousTutorialList extends HTMLElement {
	constructor() {
		super();
	}

	render(tutorials) {
		return tutorials.map((tutorial) => new TutorialCard(tutorial));
	}

	async connectedCallback() {
		const tutorials = await db.getAll(Store.Tutorials);
		this.replaceChildren(...this.render(tutorials));
	}
}

customElements.define("previous-tutorial-list", PreviousTutorialList);
