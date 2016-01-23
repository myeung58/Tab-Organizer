var tabsZenBackground = (function() {
  var currentWindowId,
      currentTabsInfo = {},
      actions = {
        sync: function() {
          chrome.storage.sync.set({'currentTabsInfo': currentTabsInfo});
        },
        createDefaultTabInfo: function(tabId, windowId, url) {
          currentTabsInfo[tabId] = {
            windowId: windowId,
            createdAt: Date.now(),
            visitedAt: Date.now(),
            timesVisited: 1,
            url: url
          };
        },
        getCurrentWindow: function() {
          chrome.windows.getCurrent({}, function(window) {
            currentWindowId = window.id;
          });
        },
        getCurrentTabs: function() {
          var sync = this.sync,
              createDefaultTabInfo = this.createDefaultTabInfo;

          chrome.tabs.query({
            windowId: currentWindowId,
            windowType: 'normal'
          }, function(tabs) {
            tabs.forEach(function(tab) {
              if (!currentTabsInfo[tab.id]) { createDefaultTabInfo(tab.id, tab.windowId, tab.url);}
            });
            sync();
          });
        },
        bindWindowFocus: function() {
          chrome.windows.onFocusChanged.addListener(function(windowId) {
            currentWindowId = windowId;
          });
        },
        bindTabCreate: function() {
          var sync = this.sync,
              createDefaultTabInfo = this.createDefaultTabInfo;

          chrome.tabs.onCreated.addListener(function(tab) {
            createDefaultTabInfo(tab.id, tab.windowId, tab.url);
            sync();
          });
        },
        bindTabRemove: function() {
          var sync = this.sync;

          chrome.tabs.onRemoved.addListener(function(tabId) {
            if (currentTabsInfo[tabId]) {
              delete currentTabsInfo[tabId];
              sync();
            }
          });
        },
        bindTabUpdate: function() {
          var sync = this.sync;

          chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
            if (changeInfo.url && currentTabsInfo[tabId]) {
              currentTabsInfo[tabId].url = changeInfo.url;
              sync();
            }
          });
        },
        bindTabActivate: function() {
          var sync = this.sync;

          chrome.tabs.onActivated.addListener(function(tab) {
            if (currentTabsInfo[tab.tabId]) {
              currentTabsInfo[tab.tabId].visitedAt = Date.now();
              currentTabsInfo[tab.tabId].timesVisited += 1;
            }
            sync();
          });
        }
      };

  return {
    init: function() {
      actions.getCurrentWindow();
      actions.getCurrentTabs();
      actions.bindWindowFocus();
      actions.bindTabCreate();
      actions.bindTabRemove();
      actions.bindTabUpdate();
      actions.bindTabActivate();
    }
  };
})();

tabsZenBackground.init();
