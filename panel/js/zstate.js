export class ZState {
	constructor(tab) {
		this.tabId = tab.id;
		this.tabStatus = tab.status;
		this.tabUrl = tab.url;

		chrome.tabs.onUpdated.addListener(this.tabListener.bind(this));
		// chrome.tabs.onActivated.addListener(onTabSwitch);
	}

	on(event, cb) {
		this[event] = { cb };
	}

	once(event, cb) {
		this[event] = { cb, once: true };
	}

	emit(event, ...args) {
		this[event]?.cb(...args);
		this[event]?.once && delete this[event];
	}

	tabListener(tabId, info, tab) {
		if (this.tabId !== tabId) return;
		this.tabStatus = info.status;
		if (info.status !== "complete") return;
		this.tabUrl = tab.url;
		this.emit("pageload", tab.url);
	}
}
