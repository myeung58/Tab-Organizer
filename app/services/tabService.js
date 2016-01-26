angular.module('app').service('TabService', function () {
  _this = this;
  this.currentWindowId;
  this.tabsInfo = {}; // { id: { createdAt: Date, visitedAt: Date, timesVisited: Int}, ...}
  this.sortable = []; // [[id, createdAt, visitedAt, timesVisited], ...]
  this.sortParams = {
    createdAt: 1,
    visitedAt: 2,
    timesVisited: 3
  };

  // set tabs and assign metrics eg. visit count, time since last visited
  this.init = function(windowId) {
    _this.currentWindowId = windowId;

    chrome.storage.sync.get('currentTabsInfo', function(storedItem) {
      var tabsInfo = storedItem.currentTabsInfo;
      _this.tabsInfo = storedItem.currentTabsInfo;
      _this.sortable = [];

      for (var tabId in tabsInfo) {
        if (tabsInfo[tabId].windowId === _this.currentWindowId) {
          _this.sortable.push([
            tabId,
            tabsInfo[tabId].createdAt,
            tabsInfo[tabId].visitedAt,
            tabsInfo[tabId].timesVisited
          ]);
        }
      }
    });
  };

  // save to chrome storage
  this.saveOpenedTabs = function() {
    chrome.storage.sync.set({'storedTabsInfo': _this.tabsInfo});
  };

  // load from chrome storage and open tabs
  this.openSavedTabs = function() {
    chrome.storage.sync.get('storedTabsInfo', function(storedItem) {
      var storedTabsInfo = storedItem.storedTabsInfo;

      if (storedTabsInfo) {
        for (var id in storedTabsInfo) {
          // if not already opened, open it
          if (!_this.tabsInfo[id]) {
            chrome.tabs.create({ url: storedTabsInfo[id].url }, function(tab) {
              // update storage with newly opened tab
              _this.tabsInfo[tab.id] = {
                createdAt: Date.now(),
                visitedAt: Date.now(),
                timesVisited: 1,
                url: tab.url
              };
            });
          }
        }
      }
    });
  };

  this.sortBy = function(param) {
    var sortable = _this.sortable,
        sortedTabsInfo = [],
        sortParamIndex = _this.sortParams[param];

    sortedTabsInfo = sortable.sort(function(a, b) {
      return a[sortParamIndex] - b[sortParamIndex];
    });

    _this.moveTabs(sortedTabsInfo);
  };

  this.moveTabs = function(sortedTabsInfo) {
    sortedTabsInfo.forEach(function(tabInfo, index) {
      chrome.tabs.move(parseInt(tabInfo[0]), { index: index });
    });
  };

  this.resetTabs = function() {
    this.tabsInfo = [];
  };

});
