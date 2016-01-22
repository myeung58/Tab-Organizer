var tabsZenBackground = (function() {
  var currentWindowId = -2,
      currentTabsInfo = {},
      actions = {
        sync: function() {
          console.log('syncing');
          chrome.storage.sync.set({'currentTabsInfo': currentTabsInfo});
        },
        createDefaultTabInfo: function(tabId, url) {
          currentTabsInfo[tabId] = {
            createdAt: Date.now(),
            visitedAt: Date.now(),
            timesVisited: 1,
            url: url
          };
        },
        getCurrentTabs: function() {
          var sync = this.sync,
              createDefaultTabInfo = this.createDefaultTabInfo;

          chrome.tabs.query({windowId: currentWindowId}, function(tabs) {
            tabs.forEach(function(tab) {
              if (!currentTabsInfo[tab.id]) { createDefaultTabInfo(tab.id, tab.url);}
            });
            sync();
          });
        },
        bindTabCreate: function() {
          var sync = this.sync,
              createDefaultTabInfo = this.createDefaultTabInfo;

          chrome.tabs.onCreated.addListener(function(tab) {
            createDefaultTabInfo(tab.id, tab.url);
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
        bindTabActivate: function() {
          var sync = this.sync;

          chrome.tabs.onActivated.addListener(function(tab) {
            // test on multiple windows
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
      actions.getCurrentTabs();
      actions.bindTabCreate();
      actions.bindTabRemove();
      actions.bindTabActivate();
    }
  };
})();

tabsZenBackground.init();
