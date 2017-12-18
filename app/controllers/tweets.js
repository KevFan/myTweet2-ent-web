'use strict';
const User = require('../models/user');
const Tweet = require('../models/tweet');
const Follow = require('../models/follow');
const sortHelper = require('../utils/sort');

/**
 * User home, finds the user details and all associated tweets
 */
exports.home = {
  handler: function (request, reply) {
    const userId = request.auth.credentials.loggedInUser;
    let userTweets = null;
    let user = null;
    let followers = null;
    Tweet.find({ tweetUser: userId }).populate('tweetUser').then(allUserTweets => {
      userTweets = sortHelper.sortDateTimeNewToOld(allUserTweets);
      return User.findOne({ _id: userId });
    }).then(foundUser => {
      user = foundUser;
      return Follow.find({ follower: userId }).populate('following');
    }).then(foundFollowers => {
      followers = foundFollowers;
      return Follow.find({ following: userId }).populate('follower');
    }).then(foundFollowing => {
      reply.view('dashboard', {
        title: 'Tweet | Dashboard',
        tweets: userTweets,
        user: user,
        isCurrentUser: true,
        followers: followers,
        following: foundFollowing,
      });
    }).catch(err => {
      console.log(err);
      reply.redirect('/');
    });
  },

};

/**
 * Add a tweet associated with a userId that is passed in as a parameter
 */
exports.addTweet = {
  handler: function (request, reply) {
    const userId = request.params.userid;
    let tweetData = request.payload;
    tweetData.tweetUser = userId;
    console.log(tweetData);
    Tweet.create(tweetData).then(newTweet => {
      // If the user id, is the same as the loggedInUserId, redirect to user dashboard
      if (userId === request.auth.credentials.loggedInUser) {
        reply.redirect('/home');
      } // Else redirect to admin view of user dashboard
      else {
        reply.redirect('/viewUser/' + userId);
      }
    }).catch(err => {
      console.log('Tried to add tweet but Something went wrong :(');
      reply.redirect('/home');
    });
  },
};

/**
 * Sends the global time line view with all the tweets sorted by most recent date
 */
exports.globalTimeline = {
  handler: function (request, reply) {
    Tweet.find({}).populate('tweetUser').then(allTweets => {
      reply.view('globalTimeline', { tweets: sortHelper.sortDateTimeNewToOld(allTweets) });
    }).catch(err => {
      console.log('Tried to get all tweets but Something went wrong :(');
      reply.redirect('/home');
    });
  },
};

/**
 * Deletes a specific tweet by id. User id is also passed in to determine whether it's the user or
 * a admin is deleting a tweet
 */
exports.deleteSpecificTweet = {
  handler: function (request, reply) {
    const tweetId = request.params.id;
    const userId = request.params.userid;
    Tweet.findOneAndRemove({ _id: tweetId }).then(success => {
      console.log('Successfully deleted tweet: ' + request.params.id);
      if (userId === request.auth.credentials.loggedInUser) {
        reply.redirect('/home');
      } else {
        reply.redirect('/viewUser/' + userId);
      }
    }).catch(err => {
      console.log('Tried to delete tweet: ' + tweetId + ' but something went wrong :(');
      reply.redirect('/home');
    });
  },
};

/**
 * Delete all tweets associated with a user Id
 */
exports.deleteAllUserTweets = {
  handler: function (request, reply) {
    const userId = request.params.userid;
    Tweet.remove({ tweetUser: userId }).then(success => {
      console.log('Successfully deleted all tweets with user id: ' + userId);
      if (userId === request.auth.credentials.loggedInUser) {
        reply.redirect('/home');
      } else {
        reply.redirect('/viewUser/' + userId);
      }
    }).catch(err => {
      console.log('Tried to delete all tweets with user id : ' + userId + ' but something went wrong :(');
      reply.redirect('/home');
    });
  },
};

/**
 * User view of another user's dashboard of tweets
 */
exports.viewUserTimeline = {
  handler: function (request, reply) {
    const userId = request.params.id;
    if (userId === request.auth.credentials.loggedInUser) {
      reply.redirect('/home');
    } else {
      let tweetsFound = null;
      Tweet.find({ tweetUser: userId }).populate('tweetUser').then(userTweets => {
        console.log('Successfully found all tweets with user id: ' + userId);
        tweetsFound = sortHelper.sortDateTimeNewToOld(userTweets);
        return User.findOne({ _id: userId });
      }).then(foundUser => {
        reply.view('dashboard', {
          title: foundUser.firstName + ' ' + foundUser.lastName + ' | TimeLine',
          tweets: tweetsFound,
          user: foundUser,
          isCurrentUser: false,
        });
      }).catch(err => {
        console.log('Tried to view all tweets with user id : ' + userId + ' but something went wrong :(');
        reply.redirect('/home');
      });
    }
  },
};
