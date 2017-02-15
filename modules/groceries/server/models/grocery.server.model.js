'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Grocery Schema
 */
var GrocerySchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Grocery List name',
    trim: true
  },
  item: {
    type: String,
    default: '',
    required: 'Please fill Item name',
    trim: true
  },
  quantity: {
    type: Number,
    default: '',
    required: 'Please fill Item quantity'
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Grocery', GrocerySchema);
