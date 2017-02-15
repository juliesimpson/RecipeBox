(function () {
  'use strict';

  describe('Groceries Controller Tests', function () {
    // Initialize global variables
    var GroceriesController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      GroceriesService,
      mockGrocery;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _GroceriesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      GroceriesService = _GroceriesService_;

      // create mock Grocery
      mockGrocery = new GroceriesService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Grocery Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Groceries controller.
      GroceriesController = $controller('GroceriesController as vm', {
        $scope: $scope,
        groceryResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleGroceryPostData;

      beforeEach(function () {
        // Create a sample Grocery object
        sampleGroceryPostData = new GroceriesService({
          name: 'Grocery Name'
        });

        $scope.vm.grocery = sampleGroceryPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (GroceriesService) {
        // Set POST response
        $httpBackend.expectPOST('api/groceries', sampleGroceryPostData).respond(mockGrocery);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Grocery was created
        expect($state.go).toHaveBeenCalledWith('groceries.view', {
          groceryId: mockGrocery._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/groceries', sampleGroceryPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Grocery in $scope
        $scope.vm.grocery = mockGrocery;
      });

      it('should update a valid Grocery', inject(function (GroceriesService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/groceries\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('groceries.view', {
          groceryId: mockGrocery._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (GroceriesService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/groceries\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup Groceries
        $scope.vm.grocery = mockGrocery;
      });

      it('should delete the Grocery and redirect to Groceries', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/groceries\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('groceries.list');
      });

      it('should should not delete the Grocery and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
