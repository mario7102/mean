'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Pomodoro = mongoose.model('Pomodoro'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, pomodoro;

/**
 * Pomodoro routes tests
 */
describe('Pomodoro CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Pomodoro
    user.save(function () {
      pomodoro = {
        name: 'Pomodoro name'
      };

      done();
    });
  });

  it('should be able to save a Pomodoro if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Pomodoro
        agent.post('/api/pomodoros')
          .send(pomodoro)
          .expect(200)
          .end(function (pomodoroSaveErr, pomodoroSaveRes) {
            // Handle Pomodoro save error
            if (pomodoroSaveErr) {
              return done(pomodoroSaveErr);
            }

            // Get a list of Pomodoros
            agent.get('/api/pomodoros')
              .end(function (pomodorosGetErr, pomodorosGetRes) {
                // Handle Pomodoro save error
                if (pomodorosGetErr) {
                  return done(pomodorosGetErr);
                }

                // Get Pomodoros list
                var pomodoros = pomodorosGetRes.body;

                // Set assertions
                (pomodoros[0].user._id).should.equal(userId);
                (pomodoros[0].name).should.match('Pomodoro name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Pomodoro if not logged in', function (done) {
    agent.post('/api/pomodoros')
      .send(pomodoro)
      .expect(403)
      .end(function (pomodoroSaveErr, pomodoroSaveRes) {
        // Call the assertion callback
        done(pomodoroSaveErr);
      });
  });

  it('should not be able to save an Pomodoro if no name is provided', function (done) {
    // Invalidate name field
    pomodoro.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Pomodoro
        agent.post('/api/pomodoros')
          .send(pomodoro)
          .expect(400)
          .end(function (pomodoroSaveErr, pomodoroSaveRes) {
            // Set message assertion
            (pomodoroSaveRes.body.message).should.match('Please fill Pomodoro name');

            // Handle Pomodoro save error
            done(pomodoroSaveErr);
          });
      });
  });

  it('should be able to update an Pomodoro if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Pomodoro
        agent.post('/api/pomodoros')
          .send(pomodoro)
          .expect(200)
          .end(function (pomodoroSaveErr, pomodoroSaveRes) {
            // Handle Pomodoro save error
            if (pomodoroSaveErr) {
              return done(pomodoroSaveErr);
            }

            // Update Pomodoro name
            pomodoro.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Pomodoro
            agent.put('/api/pomodoros/' + pomodoroSaveRes.body._id)
              .send(pomodoro)
              .expect(200)
              .end(function (pomodoroUpdateErr, pomodoroUpdateRes) {
                // Handle Pomodoro update error
                if (pomodoroUpdateErr) {
                  return done(pomodoroUpdateErr);
                }

                // Set assertions
                (pomodoroUpdateRes.body._id).should.equal(pomodoroSaveRes.body._id);
                (pomodoroUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Pomodoros if not signed in', function (done) {
    // Create new Pomodoro model instance
    var pomodoroObj = new Pomodoro(pomodoro);

    // Save the pomodoro
    pomodoroObj.save(function () {
      // Request Pomodoros
      request(app).get('/api/pomodoros')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Pomodoro if not signed in', function (done) {
    // Create new Pomodoro model instance
    var pomodoroObj = new Pomodoro(pomodoro);

    // Save the Pomodoro
    pomodoroObj.save(function () {
      request(app).get('/api/pomodoros/' + pomodoroObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', pomodoro.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Pomodoro with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/pomodoros/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Pomodoro is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Pomodoro which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Pomodoro
    request(app).get('/api/pomodoros/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Pomodoro with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Pomodoro if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Pomodoro
        agent.post('/api/pomodoros')
          .send(pomodoro)
          .expect(200)
          .end(function (pomodoroSaveErr, pomodoroSaveRes) {
            // Handle Pomodoro save error
            if (pomodoroSaveErr) {
              return done(pomodoroSaveErr);
            }

            // Delete an existing Pomodoro
            agent.delete('/api/pomodoros/' + pomodoroSaveRes.body._id)
              .send(pomodoro)
              .expect(200)
              .end(function (pomodoroDeleteErr, pomodoroDeleteRes) {
                // Handle pomodoro error error
                if (pomodoroDeleteErr) {
                  return done(pomodoroDeleteErr);
                }

                // Set assertions
                (pomodoroDeleteRes.body._id).should.equal(pomodoroSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Pomodoro if not signed in', function (done) {
    // Set Pomodoro user
    pomodoro.user = user;

    // Create new Pomodoro model instance
    var pomodoroObj = new Pomodoro(pomodoro);

    // Save the Pomodoro
    pomodoroObj.save(function () {
      // Try deleting Pomodoro
      request(app).delete('/api/pomodoros/' + pomodoroObj._id)
        .expect(403)
        .end(function (pomodoroDeleteErr, pomodoroDeleteRes) {
          // Set message assertion
          (pomodoroDeleteRes.body.message).should.match('User is not authorized');

          // Handle Pomodoro error error
          done(pomodoroDeleteErr);
        });

    });
  });

  it('should be able to get a single Pomodoro that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Pomodoro
          agent.post('/api/pomodoros')
            .send(pomodoro)
            .expect(200)
            .end(function (pomodoroSaveErr, pomodoroSaveRes) {
              // Handle Pomodoro save error
              if (pomodoroSaveErr) {
                return done(pomodoroSaveErr);
              }

              // Set assertions on new Pomodoro
              (pomodoroSaveRes.body.name).should.equal(pomodoro.name);
              should.exist(pomodoroSaveRes.body.user);
              should.equal(pomodoroSaveRes.body.user._id, orphanId);

              // force the Pomodoro to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Pomodoro
                    agent.get('/api/pomodoros/' + pomodoroSaveRes.body._id)
                      .expect(200)
                      .end(function (pomodoroInfoErr, pomodoroInfoRes) {
                        // Handle Pomodoro error
                        if (pomodoroInfoErr) {
                          return done(pomodoroInfoErr);
                        }

                        // Set assertions
                        (pomodoroInfoRes.body._id).should.equal(pomodoroSaveRes.body._id);
                        (pomodoroInfoRes.body.name).should.equal(pomodoro.name);
                        should.equal(pomodoroInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Pomodoro.remove().exec(done);
    });
  });
});
