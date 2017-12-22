'use strict';

const assert = require('chai').assert;
const TweetService = require('./tweet-service');
const fixtures = require('./fixtures.json');
const bcrypt = require('bcrypt');

suite('User API tests', function () {

  let users = fixtures.users;
  let newUser = fixtures.newUser;

  const tweetService = new TweetService('http://localhost:4000');

  beforeEach(function () {
    tweetService.login(users[0]);
  });

  afterEach(function () {
    tweetService.logout();
  });

  test('create a user', function () {
    const returnedUser = tweetService.createUser(newUser);
    assert.equal(newUser.firstName, returnedUser.firstName);
    assert.equal(newUser.lastName, returnedUser.lastName);
    assert.equal(newUser.email, returnedUser.email);
    assert.isTrue(bcrypt.compareSync(newUser.password, returnedUser.password));
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

  // test('get all users', function () {
  //   for (let user of users) {
  //     tweetService.createUser(user);
  //   }
  //
  //   const allUser = tweetService.getUsers();
  //   assert.equal(allUser.length, users.length);
  // });

  test('get users detail', function () {
    for (let user of users) {
      tweetService.createUser(user);
    }

    const allUser = tweetService.getUsers();
    for (let i = 0; i < users.length; i++) {
      assert.equal(users[i].firstName, allUser[i].firstName);
      assert.equal(users[i].lastName, allUser[i].lastName);
      assert.equal(users[i].email, allUser[i].email);
      assert.isTrue(bcrypt.compareSync(users[i].password, allUser[i].password));
    }
  });

  // test('get all users empty', function () {
  //   const allUsers = tweetService.getUsers();
  //   assert.equal(allUsers.length, 0);
  // });

  test('update a user', function () {
    let returnedUser = tweetService.createUser(newUser);
    assert.equal(returnedUser.firstName, newUser.firstName);
    returnedUser.firstName = 'update';
    returnedUser.password = 'test';
    tweetService.updateUser(returnedUser._id, returnedUser);
    returnedUser = tweetService.getUser(returnedUser._id);
    assert.equal(returnedUser.firstName, 'update');
    assert.isTrue(bcrypt.compareSync('test', returnedUser.password));
  });
});
