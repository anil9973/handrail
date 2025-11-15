// reactor.js
var react = {
	node: null,
	attr: null,
	valfn: null,
	fragFn: null,
	style: null,
	cmt: null,
};
var bindAttrs = /* @__PURE__ */ new Set(["value", "checked", "open"]);
var ReactNode = class {
	constructor() {
		this.node = react.node;
		this.attr = react.attr;
		this.valFn = react.valFn;
		this.style = react.style;
	}
};
var ReactCmt = class {
	constructor() {
		this.fragfn = react.fragFn;
		this.cmtNode = react.cmt;
	}
};
var updator = {
	/**@param {Comment} cmtNode, @param {DocumentFragment} docFrag */
	replaceChildFrag(cmtNode, docFrag) {
		if (Array.isArray(docFrag))
			cmtNode.parentNode.replaceChildren(cmtNode.previousElementSibling ?? "", cmtNode, ...docFrag);
		else cmtNode.parentNode.replaceChild(docFrag, cmtNode.nextSibling);
	},
	/**@param {ReactCmt} reactData */
	setSibling({ cmtNode, fragfn }) {
		const siblingFrag = fragfn();
		if (siblingFrag instanceof Promise) siblingFrag.then((docFrag) => updator.replaceChildFrag(cmtNode, docFrag));
		else updator.replaceChildFrag(cmtNode, siblingFrag || new Comment(String(Math.random()).slice(9)));
	},
	/**@param {ReactNode} reactData */
	setValue(reactData) {
		const node = reactData.node;
		if (reactData.attr) {
			if (reactData.style) reactData.node.style.setProperty(reactData.style, reactData.valFn());
			else if (node[reactData.attr] !== void 0 && node instanceof HTMLElement)
				node[reactData.attr] = reactData.valFn();
			else node.setAttribute(reactData.attr, reactData.valFn());
		} else {
			const childNode = reactData.valFn();
			if (node.nodeType === 3) return (node.textContent = childNode);
			Array.isArray(childNode) ? node.replaceChildren(...childNode) : node.replaceChildren(childNode);
		}
	},
	/**@param {ReactNode|ReactCmt} reactData */
	update(reactData) {
		reactData.cmtNode
			? updator.setSibling(reactData)
			: reactData.func
			? reactData.func()
			: updator.setValue(reactData);
	},
};
var reactMaker = {
	/** @param {Element|Node} reactNode, @param {string} attr, @param {object} targetObj*/
	setBinding(reactNode, attr, targetObj, prop) {
		const nodeAttr = reactNode["valueAsNumber"] ? "valueAsNumber" : attr;
		reactNode.addEventListener(reactNode["bindEvent"], function () {
			targetObj[prop] = this[nodeAttr];
		});
	},
	/**@param {object} target, @param {string|symbol} prop, @param {ReactCmt|ReactNode} reactData */
	insertReactData(target, prop, reactData) {
		if (target._reactMap.has(prop)) {
			const reactItem = target._reactMap.get(prop);
			Array.isArray(reactItem) ? reactItem.push(reactData) : target._reactMap.set(prop, [reactItem, reactData]);
		} else target._reactMap.set(prop, reactData);
	},
	makeReactData() {
		let reactData;
		if (react.node) {
			reactData = new ReactNode();
			if (bindAttrs.has(react.attr) && react.node["bindEvent"])
				reactMaker.setBinding(react.node, react.attr, ...arguments);
		} else if (react.cmt) reactData = new ReactCmt();
		return reactData;
	},
};
function reactive(targetObj) {
	if (targetObj["_reactMap"]) return targetObj;
	if (typeof targetObj !== "object") return targetObj;
	if (Array.isArray(targetObj)) return reactArr(targetObj);
	Object.defineProperty(targetObj, "_reactMap", { value: /* @__PURE__ */ new Map(), enumerable: false });
	Object.defineProperty(targetObj, "$on", {
		value: (/** @type {string} */ prop, /** @type {() => any} */ func) =>
			reactMaker.insertReactData(targetObj, prop, { func }),
		enumerable: false,
	});
	for (const key in targetObj)
		if (targetObj[key] && typeof targetObj[key] === "object")
			targetObj[key] = Array.isArray(targetObj[key]) ? reactArr(targetObj[key]) : reactive(targetObj[key]);
	return new Proxy(targetObj, {
		get(target, prop, _) {
			const reactData = reactMaker.makeReactData(target, prop);
			reactData && reactMaker.insertReactData(target, prop, reactData);
			return Reflect.get(...arguments);
		},
		set(target, prop, value) {
			if (typeof value !== "object" && target[prop] === value) return true;
			Reflect.set(target, prop, value);
			const reactData = target._reactMap.get(prop);
			if (reactData) Array.isArray(reactData) ? reactData.forEach(updator.update) : updator.update(reactData);
			return true;
		},
		deleteProperty(target, prop) {
			/**@type {ReactCmt|ReactNode} */
			const reactData = target._reactMap.get(prop);
			if (!reactData) return true;
			const rmNode = (data) => data.cmtNode?.nextSibling.replaceWith(new Comment(String(Math.random()).slice(9)));
			Array.isArray(reactData) ? reactData.forEach(rmNode) : rmNode(reactData);
			delete target[prop];
			return true;
		},
	});
}
function reactArr(targetArray) {
	if (!Array.isArray(targetArray)) return console.error("input object must be array");
	targetArray = targetArray.map((obj) => reactive(obj));
	let rtvLength;
	const makeObjReact = (items) => items.map((item) => reactive(item));
	const getItems = (items, yieldfn) => items.map((item) => yieldfn(item));
	function insertItems(start, items, reactData) {
		const childItems = getItems(items, reactData.yieldfn);
		if (!childItems) return;
		const isArr = Array.isArray(childItems);
		if (start === 0) return isArr ? reactData.comment.after(...childItems) : reactData.comment.after(childItems);
		const siblingNode = reactData.comment.parentNode.children[start - 1];
		isArr ? siblingNode.after(...childItems) : siblingNode.after(childItems);
	}
	function reuseChildItem(start, item, reactData) {
		if (reactData.updateItem) {
			const childNode = reactData.comment.parentNode.children[start];
			childNode && reactData.updateItem(childNode, item);
		} else if (reactData.comment.parentNode.children[start])
			reactData.comment.parentNode.children[start].replaceWith(reactData.yieldfn(item));
		else reactData.comment.parentNode.appendChild(reactData.yieldfn(item));
	}
	function removeItem(start, deletcount, reactData) {
		if (deletcount <= 0) return;
		for (let i = 0; i < deletcount; i++) reactData.comment.parentNode.children[start]?.remove();
	}
	function spliceItem(start, deletcount, items) {
		const reactData = targetArray["_react"][0];
		let reuseItems;
		if (items) {
			if (deletcount > 0) {
				reuseItems ??= items.splice(0, deletcount);
				const size = reuseItems.length;
				if (size !== 0) for (let i = 0; i < size; i++) reuseChildItem(start + i, reuseItems[i], reactData);
				removeItem(start + size, deletcount - size, reactData);
			}
			items && insertItems(start, items, reactData);
		} else deletcount > 0 && removeItem(start, deletcount, reactData);
	}
	const modifiers = {
		push: () =>
			function (...items) {
				items = makeObjReact(items);
				targetArray.push.call(targetArray, ...items);
				if (!targetArray["_react"])
					return rtvLength ? updator.update(rtvLength) : console.error("array is not reactive");
				for (const reactData of targetArray["_react"]) {
					const childItems = getItems(items, reactData.yieldfn),
						parentElem = reactData.comment.parentElement;
					Array.isArray(childItems) ? parentElem.append(...childItems) : parentElem.append(childItems);
				}
				rtvLength && updator.update(rtvLength);
			},
		pop: () =>
			function () {
				targetArray.pop.apply(targetArray, arguments);
				const reactData = targetArray["_react"][0];
				reactData.comment.parentNode.lastElementChild.remove();
			},
		splice: () =>
			function (start, deletecount, ...items) {
				if (!targetArray["_react"]) return targetArray.splice.apply(targetArray, arguments);
				items = makeObjReact(items);
				const result = targetArray.splice.call(targetArray, start, deletecount, ...items);
				if (!targetArray["_react"])
					return rtvLength ? updator.update(rtvLength) : console.error("array is not reactive");
				spliceItem(start, deletecount, items);
				if (rtvLength && items.length - deletecount !== 0) updator.update(rtvLength);
				return result;
			},
		shift: () =>
			function () {
				targetArray.shift.apply(targetArray, arguments);
				spliceItem(0, 1);
			},
		unshift: () =>
			function (...items) {
				targetArray.unshift.apply(targetArray, arguments);
				spliceItem(0, 0, items);
			},
		filter: () =>
			function () {
				if (!targetArray["_react"]) return targetArray.filter.apply(targetArray, arguments);
				const func = arguments[0],
					reactData = targetArray["_react"][0],
					childNodes = reactData.comment.parentNode.children;
				let index = targetArray.length;
				while (index--) {
					const willFilter = !func(targetArray[index]);
					willFilter && (childNodes[index]?.remove(), targetArray.splice(index, 1));
				}
				return this;
			},
		reverse: () =>
			function () {
				targetArray.reverse.apply(targetArray, arguments);
				const reactData = targetArray["_react"][0];
				reactData.comment.parentNode.append(...Array.from(reactData.comment.parentNode.childNodes).reverse());
			},
		sort: () =>
			function () {
				targetArray.sort.apply(targetArray, arguments);
				spliceItem(0, targetArray.length, [...targetArray]);
			},
		length: () => {
			react.cmt ? (rtvLength = new ReactCmt()) : react.node && (rtvLength = new ReactNode());
			return targetArray.length;
		},
	};

	return new Proxy(targetArray, {
		get(target, prop, receiver) {
			if (modifiers[prop]) return modifiers[prop]();
			return Reflect.get(...arguments);
		},
		deleteProperty(target, prop) {
			const reactData = targetArray["_react"][0];
			reactData.comment.parentNode.children[Number(prop)].remove();
			delete target[prop];
			return true;
		},
		defineProperty(target, key, descriptor) {
			Object.defineProperty(target, key, descriptor);
			return Reflect.get(...arguments);
		},
	});
}

// extractor.js
var attrRx = new RegExp(/\s\.(.*)=$/);
var childFrag = /* @__PURE__ */ new Map();
var reactAttrs = /* @__PURE__ */ new Map();
var funcMap = /* @__PURE__ */ new Map();
var objMap = /* @__PURE__ */ new Map();
var extractor = {
	strings: null,
	stringArr: null,
	/**@param {TemplateStringsArray} strings, @param {any[]} expressions*/
	extract(strings, ...expressions) {
		this.strings = strings;
		this.stringArr = [strings[0]];
		const length = expressions.length;
		for (let idx = 0; idx < length; idx++) {
			const key = expressions[idx];
			const instance = key?.constructor?.name;
			if (extractor.instances[instance]) extractor.instances[instance](key, idx);
			else if (typeof key === "object") this.setObjHolder(key, idx);
			else this.stringArr.push(key, strings[idx + 1]);
		}
		const parseStr = "".concat(...this.stringArr);
		this.strings = null;
		this.stringArr = null;
		return parseStr;
	},
	instances: {
		//extract function and reactive arrow function
		Function: (key, idx) => (key.name ? extractor.extractFunc(key, idx) : extractor.extractReactfn(key, idx)),
		AsyncFunction: (key, idx) => extractor.extractFunc(key, idx),
		//extract one childfragment
		DocumentFragment: (key, idx) => childFrag.set(extractor.setComment(idx), key),
		//extract array of childfragment
		Array: (key, idx) => extractor.extractArray(key, idx),
		//extract promise
		Promise: (key, idx) => extractor.extractPromise(key, idx),
		//extract object from attribute
		Object: (key, idx) => extractor.setObjHolder(key, idx),
	},
	extractFunc(key, idx) {
		const funName = String(Math.random()).slice(9);
		funcMap.set(funName, key);
		this.stringArr.push(funName, this.strings[idx + 1]);
	},
	extractReactfn(key, idx) {
		if (this.strings[idx].endsWith("=") || this.strings[idx].endsWith(":")) this.setReactHolder(key, idx);
		else if (this.strings[idx].endsWith(">")) childFrag.set(this.setComment(idx), key);
		else if (this.strings[idx].trimEnd().endsWith(">")) childFrag.set(this.setComment(idx, "?^"), key);
		else childFrag.set(this.setComment(idx, this.strings[idx].trimStart() || "?^"), key);
	},
	extractArray(key, idx) {
		if (this.strings[idx].endsWith("=")) this.setObjHolder(key, idx);
		else if (key[0] instanceof Node) childFrag.set(this.setComment(idx), key);
		else this.stringArr.push(...key, this.strings[idx + 1]);
	},
	setObjHolder(key, idx) {
		const objName = this.strings[idx].match(attrRx)?.[1];
		if (!objName) return console.warn("object only pass at attribute");
		objMap.set(objName, key);
		this.stringArr.push(objName, this.strings[idx + 1]);
	},
	setComment(idx, type = "?") {
		const cmtName = ` ${type}${String(Math.random()).slice(9)} `;
		this.stringArr.push(`<!--${cmtName}--> `, this.strings[idx + 1]);
		return cmtName;
	},
	/**@param {Promise<any>} promise, @param {number} idx*/
	extractPromise(promise, idx) {
		const cmtName = this.setComment(idx, "");
		promise.then((value) => fragment.setPromiseFrag(cmtName, value));
	},
	setReactHolder(key, idx) {
		const attrName = "%" + String(Math.random()).slice(9);
		reactAttrs.set(attrName, key);
		this.stringArr.push(attrName, this.strings[idx + 1]);
	},
};
var fragment = {
	/**@param {Comment} cmtNode, @param {DocumentFragment} docFrag */
	replaceChildFrag(cmtNode, docFrag) {
		if (Array.isArray(docFrag)) cmtNode.parentNode.replaceChildren(cmtNode, ...docFrag);
		else cmtNode.parentNode.replaceChild(docFrag, cmtNode.nextSibling);
	},
	/**@param {Comment} cmtNode, @param {Function} frag */
	insertReactChildFrag(cmtNode, frag) {
		react.cmt = cmtNode;
		react.fragFn = frag;
		const siblingFrag = react.fragFn();
		if (siblingFrag instanceof Promise) siblingFrag.then((docFrag) => this.replaceChildFrag(cmtNode, docFrag));
		//biome-ignore format:
		else
			Array.isArray(siblingFrag)
				? react.cmt.after(...siblingFrag)
				: react.cmt.after(siblingFrag ?? new Comment(String(Math.random()).slice(9)));
		react.fragFn = react.cmt = null;
	},
	/**@param {Comment} cmtNode, @param {Function} frag */
	insertReactTxtCnt(cmtNode, frag) {
		react.node = new Text();
		react.valFn = frag;
		react.node.textContent = react.valFn();
		cmtNode.parentNode.replaceChild(react.node, cmtNode);
		react.node = react.valFn = null;
	},
	/**@param {DocumentFragment} domFrag */
	setChildFragment(domFrag) {
		const nodeIterator = document.createNodeIterator(domFrag, NodeFilter.SHOW_COMMENT, (node) =>
			node.nodeValue?.startsWith(" ?") ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
		);
		let cmtNode;
		while ((cmtNode = nodeIterator.nextNode())) {
			const frag = childFrag.get(cmtNode.nodeValue);
			if (frag) {
				if (frag instanceof Function) {
					cmtNode.nodeValue.startsWith(" ?^")
						? this.insertReactChildFrag(cmtNode, frag)
						: this.insertReactTxtCnt(cmtNode, frag);
				} else Array.isArray(frag) ? cmtNode.after(...frag) : cmtNode.parentNode.replaceChild(frag, cmtNode);
			}
			childFrag.delete(cmtNode.nodeValue);
		}
	},
	/**@param {string} cmtName, @param {DocumentFragment} docFrag */
	setPromiseFrag(cmtName, docFrag, rootElem) {
		const nodeIterator = document.createNodeIterator(document.body, NodeFilter.SHOW_COMMENT, (node) =>
			node.nodeValue === cmtName ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
		);
		const cmtNode = nodeIterator.nextNode();
		cmtNode && this.replaceChildFrag(cmtNode, docFrag);
	},
};
var attrParser = {
	mutatNodes: {
		DETAILS: "toggle",
		DIALOG: "close",
		INPUT: "change",
		SELECT: "change",
		TEXTAREA: "change",
	},
	/**@param {Element} element, @param {NamedNodeMap} attrMap*/
	"@": (element, attr, attrMap) => {
		element.addEventListener(attr.name.slice(1), funcMap.get(attr.value));
		attrMap.removeNamedItem(attr.name);
		return true;
	},
	/**@param {Element} element, @param {Attr} attr, @param {NamedNodeMap} attrMap*/
	rtvAttr: (element, attr, attrMap) => {
		react.node = element;
		react.attr = attr.name.slice(1);
		react.valFn = reactAttrs.get(attr.value);
		if (!react.valFn) return console.error(`${attr.name} value is not a function or not found`);
		element[react.attr] = react.valFn();
		react.node = react.attr = react.valFn = null;
	},
	/**@param {Element} element, @param {Attr} attr, @param {NamedNodeMap} attrMap*/
	".": (element, attr, attrMap) => {
		attrParser.mutatNodes[element.tagName] && (element["bindEvent"] = attrParser.mutatNodes[element.tagName]);
		reactAttrs.has(attr.value)
			? attrParser.rtvAttr(element, attr, attrMap)
			: (element[attr.name.slice(1)] = objMap.get(attr.value) ?? attr.value ?? "");
		attrMap.removeNamedItem(attr.name);
		return true;
	},
	/**@param {Element} element, @param {Attr} attr, @param {NamedNodeMap} attrMap*/
	"?": (element, attr, attrMap) => {
		attrParser.mutatNodes[element.tagName] && (element["bindEvent"] = attrParser.mutatNodes[element.tagName]);
		reactAttrs.has(attr.value)
			? attrParser.rtvAttr(element, attr, attrMap)
			: (element[attr.name.slice(1)] = attr.value === "true");
		attrMap.removeNamedItem(attr.name);
		return true;
	},
	/**@param {Element} element, @param {Attr} attr, @param {NamedNodeMap} attrMap*/
	r: (element, attr, attrMap) => {
		if (attr.name !== "ref") return;
		reactAttrs.get(attr.value)?.(element);
		attrMap.removeNamedItem(attr.name);
		return true;
	},
	/**@param {HTMLElement|SVGElement} element, @param {Attr} attr*/
	s: (element, attr) => {
		if (attr.name !== "style") return;
		react.node = element;
		react.attr = attr.name;
		const styles = attr.value.split(";");
		for (const style of styles) {
			const [key, value] = style.split(":", 2);
			if (value?.startsWith("%")) {
				react.style = key;
				react.valFn = reactAttrs.get(value);
				element.style.setProperty(key, react.valFn());
			}
		}
		react.node = react.attr = react.style = react.valFn = null;
		return true;
	},
	/**@param {Element} element, @param {Attr} attr*/
	"%": (element, attr) => {
		react.node = element;
		react.attr = attr.name;
		react.valFn = reactAttrs.get(attr.value);
		element.setAttribute(attr.name, react.valFn());
		react.node = react.attr = react.valFn = null;
	},
	/**@param {Element} elem*/
	parseNodeAttr(elem) {
		const attrMap = elem.attributes;
		let i = attrMap.length;
		while (i--) {
			const attr = attrMap[i];
			this[attr.name.at(0)]?.(elem, attr, attrMap) || (attr.value.startsWith("%") && this["%"]?.(elem, attr));
		}
	},
};
function html(strings, ...expressions) {
	const htmlStr = extractor.extract(strings, ...expressions);
	const domFrag = new Range().createContextualFragment(htmlStr);
	for (const node of domFrag.querySelectorAll("*")) node.hasAttributes() && attrParser.parseNodeAttr(node);
	childFrag.size > 0 && fragment.setChildFragment(domFrag);
	clearMap();
	return domFrag;
}
function svg(strings, ...expressions) {
	const svgStr = extractor.extract(strings, ...expressions);
	const svgFrag = new Range().createContextualFragment(`<svg>${svgStr}</svg>`).firstElementChild;
	for (const node of svgFrag.querySelectorAll("*")) node.hasAttributes() && attrParser.parseNodeAttr(node);
	childFrag.size > 0 && fragment.setChildFragment(svgFrag);
	clearMap();
	return svgFrag.childElementCount === 1 ? svgFrag.firstElementChild : svgFrag.children;
}
function clearMap() {
	reactAttrs.clear();
	funcMap.clear();
	objMap.clear();
}
function map(reactArr2, cb, updateItem) {
	const domArr = reactArr2.map(cb);
	const comment = new Comment(` #${String(Math.random()).slice(9)} `);
	domArr.unshift(comment);
	if (reactArr2["_react"] === void 0) {
		const reactDataArr = [{ comment, yieldfn: cb, updateItem }];
		Object.defineProperty(reactArr2, "_react", { value: reactDataArr });
	} else reactArr2["_react"].push({ comment, yieldfn: cb, updateItem });
	return domArr;
}
export { html, map, reactive as react, svg };
//!test
