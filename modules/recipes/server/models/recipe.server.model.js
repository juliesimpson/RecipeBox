'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Recipe Schema
 */
var RecipeSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Recipe name',
    trim: true
  },
  category: {
    type: String,
    default: '',
    required: 'Please select a category',
    trim: true
  },
  link: {
    type: String,
    default: '',
    required: 'Please fill Recipe link'
  },
  notes: {
    type: String,
    default: '',
    // required: 'Please fill in Recipe notes'
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

mongoose.model('Recipe', RecipeSchema);
