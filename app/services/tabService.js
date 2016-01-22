// refactor all chrome actions into ChromeService

angular.module('app').service('TabService', function () {
  _this = this;
  this.tabsInfo = [];
  this.sortable = []; // [[id, createdAt, visitedAt, timesVisited], ...]
  this.sortParams = {
    createdAt: 1,
    visitedAt: 2,
    timesVisited: 3
  };

  // set tabs and assign metrics eg. visit count, time since last visited
  this.init = function() {
    chrome.storage.sync.get('currentTabsInfo', function(storedItem) {
      console.log('current tabs info (obj): ', storedItem);
      console.log('storedItem.tabsInfo: ', storedItem.currentTabsInfo);
      // _this.tabsInfo = storedItem.currentTabsInfo;
      var tabsInfo = storedItem.currentTabsInfo;
      _this.sortable = [];
      for (var tabInfo in tabsInfo) {
        _this.sortable.push([
          tabInfo,
          tabsInfo[tabInfo].createdAt,
          tabsInfo[tabInfo].visitedAt,
          tabsInfo[tabInfo].timesVisited
        ]);
      }
      console.log('sortable: ', _this.sortable);
    });
  };

  this.saveOpenedTabs = function() {
    // save to chrome storage
    console.log();
    chrome.storage.sync.set({'storedTabsInfo': _this.tabsInfo}, function() {
      console.log('saved');
    });
  };

  this.openSavedTabs = function() {
    // load from chrome storage
    var storedTabsInfo;

    chrome.storage.sync.get('storedTabsInfo', function(tabsInfo) {
      storedTabsInfo = tabsInfo;
      // open tabs in chrome
      console.log(storedTabsInfo);

      storedTabsInfo.forEach(function(tabInfo) {
        // dont open the ones that are already opened?
        chrome.tabs.create({ url: tabInfo.url });
      });
    });
  };

  this.sortBy = function(param) {
    var sortable = _this.sortable,
        sortedTabsInfo = [],
        sortParamIndex = _this.sortParams[param]; // arr

    sortedTabsInfo = sortable.sort(function(a, b) {
      return a[sortParamIndex] - b[sortParamIndex];
    });

    console.log('sorted by ' + param + ': ', sortedTabsInfo);
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
