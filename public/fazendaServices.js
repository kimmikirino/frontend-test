'use strict';
/* global angular, $http, topicType, apontadorConfig */
var fazendaServices = angular.module('fazendaServices', ['ngResource']);

fazendaServices.service('fazendaServices', ['$http', function($http){

    this.getFazendaData = function (callbackFunction) {
      return $http({
        method: 'GET',
        url: '/data/fazenda.json'
      }).success(callbackFunction || function() {});
    };
}]);
