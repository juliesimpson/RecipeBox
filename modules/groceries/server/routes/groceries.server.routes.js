'use strict';

/**
 * Module dependencies
 */
var groceriesPolicy = require('../policies/groceries.server.policy'),
  groceries = require('../controllers/groceries.server.controller');

module.exports = function(app) {
  // Groceries Routes
  app.route('/api/groceries').all(groceriesPolicy.isAllowed)
    .get(groceries.list)
    .post(groceries.create);

  app.route('/api/groceries/:groceryId').all(groceriesPolicy.isAllowed)
    .get(groceries.read)
    .put(groceries.update)
    .delete(groceries.delete);

  // Finish by binding the Grocery middleware
  app.param('groceryId', groceries.groceryByID);
};
