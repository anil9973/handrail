import { getElemIndexPath } from "./elem-position-path.js";

const ELEMENT_CONFIG = {
	// Maximum element IDs to maintain
	MAX_ELEMENTS: 150,

	// Text context size (chars before/after)
	TEXT_CONTEXT_SIZE: 150,

	// Include form elements in all contexts
	ALWAYS_INCLUDE_FORMS: true,

	// Use hierarchical structure (false = flatten for AI)
	USE_HIERARCHY: false,

	// Include position data for visual matching
	INCLUDE_POSITION: true,

	// Popular UI library selectors
	UI_LIBRARIES: {
		REACT: ["[data-testid]", "[data-qa]", "[data-e2e]"],
		ANGULAR: ["[ng-click]", "[ng-submit]", "[data-ng-model]"],
		VUE: ["[v-click]", "[v-model]", "[data-v-*]"],
		BOOTSTRAP: [".btn", ".btn-primary", ".form-control", ".form-check"],
		MATERIAL_UI: [".MuiButton-root", ".MuiInput-root", ".MuiSelect-root"],
		TAILWIND: ['[class*="px-"]', '[class*="py-"]'], // Common patterns
		CUSTOM: ["[data-action]", "[data-type]", "[data-id]"],
	},
};

export class DOMElementExtractor {
	constructor() {
		// elementId → Element reference
		this.elementData = []; // Array of element data
		this.contextCache = new Map();
	}

	static elementMap = new Map();

	/** @public Extract all relevant elements and build indexed map  */
	async extractAllElements(stepType = "generic") {
		DOMElementExtractor.elementMap.clear();
		this.elementData = [];
		this.contextCache.clear();

		const selectors = this.selectors[stepType]();
		const elements = this.queryAllElements(selectors);

		// Process and index elements
		for (let index = 0; index < elements.length; index++) {
			const element = elements[index];
			if (!this.isValid(element)) continue;

			const elementId = `el_${this.elementData.length}`;
			DOMElementExtractor.elementMap.set(elementId, element);

			const elementData = this.extractElementData(element, elementId);
			this.elementData.push(elementData);

			// Limit to MAX_ELEMENTS
			if (this.elementData.length >= ELEMENT_CONFIG.MAX_ELEMENTS) {
				console.warn(`Reached max elements limit (${ELEMENT_CONFIG.MAX_ELEMENTS})`);
				break;
			}
		}

		console.log(`Extracted ${this.elementData.length} elements`);
		return this.elementData;
	}

	selectors = {
		input: () => [
			'input:not([type="hidden"]):not([type="submit"]):not([type="button"])',
			"textarea",
			'[contenteditable="true"]',
			'[contenteditable="plaintext-only"]',
			...ELEMENT_CONFIG.UI_LIBRARIES.REACT.filter((s) => s.includes("[data")),
		],

		select: () => [
			"select",
			'[role="listbox"]',
			'[role="combobox"]',
			'[role="menu"]',
			// '[class=*"dropdown" i]',
			// '[id=*"dropdown" i]',
			".dropdown",
			'[data-type="select"]',
			".MuiSelect-root",
		],

		upload: () => ['input[type="file"]'],

		click: () => [
			"a[href]",
			"button",
			'input[type="submit"]',
			'input[type="button"]',
			'[role="button"]',
			'[role="link"]',
			'[role="menuitem"]',
			'[role="tab"]',
			"[onclick]",
			".btn",
			".button",
			"[data-action]",
			".MuiButton-root",
			"[ng-click]",
		],

		// Include all interactive for generic
		generic: () => [
			'input:not([type="hidden"])',
			"button",
			"a[href]",
			"select",
			"textarea",
			'[role="button"]',
			"[onclick]",
			"[data-action]",
		],
	};

	/** Query all elements safely */
	queryAllElements(selectors) {
		const elements = new Set();

		for (const selector of selectors) {
			try {
				document.querySelectorAll(selector).forEach((elem) => elements.add(elem));
			} catch (error) {
				console.warn(`Invalid selector: "${selector}"`);
			}
		}

		// Always include forms if configured
		if (ELEMENT_CONFIG.ALWAYS_INCLUDE_FORMS) {
			document.querySelectorAll("form, label, fieldset").forEach((elem) => elements.add(elem));
		}

		return Array.from(elements);
	}

	/** Check if element is valid for extraction */
	isValid(element) {
		// Not a text node
		if (element.nodeType !== 1) return false;

		// Not hidden/display:none
		const style = window.getComputedStyle(element);
		if (style.display === "none" || style.visibility === "hidden") return false;

		// Has dimensions
		if (element.offsetWidth === 0 || element.offsetHeight === 0) return false;

		// Not a script or style
		if (["SCRIPT", "STYLE", "NOSCRIPT"].includes(element.tagName)) return false;

		return true;
	}

	/**
	 * Extract comprehensive data for a single element
	 * @param {HTMLInputElement|HTMLAnchorElement|HTMLSelectElement|HTMLElement} element
	 * @param {string} elementId
	 */
	extractElementData(element, elementId) {
		const data = {
			// Identification
			eId: elementId, // Custom element ID for extension
			tag: element.tagName.toLowerCase(),
			id: element.id || null,
			name: element["name"] || null,

			// Classification
			type: element["type"] || null,
			role: element.getAttribute("role") || null,
			className: element.className || null,

			// Accessibility
			ariaLabel: element.getAttribute("aria-label") || null,
			ariaDescribedBy: element.getAttribute("aria-describedby") || null,
			ariaHidden: element.getAttribute("aria-hidden") || null,
			ariaExpanded: element.getAttribute("aria-expanded") || null,
			ariaControls: element.getAttribute("aria-controls") || null,

			// Form-specific attributes
			placeholder: element["placeholder"] || null,
			autocomplete: element["autocomplete"] || null,
			required: element["required"] || false,
			disabled: element["disabled"] || false,

			// Link attributes
			href: element["href"] || null,
			target: element["target"] || null,

			// Text content
			textContent: this.extractCleanText(element),

			// UI Library detection
			// uiLibrary: this.detectUILibrary(element),

			// Data attributes
			dataAttributes: Object.assign({}, element.dataset),

			// Position and visibility
			...(ELEMENT_CONFIG.INCLUDE_POSITION && {
				position: this.getElementPosition(element),
				inViewport: this.isInViewport(element),
				visible: true, // Already filtered
			}),

			// Context (text before/after)
			beforeText: this.getTextContext(element, "before"),
			afterText: this.getTextContext(element, "after"),

			// Form-specific
			...(this.isFormElement(element) && {
				label: this.findLabel(element),
				value: element["value"] || null,
				options: this.extractOptions(element),
			}),

			indexPath: getElemIndexPath(element),
		};

		return data;
	}

	/** Extract clean, trimmed text */
	extractCleanText(element) {
		const text = element.textContent || element.innerText || "";
		return text.trim().replace(/\s+/g, " ").substring(0, 200);
	}

	/** Extract data-* attributes : Object.assign({}, $0.dataset)*/

	/**Get element position relative to viewport */
	getElementPosition(element) {
		const rect = element.getBoundingClientRect();
		const vh = innerHeight;
		const vw = innerWidth;

		const vertical = rect.top < vh / 3 ? "top" : rect.top > (vh * 2) / 3 ? "bottom" : "middle";
		const horizontal = rect.left < vw / 3 ? "left" : rect.left > (vw * 2) / 3 ? "right" : "center";

		return {
			pos: `${vertical}-${horizontal}`,
			coords: { top: rect.top, left: rect.left, bottom: rect.bottom, right: rect.right },
		};
	}

	/** Check if in viewport*/
	isInViewport(element) {
		const rect = element.getBoundingClientRect();
		return rect.top < window.innerHeight && rect.bottom > 0 && rect.left < window.innerWidth && rect.right > 0;
	}

	/** Get surrounding text context */
	getTextContext(element, direction = "before") {
		let context = "";
		let current = element;

		while (current && context.length < ELEMENT_CONFIG.TEXT_CONTEXT_SIZE) {
			if (direction === "before") {
				const prevSibling = current.previousSibling;
				if (prevSibling?.nodeType === 3) {
					context = prevSibling.textContent + context;
				} else if (prevSibling?.nodeType === 1) {
					context = prevSibling.textContent + context;
				}
				current = prevSibling;
			} else {
				const nextSibling = current.nextSibling;
				if (nextSibling?.nodeType === 3) {
					context += nextSibling.textContent;
				} else if (nextSibling?.nodeType === 1) {
					context += nextSibling.textContent;
				}
				current = nextSibling;
			}
		}

		return context.trim().substring(0, ELEMENT_CONFIG.TEXT_CONTEXT_SIZE) || null;
	}

	/** Find associated label */
	findLabel(element) {
		// Check label[for] association
		if (element.id) {
			const label = document.querySelector(`label[for="${element.id}"]`);
			if (label) return this.extractCleanText(label);
		}

		// Check parent label
		const parentLabel = element.closest("label");
		if (parentLabel) return this.extractCleanText(parentLabel);

		// Check aria-labelledby
		const labelId = element.getAttribute("aria-labelledby");
		if (labelId) {
			const labelElem = document.getElementById(labelId);
			if (labelElem) return this.extractCleanText(labelElem);
		}

		return null;
	}

	/** Check if form element */
	isFormElement(element) {
		return ["INPUT", "TEXTAREA", "SELECT"].includes(element.tagName);
	}

	/** Extract select options */
	extractOptions(element) {
		if (element.tagName !== "SELECT") return null;

		return Array.from(element.options)
			.slice(0, 30)
			.map((opt) => ({
				val: opt.value,
				txt: opt.text.trim(),
				sel: opt.selected,
				dis: opt.disabled,
			}));
	}

	/** Clear all data*/
	clear() {
		DOMElementExtractor.elementMap.clear();
		this.elementData = [];
		this.contextCache.clear();
	}
}
