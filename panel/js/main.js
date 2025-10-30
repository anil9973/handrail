import "./reset.js"
import "../components/utils/atom-icon.js"
import "../components/utils/alert-toast.js"
import "../components/handrail-panel.js";
// @ts-ignore
import baseCss from "../style/base.css" with { type: "css" };
import panelCss from "../style/panel.css" with { type: "css" };
document.adoptedStyleSheets.push(baseCss, panelCss);
