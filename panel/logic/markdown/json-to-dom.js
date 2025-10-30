export class JsonToDomRenderer {
	constructor() {}

	addElement(element) {
		/**@type {HTMLElement} */
		const htmlElem = document.createElement(element.tagName);

		if (element.attributes) {
			const attributes = element.attributes;
			for (const attr in attributes) htmlElem.setAttribute(attr, attributes[attr]);
		}

		if (element.children && element.children.length !== 0) this.insertChildren(element.children, htmlElem);
		return htmlElem;
	}

	insertChildren(children, docFrag) {
		for (const node of children) {
			const htmlNode = node.type === "Element" ? this.addElement(node) : new Text(node.data);
			docFrag.appendChild(htmlNode);
		}
	}

	/**@param {Object} elements, @returns {DocumentFragment}*/
	createDom(elements) {
		const docFrag = new DocumentFragment();
		this.insertChildren(elements, docFrag);
		return docFrag;
	}
}
