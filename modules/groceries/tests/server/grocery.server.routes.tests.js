'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Grocery = mongoose.model('Grocery'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  grocery;

/**
 * Grocery routes tests
 */
describe('Grocery CRUD tests', function () {

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

    // Save a user to the test db and create new Grocery
    user.save(function () {
      grocery = {
        name: 'Grocery name'
      };

      done();
    });
  });

  it('should be able to save a Grocery if logged in', function (done) {
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

        // Save a new Grocery
        agent.post('/api/groceries')
          .send(grocery)
          .expect(200)
          .end(function (grocerySaveErr, grocerySaveRes) {
            // Handle Grocery save error
            if (grocerySaveErr) {
              return done(grocerySaveErr);
            }

            // Get a list of Groceries
            agent.get('/api/groceries')
              .end(function (groceriesGetErr, groceriesGetRes) {
                // Handle Groceries save error
                if (groceriesGetErr) {
                  return done(groceriesGetErr);
                }

                // Get Groceries list
                var groceries = groceriesGetRes.body;

                // Set assertions
                (groceries[0].user._id).should.equal(userId);
                (groceries[0].name).should.match('Grocery name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Grocery if not logged in', function (done) {
    agent.post('/api/groceries')
      .send(grocery)
      .expect(403)
      .end(function (grocerySaveErr, grocerySaveRes) {
        // Call the assertion callback
        done(grocerySaveErr);
      });
  });

  it('should not be able to save an Grocery if no name is provided', function (done) {
    // Invalidate name field
    grocery.name = '';

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

        // Save a new Grocery
        agent.post('/api/groceries')
          .send(grocery)
          .expect(400)
          .end(function (grocerySaveErr, grocerySaveRes) {
            // Set message assertion
            (grocerySaveRes.body.message).should.match('Please fill Grocery name');

            // Handle Grocery save error
            done(grocerySaveErr);
          });
      });
  });

  it('should be able to update an Grocery if signed in', function (done) {
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

        // Save a new Grocery
        agent.post('/api/groceries')
          .send(grocery)
          .expect(200)
          .end(function (grocerySaveErr, grocerySaveRes) {
            // Handle Grocery save error
            if (grocerySaveErr) {
              return done(grocerySaveErr);
            }

            // Update Grocery name
            grocery.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Grocery
            agent.put('/api/groceries/' + grocerySaveRes.body._id)
              .send(grocery)
              .expect(200)
              .end(function (groceryUpdateErr, groceryUpdateRes) {
                // Handle Grocery update error
                if (groceryUpdateErr) {
                  return done(groceryUpdateErr);
                }

                // Set assertions
                (groceryUpdateRes.body._id).should.equal(grocerySaveRes.body._id);
                (groceryUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Groceries if not signed in', function (done) {
    // Create new Grocery model instance
    var groceryObj = new Grocery(grocery);

    // Save the grocery
    groceryObj.save(function () {
      // Request Groceries
      request(app).get('/api/groceries')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Grocery if not signed in', function (done) {
    // Create new Grocery model instance
    var groceryObj = new Grocery(grocery);

    // Save the Grocery
    groceryObj.save(function () {
      request(app).get('/api/groceries/' + groceryObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', grocery.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Grocery with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/groceries/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Grocery is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Grocery which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Grocery
    request(app).get('/api/groceries/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Grocery with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Grocery if signed in', function (done) {
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

        // Save a new Grocery
        agent.post('/api/groceries')
          .send(grocery)
          .expect(200)
          .end(function (grocerySaveErr, grocerySaveRes) {
            // Handle Grocery save error
            if (grocerySaveErr) {
              return done(grocerySaveErr);
            }

            // Delete an existing Grocery
            agent.delete('/api/groceries/' + grocerySaveRes.body._id)
              .send(grocery)
              .expect(200)
              .end(function (groceryDeleteErr, groceryDeleteRes) {
                // Handle grocery error error
                if (groceryDeleteErr) {
                  return done(groceryDeleteErr);
                }

                // Set assertions
                (groceryDeleteRes.body._id).should.equal(grocerySaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Grocery if not signed in', function (done) {
    // Set Grocery user
    grocery.user = user;

    // Create new Grocery model instance
    var groceryObj = new Grocery(grocery);

    // Save the Grocery
    groceryObj.save(function () {
      // Try deleting Grocery
      request(app).delete('/api/groceries/' + groceryObj._id)
        .expect(403)
        .end(function (groceryDeleteErr, groceryDeleteRes) {
          // Set message assertion
          (groceryDeleteRes.body.message).should.match('User is not authorized');

          // Handle Grocery error error
          done(groceryDeleteErr);
        });

    });
  });

  it('should be able to get a single Grocery that has an orphaned user reference', function (done) {
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

          // Save a new Grocery
          agent.post('/api/groceries')
            .send(grocery)
            .expect(200)
            .end(function (grocerySaveErr, grocerySaveRes) {
              // Handle Grocery save error
              if (grocerySaveErr) {
                return done(grocerySaveErr);
              }

              // Set assertions on new Grocery
              (grocerySaveRes.body.name).should.equal(grocery.name);
              should.exist(grocerySaveRes.body.user);
              should.equal(grocerySaveRes.body.user._id, orphanId);

              // force the Grocery to have an orphaned user reference
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

                    // Get the Grocery
                    agent.get('/api/groceries/' + grocerySaveRes.body._id)
                      .expect(200)
                      .end(function (groceryInfoErr, groceryInfoRes) {
                        // Handle Grocery error
                        if (groceryInfoErr) {
                          return done(groceryInfoErr);
                        }

                        // Set assertions
                        (groceryInfoRes.body._id).should.equal(grocerySaveRes.body._id);
                        (groceryInfoRes.body.name).should.equal(grocery.name);
                        should.equal(groceryInfoRes.body.user, undefined);

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
      Grocery.remove().exec(done);
    });
  });
});
