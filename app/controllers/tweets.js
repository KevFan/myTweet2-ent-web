'use strict';
const User = require('../models/user');
const Tweet = require('../models/tweet');
const Follow = require('../models/follow');
const sortHelper = require('../utils/sort');
const cloudinary = require('cloudinary');
const deleteFromCloud = require('../utils/pictureHelpers');

try {
  const env = require('../../.data/.env.json');
  cloudinary.config(env.cloudinary);
}
catch (e) {
  console.log('Cloudinary credentials file not found, profile picture options disabled - see README.md');
}

let mapAPIKey = null;
try {
  mapAPIKey = require('../../.data/googleMapsAPkey.json');}
catch (e) {
  console.log('Google Maps API file not found');
}

/**
 * User home, finds the user details and all associated tweets
 */
exports.home = {
  handler: function (request, reply) {
    const userId = request.auth.credentials.loggedInUser;
    let followers = null;
    let user = null;
    let followings = null;

    User.findOne({ _id: userId }).then(foundUser => {
      user = foundUser;
      return Follow.find({ follower: userId }).populate('following');
    }).then(foundFollowings => {
      followings = foundFollowings;
      return Follow.find({ following: userId }).populate('follower');
    }).then(foundFollowers => {
      followers = foundFollowers;

      // Array of userIds for to find/merge following tweets
      let userIds = [];
      userIds.push(userId);
      for (let following of followings) {
        userIds.push(following.following._id);
      }

      return Tweet.find({ tweetUser: { $in: userIds } }).populate('tweetUser').populate('marker');
    }).then(foundTweets => {
      if (user) {
        reply.view('dashboard', {
          title: 'Tweet | Dashboard',
          tweets: sortHelper.sortDateTimeNewToOld(foundTweets),
          user: user,
          isCurrentUser: true,
          followers: followers,
          following: followings,
          mapKey: mapAPIKey.apiKey,
        });
      } else {
        console.log('not a user');
        reply.redirect('/');
      }
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
  payload: {
    maxBytes: 209715200,
    output: 'stream',
    parse: true,
  },

  handler: function (request, reply) {
    const userId = request.params.userid;
    let tweetData = request.payload;
    tweetData.tweetUser = userId;
    const stream = cloudinary.v2.uploader.upload_stream(function (error, uploadResult) {
      console.log(uploadResult);
      if (uploadResult) {
        tweetData.tweetImage = uploadResult.url;
      }

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
    });

    tweetData.picture.pipe(stream);
  },
};

/**
 * Sends the global time line view with all the tweets sorted by most recent date
 */
exports.globalTimeline = {
  handler: function (request, reply) {
    let user = null;
    User.findOne({ _id: request.auth.credentials.loggedInUser }).then(foundUser => {
      user = foundUser;
      return Tweet.find({}).populate('tweetUser').populate('marker');
    }).then(allTweets => {
      if (user) {
        reply.view('globalTimeline', {
          tweets: sortHelper.sortDateTimeNewToOld(allTweets),
          mapKey: mapAPIKey.apiKey,
        });
      } else {
        reply.view('globalTimeline', {
          tweets: sortHelper.sortDateTimeNewToOld(allTweets),
          isAdmin: true,
          mapKey: mapAPIKey.apiKey,
        });
      }
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
    Tweet.findOne({ _id: tweetId }).then(foundTweet => {
      deleteFromCloud(foundTweet.tweetImage);
      return Tweet.findOneAndRemove({ _id: tweetId });
    }).then(success => {
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
    Tweet.find({ tweetUser: userId }).then(foundTweets => {
      for (let tweet of foundTweets) {
        deleteFromCloud(tweet.tweetImage);
      }

      return Tweet.remove({ tweetUser: userId });
    }).then(success => {
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
      // let tweetsFound = null;
      let user = null;
      let followings = null;
      let followers = null;
      User.findOne({ _id: userId }).then(foundUser => {
        user = foundUser;
        return Follow.find({ follower: userId }).populate('following');
      }).then(foundFollowings => {
        followings = foundFollowings;
        return Follow.find({ following: userId }).populate('follower');
      }).then(foundFollowers => {
        followers = foundFollowers;

        // Array of userIds for to find/merge following tweets
        let userIds = [];
        userIds.push(userId);
        for (let following of followings) {
          userIds.push(following.following._id);
        }

        return Tweet.find({ tweetUser: { $in: userIds } }).populate('tweetUser').populate('marker');
      }).then(userTweets => {
        reply.view('dashboard', {
          title: user.firstName + ' ' + user.lastName + ' | TimeLine',
          tweets: sortHelper.sortDateTimeNewToOld(userTweets),
          user: user,
          isCurrentUser: false,
          followers: followers,
          following: followings,
          mapKey: mapAPIKey.apiKey,
        });
      }).catch(err => {
        console.log('Tried to view all tweets with user id : ' + userId + ' but something went wrong :(');
        reply.redirect('/home');
      });
    }
  },
};
