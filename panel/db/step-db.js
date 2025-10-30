import { db, Store } from "./db.js";
import { TutorialStep } from "./Step.js";

/**
 * Retrieves all tab tutorialSteps, sorted by the most recently closed.
 * @returns {Promise<TutorialStep[]>}
 */
async function getAllTutorialSteps(tutorial) {
	return new Promise((resolve, reject) => {
		db.getObjStore(Store.TutorialSteps).then((store) => {
			const request = store.index("tutorialId").getAll(tutorial);
			request.onsuccess = (event) => resolve(event.target["result"]);
			request.onerror = (e) => reject(e);
		});
	});
}

async function getTutorialStepById(tutorialStepId) {
	return new Promise((resolve, reject) => {
		db.getObjStore(Store.TutorialSteps).then((store) => {
			const request = store.get(tutorialStepId);
			request.onsuccess = (event) => resolve(event.target["result"]);
			request.onerror = (e) => reject(e);
		});
	});
}

/**
 * Adds a new tab tutorialStep to the database.
 * @param {TutorialStep[]} tutorialSteps
 * @returns {Promise<string>} The ID of the saved tutorialStep.
 */
async function insertTutorialAllSteps(tutorialSteps, tutorialId) {
	return new Promise((resolve, reject) => {
		db.getObjTxn(Store.TutorialSteps).then((transaction) => {
			const store = transaction.objectStore(Store.TutorialSteps);
			for (const step of tutorialSteps) store.add(new TutorialStep(step, tutorialId));

			transaction.oncomplete = (evt) => resolve(evt.target["result"]);
			transaction.onerror = (e) => reject(e);
		});
	});
}

/**
 * Adds a new tab tutorialStep to the database.
 * @param {string} stepId
 * @param {string} key
 * @param {string|object} value
 * @returns {Promise<string>} The ID of the saved tutorialStep.
 */
async function updateTutorialStep(stepId, key, value) {
	return new Promise((resolve, reject) => {
		db.getObjStore(Store.TutorialSteps, "readwrite").then((store) => {
			const getQuery = store.get(stepId);
			getQuery.onsuccess = (evt) => {
				const step = evt.target["result"];
				step[key] = value;
				typeof value === "object" && delete value.status;
				const request = store.put(step);
				request.onsuccess = (evt) => resolve(evt.target["result"]);
				request.onerror = (e) => reject(e);
			};
		});
	});
}

/** @param {string} tutorialStepId @returns {Promise<void>} */
async function deleteTutorialStep(tutorialStepId) {
	return new Promise((resolve, reject) => {
		db.getObjStore(Store.TutorialSteps, "readwrite").then((store) => {
			const request = store.delete(tutorialStepId);
			request.onsuccess = (evt) => resolve(evt.target["result"]);
			request.onerror = (e) => reject(e);
		});
	});
}

export const stepdb = {
	getAllTutorialSteps,
	getTutorialStepById,
	insertTutorialAllSteps,
	updateTutorialStep,
	deleteTutorialStep,
};
