
var TNR = {};


// Wrapper function for logging
TNR.log = function(message) {
  if (1 && message)
    console.log("TNR: " + message);
};


TNR.timeout = function(id, func, timeout) {
  var key = "timeout-" + id;
  if (TNR[key])
    clearTimeout(TNR[key]);
  TNR[key] = setTimeout(func, timeout);
}

// Prefix the page title with tab's index
TNR.setTitle = function() {
  var titleRegex = /^\[\d+\] /
  var title = document.title;

  if (TNR.titleSet)
    title = title.replace(titleRegex, "");
  document.title = "[" + TNR.idx + "] " + title;
  TNR.titleSet = true;
  TNR.timeout("settitle", TNR.setTitle, 15000);
};


// Handle requests from background page
TNR.handleRequest = function(message, sender, sendResponse) {
  switch (message.header) {
    case "set":
      TNR.idx = message.idx;
      TNR.setTitle();
      break;

    default:
      TNR.log("Unknown message");
      break;
  }

  sendResponse({});
};


// Do initialization
TNR.init = function() {
  // Register callback to handle set request
  chrome.extension.onRequest.addListener(TNR.handleRequest);

  // Notify the background page that we to be assigned a new number
  // Background page can find the sender's tab id
  chrome.extension.sendRequest({"header": "new"});
};


TNR.titleSet = false;
TNR.init();

TNR.log("Ready");

// vim:set tw=80 sw=2:
