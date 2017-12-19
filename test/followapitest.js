'use strict';

const assert = require('chai').assert;
const TweetService = require('./tweet-service');
const fixtures = require('./fixtures.json');
const _ = require('lodash');

suite('Follow API tests', function () {

  const tweetService = new TweetService('http://localhost:4000');

  let users = fixtures.users;
  let newFollow = {};
  beforeEach(function () {
    for (let user of users) {
      tweetService.createUser(user);
    }

    const allUser = tweetService.getUsers();
    newFollow = {
      'follower': allUser[0]._id,
      'following': allUser[1]._id,
    };
  });

  afterEach(function () {
    tweetService.deleteAllUsers();
  });

  test('follow a user', function () {
    const allUser = tweetService.getUsers();
    const returnedFollow = tweetService.follow(newFollow);
    assert.equal(allUser[0]._id, returnedFollow.follower);
    assert.equal(allUser[1]._id, returnedFollow.following);
    assert.isDefined(returnedFollow._id);
  });

  test('get followers', function () {
    const allUser = tweetService.getUsers();
    const follower1 = tweetService.follow(newFollow);
    const follower2 = tweetService.getFollowers(follower1.following);
    assert(_.some([follower1], newFollow), 'follower1 must be a superset of newFollow');
    assert.deepEqual(allUser[0], follower2[0].follower);
  });

  test('get followings', function () {
    const allUser = tweetService.getUsers();
    const follower1 = tweetService.follow(newFollow);
    const follower2 = tweetService.getFollowings(follower1.follower);
    assert(_.some([follower1], newFollow), 'follower1 must be a superset of newFollow');
    assert.deepEqual(allUser[1], follower2[0].following);
  });

  test('unfollow a user', function () {
    const allUser = tweetService.getUsers();
    tweetService.follow(newFollow);

    assert(tweetService.getFollowings(allUser[0]._id) !== null);
    assert(tweetService.getFollowings(allUser[0]._id).length === 1);
    tweetService.unfollow(allUser[0]._id, allUser[1]._id);
    assert(tweetService.getFollowings(allUser[0]._id).length === 0);
  });
});
