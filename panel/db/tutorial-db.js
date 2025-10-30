import { db, Store } from "./db.js";
import { Tutorial } from "./Step.js";

/**
 * Retrieves all tab tutorials, sorted by the most recently closed.
 * @returns {Promise<Tutorial[]>}
 */
async function getAllTutorials() {
	return new Promise((resolve, reject) => {
		db.getObjStore(Store.Tutorials).then((store) => {
			const request = store.getAll();
			request.onsuccess = (event) => resolve(event.target["result"]);
			request.onerror = (e) => reject(e);
		});
	});
}

async function getTutorialById(tutorialId) {
	return new Promise((resolve, reject) => {
		db.getObjStore(Store.Tutorials).then((store) => {
			const request = store.get(tutorialId);
			request.onsuccess = (event) => resolve(event.target["result"]);
			request.onerror = (e) => reject(e);
		});
	});
}

/**
 * Adds a new tab tutorial to the database.
 * @param {Tutorial} tutorial
 * @returns {Promise<string>} The ID of the saved tutorial.
 */
async function addTutorial(tutorial) {
	return new Promise((resolve, reject) => {
		db.getObjStore(Store.Tutorials, "readwrite").then((store) => {
			const request = store.add(tutorial);
			request.onsuccess = (evt) => resolve(evt.target["result"]);
			request.onerror = (e) => reject(e);
		});
	});
}

/** @param {string} tutorialId @returns {Promise<void>} */
async function deleteTutorial(tutorialId) {
	return new Promise((resolve, reject) => {
		db.getObjStore(Store.Tutorials, "readwrite").then((store) => {
			const request = store.delete(tutorialId);
			request.onsuccess = (evt) => resolve(evt.target["result"]);
			request.onerror = (e) => reject(e);
		});
	});
}

export const tutorialdb = {
	getAllTutorials,
	getTutorialById,
	addTutorial,
	deleteTutorial,
};
