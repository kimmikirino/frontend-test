'use strict';
/* global angular, confirm */

var fazenda = angular.module('fazenda', [
  'ngRoute',
  'compiledTemplates',
  'appConfig',
  'fazendaServices'
]);

fazenda.config(['$routeProvider', '$httpProvider',
    function($routeProvider, $httpProvider) {
        $httpProvider.defaults.withCredentials = false;

        $routeProvider
            .when('/fazenda', {
                templateUrl: 'components/fazenda.html',
                controller: 'fazendaController'
            })
            .otherwise({
              redirectTo: '/fazenda'
            });
    }
]);

fazenda.run(['$rootScope', '$location', function($rootScope, $location) {
}]);

/************************************************************************************************
 * Controllers
 ************************************************************************************************/
fazenda.controller('fazendaController', ['$scope', '$rootScope', 'fazendaServices', '$sce',
  function( $scope, $rootScope, fazendaServices, $sce) {
    let success = function(data) {
      $scope.list = data.data.map(function (item, index) {
        item.positive = parseInt(item.positive);
        item.negative = parseInt(item.negative);
        item.total = item.positive + item.negative;
        if(item.positive) {
          item.positivePerc = Math.round((item.positive/item.total)*100);
        } else {
          item.positivePerc = item.positive = 0;
        }

        if(item.negative) {
          item.negativePerc = Math.round((item.negative/item.total)*100);
        } else {
          item.negativePerc = item.negative = 0;
        }

        item.description = $sce.trustAsHtml(item.description);
        return item;
      });
      console.log($scope.list);
    };

    fazendaServices.getFazendaData(success);
  }]);

/************************************************************************************************
 * Directives
 ************************************************************************************************/
fazenda.directive('personCard', ['$rootScope', '$location',  function ( $rootScope, $location) {
    return {
        restrict: 'E',
        templateUrl:  'components/partials/personCard.html',
        replace: true,
        link: function (scope, iElm, iAttrs, controller) {
        }
    };
}]);

