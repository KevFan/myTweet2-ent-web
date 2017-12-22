'use strict';

const assert = require('chai').assert;
const TweetService = require('./tweet-service');
const fixtures = require('./fixtures.json');
const _ = require('lodash');

suite('Tweet API tests', function () {
  let users = fixtures.users;
  let tweets = fixtures.tweets;
  let newUser = fixtures.newUser;

  const tweetService = new TweetService('http://localhost:4000');

  beforeEach(function () {
    tweetService.login(users[0]);
    tweetService.deleteAllTweets();
  });

  afterEach(function () {
    tweetService.deleteAllTweets();
    tweetService.logout();
  });

  test('create a tweet', function () {
    tweetService.createTweet(tweets[0]);
    const returnedTweets = tweetService.getTweets();
    assert.equal(returnedTweets.length, 1);
    assert.isDefined(returnedTweets[0].tweetUser);
    assert.equal(returnedTweets[0].tweetUser.email, users[0].email);
    assert(_.some([returnedTweets[0]], tweets[0]), 'returned tweet must be a superset of tweets');
  });

  test('create multiple tweets', function () {
    for (let i = 0; i < tweets.length; i++) {
      tweetService.createTweet(tweets[i]);
    }

    const returnedTweets = tweetService.getTweets();
    assert.equal(returnedTweets.length, tweets.length);
    for (let i = 0; i < tweets.length; i++) {
      assert(_.some([returnedTweets[i]], tweets[i]), 'returned donation must be a superset of donation');
    }
  });

  test('delete all tweets', function () {
    for (let i = 0; i < tweets.length; i++) {
      tweetService.createTweet(tweets[i]);
    }

    const tweets1 = tweetService.getTweets();
    assert.equal(tweets1.length, tweets.length);
    tweetService.deleteAllTweets();
    const tweets2 = tweetService.getTweets();
    assert.equal(tweets2.length, 0);
  });

  test('get all tweets', function () {
    for (let tweet of tweets) {
      tweetService.createTweet(tweet);
    }

    const alltweets = tweetService.getTweets();
    assert.equal(alltweets.length, tweets.length);
  });

  test('get tweet', function () {
    const tweet1 = tweetService.createTweet(tweets[0]);
    const tweet2 = tweetService.getTweet(tweet1._id);
    assert.deepEqual(tweet1, tweet2);
  });

  test('delete a tweet', function () {
    const tweet = tweetService.createTweet(tweets[0]);
    assert(tweetService.getTweet(tweet._id) != null);
    tweetService.deleteOneTweet(tweet._id);
    assert(tweetService.getTweet(tweet._id) == null);
  });

  test('get all user tweets', function () {
    const users = tweetService.getUsers();
    let userTweets = tweetService.getUserTweets(users[0]._id);
    assert.equal(userTweets.length, 0);
    for (let i = 0; i < tweets.length; i++) {
      tweetService.createTweet(tweets[i]);
    }

    userTweets = tweetService.getUserTweets(users[0]._id);
    assert.equal(userTweets.length, 3);
    userTweets = tweetService.getUserTweets(users[1]._id);
    assert.equal(userTweets.length, 0);
  });

  test('delete all user tweets', function () {
    const users = tweetService.getUsers();
    let userTweets = tweetService.getUserTweets(users[0]._id);
    assert.equal(userTweets.length, 0);
    for (let i = 0; i < tweets.length; i++) {
      tweetService.createTweet(tweets[i]);
    }

    userTweets = tweetService.getUserTweets(users[0]._id);
    assert.equal(userTweets.length, 3);
    tweetService.deleteAllUserTweets(users[0]._id);
    userTweets = tweetService.getUserTweets(users[0]._id);
    assert.equal(userTweets.length, 0);
  });
});
