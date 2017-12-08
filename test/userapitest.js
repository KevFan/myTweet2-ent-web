'use strict';

const assert = require('chai').assert;
const TweetService = require('./tweet-service');
const fixtures = require('./fixtures.json');
const _ = require('lodash');

suite('User API tests', function () {

  let users = fixtures.users;
  let newUser = fixtures.newUser;

  const tweetService = new TweetService('http://localhost:4000');

  beforeEach(function () {
    tweetService.deleteAllUsers();
  });

  afterEach(function () {
    tweetService.deleteAllUsers();
  });

  test('create a user', function () {
    const returnedUser = tweetService.createUser(newUser);
    assert(_.some([returnedUser], newUser), 'returnedUser must be a superset of of newUser');
    assert.isDefined(returnedUser._id);
  });

  test('get user', function () {
    const user1 = tweetService.createUser(newUser);
    const user2 = tweetService.getUser(user1._id);
    assert.deepEqual(user1, user2);
  });

  test('get invalid user', function () {
    const user1 = tweetService.getUser('1234');
    assert.isNull(user1);
    const user2 = tweetService.getUser('012345678901234567890123');
    assert.isNull(user2);
  });

  test('delete a user', function () {
    const user = tweetService.createUser(newUser);
    assert(tweetService.getUser(user._id) != null);
    tweetService.deleteOneUser(user._id);
    assert(tweetService.getUser(user._id) == null);
  });

  test('get all users', function () {
    for (let user of users) {
      tweetService.createUser(user);
    }

    const allUser = tweetService.getUsers();
    assert.equal(allUser.length, users.length);
  });

  test('get users detail', function () {
    for (let user of users) {
      tweetService.createUser(user);
    }

    const allUser = tweetService.getUsers();
    for (let i = 0; i < users.length; i++) {
      assert(_.some([allUser[i]], users[i]), 'user in allUser must be a superset of users at same index');
    }
  });

  test('get all users empty', function () {
    const allUsers = tweetService.getUsers();
    assert.equal(allUsers.length, 0);
  });
});
