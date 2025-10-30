import "../../panel/js/reset.js";
import "../components/tutorial-extract-container.js";
import { getCrtTab } from "../../panel/js/extractor.js";
import { PreviousTutorialList } from "../components/tutorials/tutorial-history.js";
import { UserOnboardForm } from "../components/onboard/onboarding-carousel.js";
import { TutorialExtractContainer } from "../components/tutorial-extract-container.js";

import baseCss from "../style/base.css" with { type: "css" };
document.adoptedStyleSheets.push(baseCss);

getStore("userProfile").then(async ({ userProfile }) => {
	if (!userProfile) {
		import("../components/onboard/onboarding-carousel.js");
		document.body.append(new UserOnboardForm());
	} else {
		const tab = await getCrtTab();
		if (tab.url?.startsWith("https://www.youtube.com/watch?v="))
			document.body.appendChild(new TutorialExtractContainer());
		else document.body.appendChild(new PreviousTutorialList());
	}
});
