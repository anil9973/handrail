import { Element, Text } from "../element.js";

/**@description serialize dom elements for save textContent in indexdb */
export class DomSerializer {
	constructor() {}

	root = { type: "root", children: [] };

	/**@param {HTMLElement} editorPad*/
	serialize(editorPad) {
		for (const lineBlockElem of editorPad.children) {
			const lineBlock = new Element(lineBlockElem.tagName);
			this.root.children.push(lineBlock);
			this.extractChildNodes(lineBlockElem.childNodes, lineBlock);
		}
		return this.root.children;
	}

	/**@param {HTMLElement} domElem*/
	extractElement(domElem) {
		const element = new Element(domElem.tagName);

		if (domElem.attributes.length !== 0) {
			element.attributes = {};
			for (const attr of domElem.attributes) {
				element.attributes[attr.name] = attr.value;
			}
		}

		if (domElem.nodeType === 1 && domElem.hasChildNodes()) this.extractChildNodes(domElem.childNodes, element);
		return element;
	}

	/**@param {NodeListOf<ChildNode>} childNodes, @param {Element} parentElem*/
	extractChildNodes(childNodes, parentElem) {
		for (const domNode of childNodes) {
			if (domNode.nodeType === 1) {
				// @ts-ignore
				const element = this.extractElement(domNode);
				parentElem.children.push(element);
			} else if (domNode.nodeType === 3) {
				const childNode = new Text(domNode.nodeValue);
				parentElem.children.push(childNode);
			}
		}
	}
}
