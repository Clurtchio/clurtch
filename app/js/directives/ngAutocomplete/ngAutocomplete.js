// (function(){
angular.module( "ngAutocomplete", [])
  .directive('ngAutocomplete', function($location) {
    return {
      require: 'ngModel',
      scope: {
        ngModel: '=',
        options: '=?',
        details: '=?'
      },

      link: function(scope, element, attrs, controller) {

        //options for autocomplete
        var opts
        var watchEnter = false
        //convert options provided to opts
        var initOpts = function() {

          opts = {}
          if (scope.options) {

            if (scope.options.watchEnter !== true) {
              watchEnter = false
            } else {
              watchEnter = true
            }

            if (scope.options.types) {
              opts.types = []
              opts.types.push(scope.options.types)
              scope.gPlace.setTypes(opts.types)
            } else {
              scope.gPlace.setTypes([])
            }

            if (scope.options.bounds) {
              opts.bounds = scope.options.bounds
              scope.gPlace.setBounds(opts.bounds)
            } else {
              scope.gPlace.setBounds(null)
            }

            if (scope.options.country) {
              opts.componentRestrictions = {
                country: scope.options.country
              }
              scope.gPlace.setComponentRestrictions(opts.componentRestrictions)
            } else {
              scope.gPlace.setComponentRestrictions(null)
            }
          }
        }

        if (scope.gPlace == undefined) {
          scope.gPlace = new google.maps.places.Autocomplete(element[0], {});
        }
        google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
          var result = scope.gPlace.getPlace();
          if (result !== undefined) {
            if (result.address_components !== undefined) {

              scope.$apply(function() {

                scope.details = result;
                console.log(element)
                $location.path('/tab/menus/menu/' + scope.details.place_id)

                controller.$setViewValue(element.val());
              });
            }
            else {
              if (watchEnter) {
                getPlace(result)
              }
            }
          }
        })

        //function to get retrieve the autocompletes first result using the AutocompleteService
        var getPlace = function(result) {
          var autocompleteService = new google.maps.places.AutocompleteService();
          console.log(result)
          if (result.name.length > 0){
            autocompleteService.getPlacePredictions(
              {
                input: result.name,
                offset: result.name.length
              },
              function listentoresult(list, status) {
                if(list == null || list.length == 0) {

                  scope.$apply(function() {
                    scope.details = null;
                  });

                } else {

                  var placesService = new google.maps.places.PlacesService(element[0]);
                  placesService.getDetails(
                    {'reference': list[0].reference},
                    function detailsresult(detailsResult, placesServiceStatus) {

                      if (placesServiceStatus == google.maps.GeocoderStatus.OK) {
                        scope.$apply(function() {

                          controller.$setViewValue(detailsResult.formatted_address);
                          element.val(detailsResult.formatted_address);

                          scope.details = detailsResult;

                          //on focusout the value reverts, need to set it again.
                          var watchFocusOut = element.on('focusout', function(event) {
                            element.val(detailsResult.formatted_address);
                            element.unbind('focusout')
                          })

                        });
                      }
                    }
                  );
                }
              });
          }
        }

        controller.$render = function () {
          var location = controller.$viewValue;
          element.val(location);
        };

        //watch options provided to directive
        scope.watchOptions = function () {
          return scope.options
        };
        scope.$watch(scope.watchOptions, function () {
          log("hello")
          initOpts()
        }, true);

      }



    };
  })

.directive('disableTap', function($timeout) {
  return {
    link: function() {

      $timeout(function() {
        document.querySelector('.pac-container').setAttribute('data-tap-disabled', 'true')
      },500);
    }
  };
});
// }).call(this)