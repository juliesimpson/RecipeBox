'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Grocery = mongoose.model('Grocery'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Grocery
 */
exports.create = function(req, res) {
  var grocery = new Grocery(req.body);
  grocery.user = req.user;

  grocery.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(grocery);
    }
  });
};

/**
 * Show the current Grocery
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var grocery = req.grocery ? req.grocery.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  grocery.isCurrentUserOwner = req.user && grocery.user && grocery.user._id.toString() === req.user._id.toString();

  res.jsonp(grocery);
};

/**
 * Update a Grocery
 */
exports.update = function(req, res) {
  var grocery = req.grocery;

  grocery = _.extend(grocery, req.body);

  grocery.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(grocery);
    }
  });
};

/**
 * Delete an Grocery
 */
exports.delete = function(req, res) {
  var grocery = req.grocery;

  grocery.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(grocery);
    }
  });
};

/**
 * List of Groceries
 */
exports.list = function(req, res) {
  Grocery.find().sort('-created').populate('user', 'displayName').exec(function(err, groceries) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(groceries);
    }
  });
};

/**
 * Grocery middleware
 */
exports.groceryByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Grocery is invalid'
    });
  }

  Grocery.findById(id).populate('user', 'displayName').exec(function (err, grocery) {
    if (err) {
      return next(err);
    } else if (!grocery) {
      return res.status(404).send({
        message: 'No Grocery with that identifier has been found'
      });
    }
    req.grocery = grocery;
    next();
  });
};
