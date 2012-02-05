
var TNR = {};

// Wrapper function for logging
TNR.log = function(message) {
  if (1 && message)
    console.log("TNR: " + message);
};


// Prefix the page title with tab's index
TNR.setTitle = function() {
  var titleRegex = /^\[\d+\] /
  var title = document.title;

  if (title == "" || title == "New Tab") {
    TNR.log("setting timeout");
    setTimeout(500, TNR.setTitle, this);
    return;
  }

  if (this.titleSet)
    title = title.replace(titleRegex, "");
  document.title = "[" + this.idx + "] " + title;
  this.titleSet = true;
};


// Handle requests from background page
TNR.handleRequest = function(message, sender, sendResponse) {
  switch (message.header) {
    case "set":
      TNR.idx = message.idx;
      TNR.setTitle.call(TNR); // Set 'this' to TNR
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
