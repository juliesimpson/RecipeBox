// Groceries service used to communicate Groceries REST endpoints
(function () {
  'use strict';

  angular
    .module('groceries')
    .factory('GroceriesService', GroceriesService);
    

  GroceriesService.$inject = ['$resource'];

  function GroceriesService($resource) {
    return $resource('api/groceries/:groceryId', {
      groceryId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
