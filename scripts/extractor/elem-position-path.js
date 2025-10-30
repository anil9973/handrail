/**@param {Node} parentNode*/
export function getElemIndexPath(parentNode) {
	parentNode["markerIdx"] ?? addChildIndexOnElem();
	const element = parentNode.nodeType === Node.TEXT_NODE ? parentNode.parentElement : parentNode;
	const indexTree = [element["markerIdx"]];
	let parentElem = element;
	while ((parentElem = parentElem.parentElement)) {
		if (parentElem === document.body) break;
		indexTree.push(parentElem["markerIdx"]);
	}
	return indexTree.reverse();
}

function addChildIndexOnElem() {
	/**@param {HTMLCollection} children*/
	function setIndex(children) {
		for (let index = 0; index < children.length; index++) {
			const element = children[index];
			Object.defineProperty(element, "markerIdx", { value: index });
			if (element.childElementCount > 0) setIndex(element.children);
		}
	}
	setIndex(document.body.children);
}

export function getElementByIndexPath(positionTree) {
	let parentElem = document.body;
	// @ts-ignore
	for (const elemIdx of positionTree) parentElem = parentElem.children[elemIdx];
	return parentElem;
}
