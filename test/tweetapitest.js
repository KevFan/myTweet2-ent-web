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

  // test('get all user tweets', function () {
  //   const allUsersUrl = 'http://localhost:4000/api/users';
  //   let res = request('GET', allUsersUrl);
  //   const users = JSON.parse(res.getBody('utf8'));
  //
  //   const allUserTweetsUrl = 'http://localhost:4000/api/tweets/users/' + users[0]._id;
  //   res = request('GET', allUserTweetsUrl);
  //   const tweets = JSON.parse(res.getBody('utf8'));
  //
  //   assert.equal(2, tweets.length);
  //   assert.equal(tweets[0].tweetText, 'First Tweet Test');
  //   assert.equal(tweets[0].tweetDate, '2017-07-31T22:04:00.000Z');
  //   assert.equal(tweets[0].tweetUser, users[0]._id);
  //   assert.equal(tweets[1].tweetText, 'Second Tweet Test');
  //   assert.equal(tweets[1].tweetDate, '2017-08-31T16:19:00.000Z');
  //   assert.equal(tweets[1].tweetUser, users[0]._id);
  // });
  //
  // test('delete all user tweets', function () {
  //   // Get all users
  //   const allUsersUrl = 'http://localhost:4000/api/users';
  //   let res = request('GET', allUsersUrl);
  //   const users = JSON.parse(res.getBody('utf8'));
  //
  //   // Get all tweets of homer id - should have 1 left due to 1 being deleted in delete test above
  //   const allUserTweetsUrl = 'http://localhost:4000/api/tweets/users/' + users[0]._id;
  //   res = request('GET', allUserTweetsUrl);
  //   const tweets = JSON.parse(res.getBody('utf8'));
  //
  //   assert.equal(1, tweets.length);
  //   assert.equal(tweets[0].tweetText, 'Second Tweet Test');
  //   assert.equal(tweets[0].tweetDate, '2017-08-31T16:19:00.000Z');
  //   assert.equal(tweets[0].tweetUser, users[0]._id);
  //
  //   request('DELETE', allUserTweetsUrl);
  //
  //   res = request('GET', allUserTweetsUrl);
  //   const afterDeleteTweets = JSON.parse(res.getBody('utf8'));
  //
  //   assert.equal(0, afterDeleteTweets.length);
  // });
});
