var weightDict = {
	"100" : "Thin",
	"200" : "ExtraLight",
	"300" : "Light",
	"400" : "Regular",
	"500" : "Medium",
	"600" : "SemiBold",
	"700" : "Bold",
	"800" : "ExtraBold",
	"900" : "Black"
};

function GIconStyle(){
return "@font-face {\n" +
	  "font-family: 'Material Icons';\n" +
	  "font-style: normal;\n" +
	  "font-weight: 400;\n" +
	  "src: local('Material Icons'),\n" +
	       "local('MaterialIcons-Regular'),\n" +
	       "url('" + browser.extension.getURL("icons/google/MaterialIcons-Regular.woff2") + "') format('woff2');\n" +
	"}\n\n" +

	".material-icons {\n" +
	  "font-family: 'Material Icons';\n" +
	  "font-weight: normal;\n" +
	  "font-style: normal;\n" +
	  "font-size: 24px;  /* Preferred icon size */\n" +
	  "display: inline-block;\n" +
	  "line-height: 1;\n" +
	  "text-transform: none;\n" +
	  "letter-spacing: normal;\n" +
	  "word-wrap: normal;\n" +
	  "white-space: nowrap;\n" +
	  "direction: ltr;\n\n" +

	  "/* Support for all WebKit browsers. */\n" +
	  "-webkit-font-smoothing: antialiased;\n" +
	  "/* Support for Safari and Chrome. */\n" +
	  "text-rendering: optimizeLegibility;\n\n" +

	  "/* Support for Firefox. */\n" +
	  "-moz-osx-font-smoothing: grayscale;";
}

function getSub(weight, isItalic) {
	if (weight == "400")
		return (isItalic ? "Italic" : "Regular");
	else
		return (weightDict[weight] + (isItalic ? " Italic" : ""));
}

function degoogleapi(requestDetails) {
	var fontStr = requestDetails.url.slice(requestDetails.url.indexOf('=') + 1);

	if (fontStr.includes('&'))
		fontStr = fontStr.slice(0, fontStr.indexOf('&'));

	var fontList = fontStr.split("|");
	for (var i = 0; i < fontList.length; i++){
		fontList[i] = fontList[i].split(":");
		fontList[i][0] = fontList[i][0].replace(/\+/g," ");
		if (fontList[i].length > 1)
			fontList[i][1] = fontList[i][1].split(",");
		else if (fontList[i].length == 1)
			fontList[i].push(["400"]);
	}

	console.log(fontList);

	var styles = "/* Fontastic was here! */"

	for (var i = 0; i < fontList.length; i++){
		var fFamily = fontList[i][0];
		for (var j = 0; j < fontList[i][1].length; j++) {
			var sub = fontList[i][1][j];
			var fWeight = sub.replace(/\D/g, "");
			var fStyle = (sub.includes('i') ? "italic" : "regular");
			var fSub = getSub(fWeight, sub.includes('i'));
			var fName = (fFamily + "-" + fSub).replace(/\s/g, "");
			styles += "\n@font-face { " +
				"font-family: \'" + fFamily + "\'; " +
				"font-style: " + fStyle + "; " +
				"font-weight: " + fWeight + "; " +
				"src: local(\'" + fFamily + " " + fSub + "\'), local(\'" + fName + "\'), url(\'" + browser.extension.getURL("fonts/" + fFamily.replace(/\s/g, "-").toLowerCase() + "/" + fWeight + ((fStyle == "italic") ? "italic" : "") + ".woff2") + "\') format(\'woff2\'); }";
		}
	}

	console.log(styles);
	browser.tabs.insertCSS(requestDetails.tabId, {code: styles, runAt: "document_start"});

	return {cancel: true};
}

function deGIcons(req) {
	console.log(GIconStyle());
	browser.tabs.insertCSS(req.tabId, {code: GIconStyle(), runAt: "document_start"});
	return {cancel: true};
}

//TODO: Get back to work on intercepting font requests from gstatic, and add back the "webNavigation" permission when ready to do so.
/**
function degstatic(req) {
	browser.webNavigation.getFrame({ tabId: req.tabId, frameId: req.parentFrameId }).then(console.log, console.log);
	return;
}
**/

browser.webRequest.onBeforeRequest.addListener(
	degoogleapi,
	{urls:["*://fonts.googleapis.com/css?family=*"], types:["stylesheet", "font"]},
	["blocking"]
);

browser.webRequest.onBeforeRequest.addListener(
	deGIcons,
	{urls:["*://fonts.googleapis.com/icon?family=Material+Icons"], types:["stylesheet", "font"]}, ["blocking"]
);

browser.webRequest.onBeforeRequest.addListener(
	degstatic,
	{urls:["*://fonts.gstatic.com/*"], types:["font"]},
	["blocking"]
);
