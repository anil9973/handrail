export function detectUILibraries() {
	const libraries = {
		React: {
			detected:
				typeof React !== "undefined" ||
				typeof ReactDOM !== "undefined" ||
				!!document.querySelector("[data-reactroot], [data-reactid]"),
		},
		"Vue.js": {
			detected: typeof Vue !== "undefined" || !!document.querySelector("[data-vue-app]") || !!window.__VUE__,
		},
		Angular: {
			detected: typeof angular !== "undefined" || !!document.querySelector("[ng-version], [ng-app]") || !!window.ng,
		},
		jQuery: {
			detected: typeof jQuery !== "undefined" || typeof $ !== "undefined",
		},
		Bootstrap: {
			detected: !!document.querySelector('link[href*="bootstrap"], script[src*="bootstrap"]'),
		},
		"Material-UI": {
			detected: !!document.querySelector('.Mui, [class*="Mui"]') || typeof MaterialUI !== "undefined",
		},
		"Ant Design": {
			detected: !!document.querySelector('.ant, [class*="ant-"]') || typeof antd !== "undefined",
		},
		"Tailwind CSS": {
			detected:
				!!document.querySelector('[class*="bg-"], [class*="text-"], [class*="p-"], [class*="m-"]') ||
				!!document.querySelector("style").textContent.includes("tailwind"),
		},
		Foundation: {
			detected: !!document.querySelector(".row, .column, .columns") || typeof Foundation !== "undefined",
		},
		Svelte: {
			detected: !!document.querySelector("[data-svelte]") || typeof svelte !== "undefined",
		},
	};

	// Check for CSS framework indicators
	const stylesheets = Array.from(document.styleSheets);
	stylesheets.forEach((sheet) => {
		try {
			const href = sheet.href || "";
			if (href.includes("bootstrap")) libraries["Bootstrap"].detected = true;
			if (href.includes("material")) libraries["Material-UI"].detected = true;
			if (href.includes("antd")) libraries["Ant Design"].detected = true;
			if (href.includes("tailwind")) libraries["Tailwind CSS"].detected = true;
			if (href.includes("foundation")) libraries["Foundation"].detected = true;
		} catch (e) {
			// Cross-origin stylesheet, skip
		}
	});

	return Object.entries(libraries)
		.filter(([_, lib]) => lib.detected)
		.map(([name, _]) => name);
}
