// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(
  function (tabId, changeInfo, tab) {
    var re = /^https?:\/\/scrumy\.com/i;
    if (re.test(tab.url)) {
      // ... show the page action.
      chrome.pageAction.show(tabId);
    }
  }
);
