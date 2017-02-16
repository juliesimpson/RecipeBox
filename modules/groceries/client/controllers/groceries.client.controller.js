(function () {
  'use strict';

  // Groceries controller
  angular
    .module('groceries')
    .controller('GroceriesController', GroceriesController);

  GroceriesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'groceryResolve'];

  function GroceriesController ($scope, $state, $window, Authentication, grocery) {
    var vm = this;

    vm.authentication = Authentication;
    vm.grocery = grocery;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.groceryList = [];
    vm.addItem = addItem;
     
    // add items to list array
    function addItem(item) {
      vm.groceryList.push(item);

      item = '';
    }

    // Remove existing Grocery
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.grocery.$remove($state.go('groceries.list'));
      }
    }

    // Save Grocery
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.groceryForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.grocery._id) {
        vm.grocery.$update(successCallback, errorCallback);
      } else {
        vm.grocery.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('groceries.view', {
          groceryId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
