export async function extractPageThumbnail() {
	const meta1 = document.head.querySelector('meta[name="description"]');
	const description = meta1?.["content"] || document.title;

	const meta2 =
		document.head.querySelector('meta[property="og:image"]') ||
		document.head.querySelector('meta[name="twitter:image"]');
	return [description, meta2?.["content"]];
}

export function showToast(message, isErr) {
	if (globalThis.toast) return globalThis.toast(message);
	const toastElem = document.createElement("output");
	toastElem.id = "one-snackbar";
	toastElem.hidden = true;
	document.body.appendChild(toastElem);

	const cssStyleSheet = new CSSStyleSheet();
	cssStyleSheet.insertRule(`#one-snackbar {
        min-width: 20ch;
        font-size: 20px;
        background-color: #333;
        color: rgb(255, 208, 0);
        text-align: center;
        border-radius: 12px;
        padding: 4px 8px;
        position: fixed;
        z-index: 1000;
        margin-inline: auto;
		inset-inline: 0;
        bottom: 20px;
        width: max-content;
        translate: 0 200%;
        animation: in-out 5s ease-out;

		&.error {
			top: 20px;
			bottom: unset;
			background-color: red;
			color: white;
			translate: 0 -200%;
		}
    }`);

	cssStyleSheet.insertRule(`@keyframes in-out { 10%, 90% { translate: 0 0; } }`);
	document.adoptedStyleSheets.push(cssStyleSheet);

	globalThis.toast = (message, isErr) => {
		toastElem.className = isErr ? "error" : "";
		toastElem.hidden = false;
		toastElem.innerText = message;
		setTimeout(() => (toastElem.hidden = true), 5100);
	};
	toast(message, isErr);
}
