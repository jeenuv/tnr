
function log(message) {
  console.log(message);
}

function updateWindow(w) {
  chrome.tabs.query({ "windowId": w }, function (tabs) {
        log("Updating " + tabs.length + " tabs");
        for (var i in tabs)
          chrome.tabs.sendRequest(tabs[i].id,
            { "header": "set", "idx": parseInt(tabs[i].index) + 1 });
      });
}


// Handle notification from content script
function requestHandler(message, sender, sendResponse) {
  log("requestHandler");
  var respose = {};

  switch (message.header) {
    case "new": {
      if (!sender.tab) {
        log("No tab information");
        break;
      }

      updateWindow(sender.tab.windowId);
      break;
    }
  }

  sendResponse(respose);
}


// Update window when a new tab is attached
chrome.tabs.onAttached.addListener(function(tabId, attachInfo) {
    log("onAttached");
    updateWindow(attachInfo.newWindowId);
    });


// Update window when a tab is detached
chrome.tabs.onDetached.addListener(function(tabId, dettachInfo) {
    log("onDetached");
    updateWindow(dettachInfo.oldWindowId);
    });


// Update window when a tab is moved within the same window
chrome.tabs.onMoved.addListener(function(tabId, moveInfo) {
    log("onMoved");
    updateWindow(moveInfo.windowId);
    });


// Update window when a tab is closed
chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
    log("onRemoved");
      // Only update if the window survives
      if (!removeInfo.isWindowClosing)
        chrome.tabs.get(tabId, function(tab) {
          updateWindow(tab.windowId);
      });
    });


// We don't register handler for onCreate. This is because default title for new
// tab is "New Tab".  It can't be changed by setting document.title. Move over
// the content script won't be executed until content is load on to the tab.
// Thus we ask the content script to notify s when it's possible to set a title.
chrome.extension.onRequest.addListener(requestHandler);


// vim:set tw=80 sw=2:
