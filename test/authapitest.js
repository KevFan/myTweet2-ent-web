'use strict';

const assert = require('chai').assert;
const TweetService = require('./tweet-service');
const fixtures = require('./fixtures.json');
const utils = require('../app/api/utils.js');

suite('Authenticate API tests', function () {

  let users = fixtures.users;

  const tweetService = new TweetService('http://localhost:4000');

  test('login-logout', function () {
    let returnedTweets = tweetService.getTweets();
    assert.isNull(returnedTweets);

    const response = tweetService.login(users[0]);
    returnedTweets = tweetService.getTweets();
    assert.isNotNull(returnedTweets);

    tweetService.logout();
    returnedTweets = tweetService.getTweets();
    assert.isNull(returnedTweets);
  });
});
