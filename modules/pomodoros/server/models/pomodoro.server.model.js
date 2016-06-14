'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Pomodoro Schema
 */
var PomodoroSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Pomodoro name',
    trim: true
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

mongoose.model('Pomodoro', PomodoroSchema);
