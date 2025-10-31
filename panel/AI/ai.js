import { initializeApp, getAI, getGenerativeModel, GoogleAIBackend, InferenceMode } from "./firebase-ai.js";
import { PromptBuilder } from "./prompt-builder.js";
import { TutorialStep } from "../db/Step.js";

const firebaseConfig = {
	apiKey: "AIzaSyCw2MLTQuUuGZSJwdKaVHg8jFoOJf7Mc94",
	authDomain: "handrailai.firebaseapp.com",
	projectId: "handrailai",
	storageBucket: "handrailai.firebasestorage.app",
	messagingSenderId: "385063380563",
	appId: "1:385063380563:web:07c2ac3b1f8950247fc8a6",
	measurementId: "G-3R5P2HCMXX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize the Google AI service.
const googleAI = getAI(app, { backend: new GoogleAIBackend() });

export class AIChatSession {
	constructor() {
		this.isInitialized = false;
		this.conversationHistory = [];
	}

	async initialize() {
		try {
			// Create a `GenerativeModel` instance with a model that supports your use case.
			this.model = getGenerativeModel(googleAI, {
				mode: InferenceMode.PREFER_IN_CLOUD,
				inCloudParams: { model: "gemini-2.5-flash" },
			});
			this.userProfile = (await getStore("userProfile")).userProfile ?? {};
			// Start chat session with system prompt
			const systemPrompt = PromptBuilder.generateSystemPrompt(this.userProfile);

			this.chatSession = this.model.startChat({
				history: [
					{
						role: "user",
						parts: [{ text: systemPrompt }],
					},
					{
						role: "model",
						parts: [
							{
								text: "I understand. I am HandRail AI, ready to provide personalized tutorial guidance based on the user profile. I will adapt my language, detail level, and pacing according to their preferences.",
							},
						],
					},
				],
			});
			this.isInitialized = true;
			console.log("HandRail AI Session initialized successfully");
		} catch (error) {
			console.error("Failed to initialize AI session:", error);
			throw new Error(`AI Initialization failed: ${error.message}`);
		}
	}

	/**
	 * @description Get real-time guidance for current step on webpage
	 * @param {TutorialStep} step
	 * @param {any} pageContext
	 * @param {any} elementDataTree
	 * @returns {Promise<StepInstruction>}
	 */
	async getOnPageGuidance(step, pageContext, elementDataTree) {
		this.isInitialized || (await this.initialize());

		const guidancePrompt = PromptBuilder.stepGuidancePrompt(step, pageContext, elementDataTree, this.userProfile);

		try {
			const result = await this.chatSession.sendMessage(guidancePrompt);
			const responseText = result.response.text();
			// Parse JSON response
			const guidanceData = extractJSONContent(responseText);

			// Store in conversation history
			this.conversationHistory.push({
				type: "on_page_guidance",
				stepNumber: step.stepNum,
				timestamp: Date.now(),
				data: guidanceData,
			});

			return guidanceData;
		} catch (error) {
			console.error("Error getting on-page guidance:", error);
			throw new Error(`Guidance generation failed: ${error.message}`);
		}
	}

	/** @description Handle user feedback and adapt guidance */
	async processFeedback(feedback) {
		this.isInitialized || (await this.initialize());

		const feedbackPrompt = PromptBuilder.feedbackPrompt(feedback, this.userProfile);

		try {
			const result = await this.chatSession.sendMessage(feedbackPrompt);
			const responseText = result.response.text();

			const analysis = extractJSONContent(responseText);

			// Update profile if needed
			/* if (analysis.profile_adjustment_needed) {
				this.userProfile = {
					...this.userProfile,
					...analysis.suggested_changes,
				};

				// Save to storage
				await this.saveProfile();
			} */

			return analysis;
		} catch (error) {
			console.error("Error processing feedback:", error);
			throw new Error(`Feedback processing failed: ${error.message}`);
		}
	}

	/** Quick query for user questions during tutorial */
	async askQuestion(question, context = {}) {
		this.isInitialized || (await this.initialize());

		const queryPrompt = PromptBuilder.queryPrompt(question, context, this.userProfile);

		try {
			const result = await this.chatSession.sendMessageStream(queryPrompt);
			return result.stream;
			/* const result = await this.chatSession.sendMessage(queryPrompt);
			const answer = result.response.text();

			this.conversationHistory.push({
				type: "user_question",
				question,
				answer,
				timestamp: Date.now(),
			});

			return answer; */
		} catch (error) {
			console.error("Error answering question:", error);
			throw new Error(`Question answering failed: ${error.message}`);
		}
	}
}

export class AiService {
	constructor() {}

	model;

	initModel() {
		this.model = getGenerativeModel(googleAI, {
			mode: InferenceMode.PREFER_ON_DEVICE,
			inCloudParams: { model: "gemini-2.5-flash" },
		});
	}

	/**
	 * @description Extract actionable steps from YouTube video transcript
	 * @param {VideoContext} videoData
	 * @returns {Promise<{tutorialTitle:string, targetLinkUrl:string, steps:TutorialStep[]}>}
	 */
	async extractStepsFromVideo(videoData) {
		this.model ?? (await this.initModel());
		this.userProfile = (await getStore("userProfile")).userProfile ?? {};

		const extractionPrompt = PromptBuilder.videoExtractionPrompt(videoData, this.userProfile);

		try {
			const result = await this.model.generateContent(extractionPrompt);
			const responseText = result.response.text();
			// Parse JSON response
			const stepsData = extractJSONContent(responseText);
			return stepsData;
		} catch (error) {
			console.error("Error extracting steps:", error);
			throw new Error(`Step extraction failed: ${error.message}`);
		}
	}
}

export const aiService = new AiService();

/** @param {string} markText*/
function extractJSONContent(markText) {
	markText = markText.trim();
	if (markText.startsWith("{") && markText.startsWith("}")) return JSON.parse(markText);
	let jsonStartIndex = markText.indexOf("```json");
	if (jsonStartIndex === -1) return markText;

	jsonStartIndex = jsonStartIndex + 7;
	const blockEndIndex = markText.indexOf("```", jsonStartIndex);
	const jsonContent = markText.slice(jsonStartIndex, blockEndIndex);
	return JSON.parse(jsonContent.trim());
}

/**
 * @typedef {Object} VideoContext
 * @property {string} transcript - Full text transcript of the video.
 * @property {string} url - Direct or canonical URL of the video.
 * @property {string} title - Title of the video.
 * @property {string} description - Description or summary of the video content.
 * @property {string} author - Name or handle of the video’s creator/uploader.
 */

/**
 * @typedef {Object} StepInstruction
 * @property {string} elementId - Unique identifier of the target UI element.
 * @property {string} indexPath - Stringified path representing the element’s position in the hierarchy (e.g., "[0,1,4,5]").
 * @property {string} instructionText - Instruction or guidance text for the user.
 * @property {"subtle"|"medium"|"prominent"} highlightIntensity - Visual emphasis level for highlighting the element.
 * @property {boolean} waitForUser - Whether the system should wait for user interaction before proceeding.
 * @property {number} [autoAdvanceDelay] - Optional delay (in milliseconds) before auto-advancing to the next step.
 * @property {number} confidence - Confidence score (0–1) indicating the reliability of this match.
 * @property {string} reason - Explanation or rationale for why this element was selected.
 * @property {boolean} needMoreContext - Indicates whether more contextual data is required for accuracy.
 * @property {?string} moreInfoNeeded - Optional details on what extra context is needed (null if none).
 * @property {AlternativeMatch[]} [alternatives] - Optional fallback element suggestions.
 */

/**
 * @typedef {Object} AlternativeMatch
 * @property {string} elementId - Identifier of the alternative UI element.
 * @property {number} confidence - Confidence score (0–1) for this alternative.
 * @property {string} reason - Explanation of why this element is considered as an alternative.
 */
