'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Pomodoro = mongoose.model('Pomodoro'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Pomodoro
 */
exports.create = function(req, res) {
  var pomodoro = new Pomodoro(req.body);
  pomodoro.user = req.user;

  pomodoro.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(pomodoro);
    }
  });
};

/**
 * Show the current Pomodoro
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var pomodoro = req.pomodoro ? req.pomodoro.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  pomodoro.isCurrentUserOwner = req.user && pomodoro.user && pomodoro.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(pomodoro);
};

/**
 * Update a Pomodoro
 */
exports.update = function(req, res) {
  var pomodoro = req.pomodoro ;

  pomodoro = _.extend(pomodoro , req.body);

  pomodoro.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(pomodoro);
    }
  });
};

/**
 * Delete an Pomodoro
 */
exports.delete = function(req, res) {
  var pomodoro = req.pomodoro ;

  pomodoro.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(pomodoro);
    }
  });
};

/**
 * List of Pomodoros
 */
exports.list = function(req, res) { 
  Pomodoro.find().sort('-created').populate('user', 'displayName').exec(function(err, pomodoros) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(pomodoros);
    }
  });
};

/**
 * Pomodoro middleware
 */
exports.pomodoroByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Pomodoro is invalid'
    });
  }

  Pomodoro.findById(id).populate('user', 'displayName').exec(function (err, pomodoro) {
    if (err) {
      return next(err);
    } else if (!pomodoro) {
      return res.status(404).send({
        message: 'No Pomodoro with that identifier has been found'
      });
    }
    req.pomodoro = pomodoro;
    next();
  });
};
