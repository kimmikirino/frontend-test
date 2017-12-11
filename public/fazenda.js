'use strict';
/* global angular, confirm */

var fazenda = angular.module('fazenda', [
  'ngRoute',
  'compiledTemplates',
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
          item.positivePerc = $scope.calcPercentage(item.positive,item.total);
        } else {
          item.positivePerc = item.positive = 0;
        }

        if(item.negative) {
          item.negativePerc =  $scope.calcPercentage(item.negative,item.total);
        } else {
          item.negativePerc = item.negative = 0;
        }

        item.description = $sce.trustAsHtml(item.description);
        return item;
      });
    };

    $scope.calcPercentage = function(value, total) {
      return Math.round((value/total)*100);
    };

    fazendaServices.getFazendaData(success);
  }]);
