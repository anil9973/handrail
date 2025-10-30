/** @enum {string} */
export const Store = {
	Tutorials: "Tutorials",
	TutorialSteps: "TutorialSteps",
};

class ThemeBuilderDatabase {
	constructor() {
		this.db = null;
	}

	onupgradeneeded({ target }) {
		const db = target.result;
		db.createObjectStore(Store.Tutorials, { keyPath: "id" });

		const stepStore = db.createObjectStore(Store.TutorialSteps, { keyPath: "id" });
		stepStore.createIndex("tutorialId", "tutorialId", { unique: false });
	}

	/** @returns {Promise<IDBDatabase>} */
	connect() {
		return new Promise((resolve, reject) => {
			const request = indexedDB.open("HandrailDB", 1);
			request.onupgradeneeded = this.onupgradeneeded;
			request.onsuccess = () => {
				this.db = request.result;
				this.db.onclose = () => (this.db = null);
				resolve(this.db);
			};
			request.onerror = () => reject(request.error);
			request.onblocked = () => console.warn("Database open blocked — waiting for release.");
		});
	}

	/** @param {string} storeName */
	async getObjStore(storeName, mode = "readonly") {
		this.db ??= await this.connect();
		const tx = this.db.transaction(storeName, mode);
		return tx.objectStore(storeName);
	}

	/** @param {string} storeName */
	async getObjTxn(storeName, mode = "readwrite") {
		this.db ??= await this.connect();
		return this.db.transaction(storeName, mode);
	}

	/**
	 * Generic getAll operation
	 * @param {Store} storeName - Object store name
	 * @param {any} key - Primary key
	 */
	async get(storeName, key) {
		return new Promise((resolve, reject) => {
			this.getObjStore(storeName).then((store) => {
				const request = store.get(key);
				request.onsuccess = (evt) => resolve(evt.target["result"]);
				request.onerror = (e) => reject(e);
			});
		});
	}

	/**
	 * Generic getAll operation
	 * @param {Store} storeName - Object store name
	 * @returns {Promise<any[]>}
	 */
	async getAll(storeName) {
		return new Promise((resolve, reject) => {
			this.getObjStore(storeName).then((store) => {
				const request = store.getAll();
				request.onsuccess = (evt) => resolve(evt.target["result"]);
				request.onerror = (e) => reject(e);
			});
		});
	}

	/**
	 * Generic put operation
	 * @param {Store} storeName - Object store name
	 * @param {Object} objData - Data to store
	 */
	async put(storeName, objData) {
		return new Promise((resolve, reject) => {
			this.getObjStore(storeName, "readwrite").then((store) => {
				const request = store.put(objData);
				request.onsuccess = (evt) => resolve(evt.target["result"]);
				request.onerror = (e) => reject(e);
			});
		});
	}

	/**
	 * Generic put update
	 * @param {Store} storeName - Object store name
	 * @param {string|number} key - Data to store
	 * @param {Object} props - Data to store
	 */
	async update(storeName, key, props) {
		return new Promise((resolve, reject) => {
			this.getObjStore(storeName, "readwrite").then((store) => {
				const request = store.get(key);
				request.onsuccess = (evt) => {
					const obj = evt.target["result"];
					for (const propName in props) obj[propName] = props[propName];
					const request = store.put(obj);
					request.onsuccess = (evt) => resolve(evt.target["result"]);
					request.onerror = (e) => reject(e);
					resolve();
				};
			});
		});
	}

	/**
	 * Generic delete operation
	 * @param {Store} storeName - Object store name
	 * @param {Object} objData - Data to store
	 */
	async delete(storeName, objData) {
		return new Promise((resolve, reject) => {
			this.getObjStore(storeName, "readwrite").then((store) => {
				const request = store.delete(objData);
				request.onsuccess = (evt) => resolve(evt.target["result"]);
				request.onerror = (e) => reject(e);
			});
		});
	}
}

export const db = new ThemeBuilderDatabase();
