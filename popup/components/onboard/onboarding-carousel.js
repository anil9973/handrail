import { html } from "../../../panel/js/om.compact.js";
// @ts-ignore
import onboardCss from "../../style/user-onboard.css" with { type: "css" };
document.adoptedStyleSheets.push(onboardCss)

export class UserProfile {
	constructor() {
		this.techLevel = "Intermediate";
		this.learningStyle = "Balanced";
		this.guidancePace = "Moderate";
		this.profession = "";
		this.primaryUseCase = "";
	}
}

const userProfile = new UserProfile();

const professions = [
	{ value: "developer", text: "Software Developer" },
	{ value: "devops_enginner", text: "DevOps Enginner" },
	{ value: "designer", text: "Designer" },
	{ value: "student", text: "Student" },
	{ value: "teacher", text: "Teacher" },
	{ value: "researcher", text: "Researcher" },
	{ value: "writer", text: "Writer" },
	{ value: "manager", text: "Manager" },
	{ value: "medicial", text: "Medicial" },
	{ value: "photographer", text: "Photographer" },
	{ value: "data_scientist", text: "Data Scientist" },
	{ value: "video_editor", text: "Video Editor" },
	{ value: "other", text: "Professional" },
	{ value: "marketer", text: "Marketing Professional" },
];

export class UserOnboardForm extends HTMLElement {
	constructor() {
		super();
		this.userProfile = new UserProfile();
	}

	async onSubmit() {
		this.replaceWith(new Text("Go to Youtube to extract tutorials"));
		toast("Saved. Start learning");
		setTimeout(() => close(), 10000);
	}

	async techLevelUpdate({ target }) {
		this.userProfile.techLevel = target.value;
		await setStore({ userProfile });
	}

	async learningStyleUpdate({ target }) {
		this.userProfile.learningStyle = target.value;
		await setStore({ userProfile });
	}

	async guidancePaceUpdate({ target }) {
		this.userProfile.guidancePace = target.value;
		await setStore({ userProfile });
	}

	async onUseCaseUpdate({ target }) {
		this.userProfile.primaryUseCase = target.value;
		await setStore({ userProfile });
	}

	onProfessionUpdate({ target }) {
		if (target.value === "other") this.shadowRoot.children[3]["hidden"] = false;
		this.userProfile.profession = target.value;
		setStore({ userProfile: this.userProfile });
	}

	render() {
		const techLevels = [
			{
				id: "Beginner",
				icon: "🌱",
				title: "Beginner",
				subtitle: "I need detailed explanations for each step",
			},
			{
				id: "Intermediate",
				icon: "⚡",
				title: "Intermediate",
				subtitle: "I know the basics and can follow along",
			},
			{
				id: "Advanced",
				icon: "🚀",
				title: "Advanced",
				subtitle: "Just show me what to click, I'll figure it out",
			},
		];
		const learningStyle = [
			{
				id: "Step-by-step",
				icon: "",
				title: "Beginner",
				subtitle: "Detailed instructions with explanations",
			},
			{
				id: "Beginner",
				icon: "",
				title: "Quick guidance",
				subtitle: "Brief instructions, minimal text",
			},
			{
				id: "Visual only",
				icon: "",
				title: "Visual only",
				subtitle: "Just highlight what I need to interact with",
			},
		];

		const guidancePace = [
			{
				id: "Slow and steady",
				icon: "🐢",
				title: "Slow and steady",
				subtitle: "Wait for me to complete each step",
			},
			{
				id: "Moderate",
				icon: "🚶",
				title: "Moderate",
				subtitle: "Guide me with brief pauses between steps",
			},

			{
				id: "Fast",
				icon: "🏃",
				title: "Moderate",
				subtitle: "I'll keep up on my own pace",
			},
		];

		const item = (item, index) =>
			html`<li class="chip-item" style="--hue:${index * 40}">
				<label><input type="radio" name="profession" value="${item.value}" hidden /><span>${item.text}</span></label>
			</li>`;

		return html`<h2 style="margin-block:0.4em;text-align:center">Welcome to HandRail</h2 style="margin-block:0.5em" >
		<div>Your Profession</div>
		<ul class="professions" @change=${this.onProfessionUpdate.bind(this)}>
			${professions.map(item)}
		</ul>
		<input type="text" name="profession" hidden />
		
		<section class="prefrences">
			<div>
				<span>Tech Level</span>
				<ul @change=${this.techLevelUpdate.bind(this)}>
					${techLevels.map(
						(tech) => html`<li>
							<label>
								<input type="radio" name="tech-level" value="${tech.id}" hidden />
								<span>${tech.icon} ${tech.title}</span>
							</label>
						</li>`
					)}
				</ul>
			</div>
			<div>
				<span>Learning Style</span>
				<ul @change=${this.learningStyleUpdate.bind(this)}>
					${learningStyle.map(
						(style) => html`<li>
							<label>
								<input type="radio" name="learning-style" value="${style.id}" hidden />
								<span>${style.icon} ${style.title}</span>
							</label>
						</li>`
					)}
				</ul>
			</div>
			<div>
				<span>Guidance Pace</span>
				<ul @change=${this.guidancePaceUpdate.bind(this)}>
					${guidancePace.map(
						(pace) => html`<li>
							<label>
								<input type="radio" name="guidance-pace" value="${pace.id}" hidden />
								<span>${pace.icon} ${pace.title}</span>
							</label>
						</li>`
					)}
				</ul>
			</div>
		</section>

		<label>
				<span>Primary use case</span>
				<textarea @change=${this.onUseCaseUpdate.bind(this)}></textarea>
			</label>
			<button type="submit" @click=${this.onSubmit.bind(this)}>Get Started</button>`;
	}

	connectedCallback() {
		this.replaceChildren(this.render());
	}
}

customElements.define("onboarding-form", UserOnboardForm);
