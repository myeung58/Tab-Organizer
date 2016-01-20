angular.module('app').controller('tabController', function ($scope, TabService) {
  $scope.currentWindowId = -2;
  console.log($scope.currentWindowId);
  console.log('chrome.tabs ', chrome.tabs);
  chrome.tabs.query({windowId: $scope.currentWindowId}, function(tabs) {
    TabService.tabs = tabs;
    console.log(TabService.tabs);
  });

  $scope.saveOpenedTabs = function() {
    TabService.saveOpenedTabs();
  };

  // // onCreated, onMoved, onRemoved, onAttached, onDetached
  // chrome.tabs.onCreated.addListener(function(value) {
  // });
  // chrome.tabs.onMoved.addListener(function(tabId, changeInfo) {
  //   // tabId: Integer eg. 1341
  //   // changeInfo: Object {fromIndex: 15, toIndex: 14, windowId: 24}
  // });
  // // onUpdated eg. when URL is set
  // chrome.tabs.onUpdated.addListener(function(value) {
  // });

  // chrome.tabs.onReplaced.addListener(function(value) {
  // });

  $scope.byDateTime = function() {

  };

  $scope.byTimesVisited = function() {

  };

  $scope.byLastVisit = function() {

  };
  // onActivated, increase tab visit count
});