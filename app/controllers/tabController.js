angular.module('app').controller('tabController', function ($scope, TabService) {
  $scope.currentWindowId = -2;

  console.log('chrome.tabs ', chrome.tabs);

  // load tabs from storage
  TabService.init();

  $scope.saveOpenedTabs = function() {
    TabService.saveOpenedTabs();
  };

  $scope.openSavedTabs = function() {
    TabService.openSavedTabs();
  };

  $scope.sortBy = function(param) {
    TabService.sortBy(param);
  };
});