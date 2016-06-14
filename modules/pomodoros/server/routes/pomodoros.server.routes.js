'use strict';

/**
 * Module dependencies
 */
var pomodorosPolicy = require('../policies/pomodoros.server.policy'),
  pomodoros = require('../controllers/pomodoros.server.controller');

module.exports = function(app) {
  // Pomodoros Routes
  app.route('/api/pomodoros').all(pomodorosPolicy.isAllowed)
    .get(pomodoros.list)
    .post(pomodoros.create);

  app.route('/api/pomodoros/:pomodoroId').all(pomodorosPolicy.isAllowed)
    .get(pomodoros.read)
    .put(pomodoros.update)
    .delete(pomodoros.delete);

  // Finish by binding the Pomodoro middleware
  app.param('pomodoroId', pomodoros.pomodoroByID);
};
