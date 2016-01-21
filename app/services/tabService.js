angular.module('app').service('TabService', function () {
  _this = this;
  this.defaultTabVisitCount = 1;
  this.tabs = [];

  // set tabs and assign metrics eg. visit count, time since last visited
  this.init = function(tabsInfo) {
    console.log('current tabs (array): ', tabsInfo);
    tabsInfo.forEach(function(tabInfo) {
      // set visit count and time since last visited
      if (!tabInfo.timesVisited) { tabInfo.timesVisited = _this.defaultTabVisitCount; }
      if (!tabInfo.visitedAt) { tabInfo.visitedAt = Date.now(); }
    });
    _this.tabsInfo = tabsInfo;
  };

  this.saveOpenedTabs = function() {
    // save to chrome storage
    console.log('reached service');
    chrome.storage.sync.set({'storedTabs': _this.tabs}, function() {
      console.log('saved');
    });
  };

  this.loadSavedTabs = function() {
    // load from chrome storage
    chrome.storage.sync.get('storedTabs', function(storedItems) {
      console.log('loaded: ', storedItems);
    });
  };

  this.byDateTime = function() {
    // sort tabs based on criteria
    // loop through tabs, move them around with new index passed in
  };

  this.resetTabs = function() {
    this.tabs = [];
  };
});
