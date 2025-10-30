import { getElementByIndexPath } from "./extractor/elem-position-path.js";

export class ElementHighlighter {
	constructor() {
		// @ts-ignore
		import("./beacon.css", { with: { type: "css" } }).then(({ default: beaconCss }) =>
			document.adoptedStyleSheets.push(beaconCss)
		);
	}

	zoomToElement(element, zoomLevel = 1.1) {
		const rect = element.getBoundingClientRect();
		const elementX = rect.left + window.scrollX;
		const elementY = rect.top + window.scrollY;

		const viewportCenterX = window.innerWidth / 2;
		const viewportCenterY = window.innerHeight / 2;

		const translateX = viewportCenterX - elementX * zoomLevel;
		const translateY = viewportCenterY - elementY * zoomLevel;

		//prettier-ignore
		document.body.style.transform = `scale(${zoomLevel}) translate(${translateX / zoomLevel}px, ${translateY / zoomLevel }px)`;
	}

	/** @param {HTMLElement} targetElem */
	showBeacon(targetElem, stepNum) {
		if (targetElem.dataset.handrailUserAction === "pending") return;
		const rect = targetElem.getBoundingClientRect();
		this.beaconElem = document.createElement("handrail-beacon");
		this.beaconElem.style.top = rect.top + scrollY + "px";
		this.beaconElem.style.left = rect.left + "px";
		document.body.appendChild(this.beaconElem);

		targetElem.scrollIntoView({ behavior: "smooth", block: "center" });
		targetElem.dataset.handrailUserAction = "pending";
		// this.zoomToElement(targetElem);
	}

	onSelect(stepNum, evt) {
		this.beaconElem.remove();
		evt.currentTarget.dataset.handrailUserAction = "select";
		chrome.runtime.sendMessage({ msg: "stepCompleted", stepNum: stepNum });
	}

	async onInputFieldFill(stepNum, evt) {
		console.log(stepNum, evt);
		this.beaconElem.remove();
		evt.currentTarget.dataset.handrailUserAction = "fill";
		chrome.runtime.sendMessage({ msg: "stepCompleted", stepNum: stepNum });
	}

	async onClick(stepNum, evt) {
		this.beaconElem.remove();
		evt.currentTarget.dataset.handrailUserAction = "complete";
		chrome.runtime.sendMessage({ msg: "stepCompleted", stepNum: stepNum });
	}

	handleElemRemove(stepNum) {
		chrome.runtime.sendMessage({ msg: "stepCompleted", stepNum: stepNum });
	}

	/** @param {HTMLElement} targetElem @param {any} stepNum */
	setListner(targetElem, stepNum, actionType) {
		if ((actionType === "input" && targetElem.tagName === "INPUT") || targetElem.tagName === "TEXTAREA") {
			targetElem.addEventListener("change", this.onInputFieldFill.bind(this, stepNum), { capture: true });
		} else if (actionType === "select") {
			if (targetElem.tagName === "SELECT") {
				$on(targetElem, "change", this.onSelect.bind(this, stepNum));
			}
			//TODO observe click and mutation observer
		} else $on(targetElem, "click", this.onClick.bind(this, stepNum));

		// Create a MutationObserver instance for check element is removed
		/* const observer = new MutationObserver(removeElemListener);
		observer.observe(targetElem.parentElement, { childList: true });
		function removeElemListener() {
			targetElem.isConnected || this.handleElemRemove(stepNum);
		}

		// @ts-ignore
		navigation.addEventListener("navigate", onNavigate.bind(this));
		function onNavigate(event) {
			targetElem.isConnected || this.handleElemRemove(stepNum);
		} */

		// trigger = {navigate:{oldUrl, newUrl:""}}
		// Listen navigation to trigger event
	}

	/** @param {ElementInstruction} elementData*/
	async highlightElemForClick(elementData, stepNum, actionType) {
		console.log(elementData, stepNum, actionType);
		const filePath = chrome.runtime.getURL("/scripts/extractor/dom-element-extractor.js");
		const { DOMElementExtractor } = await import(filePath);
		const targetElem =
			DOMElementExtractor.elementMap.get(elementData.elementId) ?? getElementByIndexPath(elementData.indexPath);

		this.showBeacon(targetElem, stepNum);
		this.setListner(targetElem, stepNum, actionType);
	}
}

export const elementHighlighter = new ElementHighlighter();

/**
 * @typedef {Object} ElementInstruction
 * @property {string} elementId - Unique identifier of the target DOM element.
 * @property {string} indexPath - String path representing the element’s hierarchical position (e.g., "[0,1,4,5]").
 * @property {string} instructionText - Instruction or descriptive text associated with the element.
 * @property {"subtle"|"medium"|"prominent"} highlightIntensity - Level of visual emphasis for highlighting the element.
 * @property {boolean} waitForUser - Whether the system should pause and wait for user interaction before continuing.
 * @property {number} [autoAdvanceDelay] - Optional delay in milliseconds before automatically advancing to the next step.
 */
