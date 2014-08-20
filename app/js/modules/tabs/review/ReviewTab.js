(function() {
  angular.module('app.modules.tabs.review', ['app.modules.tabs.review.controllers'])
    .config(function($stateProvider, $urlRouterProvider) {
      return $stateProvider.state("tab.review", {
        url: "/review",
        views: {
          "tab-review": {
            templateUrl: "js/modules/tabs/review/views/review.html",
            controller: 'ReviewMenuCtrl as reviewMenu'
          }
        },
        resolve: {
          locationData: function() {
            return {
              lat: window.currLocation.coords.latitude,
              lng: window.currLocation.coords.longitude,
              dist: 0.6
            };
          },
          reviewMenuInit: function(Menu, BackgroundGeo) {
            var coords = this.resolve.locationData();
            return Menu.getByLocation(coords, null)
              .then(function(menus) {
                // Add distance from user to each menu.
                _.each(menus, function(menu) {
                  menu.dist = BackgroundGeo.distance(menu.latitude, menu.longitude);
                })
                return menus;
              });
          }
        }
      }).state("tab.review-choose-item", {
        url: '/review/choose-item/:businessId',
        views: {
          "tab-review": {
            templateUrl: 'js/modules/tabs/review/views/chooseItem.html',
            controller: 'ReviewItemCtrl as vm'
          }
        }
      }).state("tab.review-create-item", {
        url: '/review/create-item',
        views: {
          "tab-review": {
            templateUrl: 'js/modules/tabs/review/views/create-item.html',
            controller: 'createItemCtrl as vm'
          }
        }
      }).state("tab.review-create", {
        url: '/review/create/:itemId',
        views: {
          "tab-review": {
            templateUrl: 'js/modules/tabs/review/views/create.html',
            controller: 'createReviewCtrl as vm'
          }
        }
      });
    });

}).call(this);
