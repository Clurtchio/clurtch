(function() {
  angular.module('app.modules.tabs.menus', ['app.modules.tabs.menus.controllers', 'app.modules.tabs.menus.services']).config(function($stateProvider, $urlRouterProvider) {
    return $stateProvider.state("tab.menus", {
      url: "/menus",
      views: {
        "tab-menus": {
          templateUrl: "js/modules/tabs/menus/views/menus.html",
          controller: "MenusCtrl as vm"
        }
      }
    }).state("tab.menus-map", {
      url: "/menus/map",
      views: {
        "tab-menus": {
          templateUrl: "js/modules/states/map/views/menusMap.html",
          controller: "MenusMapCtrl as vm"
        }
      }
    }).state("tab.menus-item", {
      url: '/menus/item/:itemId',
      views: {
        "tab-menus": {
          templateUrl: "js/modules/states/item/item.html",
          controller: "ItemCtrl as vm"
        }
      }
    }).state("tab.menus-menu", {
      url: '/menus/menu/:menu_id',
      views: {
        "tab-menus": {
          templateUrl: "js/modules/states/menu/menu.html",
          controller: "MenuCtrl as vm"
        }
      }
    });
  });

}).call(this);
