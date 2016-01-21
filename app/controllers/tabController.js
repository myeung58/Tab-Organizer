angular.module('app').controller('tabController', function ($scope, TabService) {
  $scope.currentWindowId = -2;

  console.log('chrome.tabs ', chrome.tabs);

  // load tabs from storage
  chrome.storage.sync.get('currentTabsInfo', function(currentTabsInfo) {
    console.log('currentTabsInfo ', currentTabsInfo);
    TabService.init(currentTabsInfo);
  });


  $scope.saveOpenedTabs = function() {
    TabService.saveOpenedTabs();
  };

  $scope.loadSavedTabs = function() {

  };

  $scope.byDateTime = function() {
    // sort and move tabs
    // update tabsZenBackground with new tab setup
  };

  $scope.byTimesVisited = function() {

  };

  $scope.byLastVisit = function() {

  };

  // onCreate, set tab visit count and last opened date
  chrome.tabs.onCreated.addListener(function(tab) {

  });

  chrome.tabs.onActivated.addListener(function(tabId, windowId) {
  // onActivated, increase tab visit count

  });
});