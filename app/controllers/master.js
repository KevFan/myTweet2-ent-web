const User = require('../models/user');
const Tweet = require('../models/tweet');
const Follow = require('../models/follow');
const sortHelper = require('../utils/sort');

/**
 * Finds all the users in the database and renders it in admin dashboard view
 */
exports.home = {
  handler: function (request, reply) {

    User.find({}).then(allUsers => {
      reply.view('adminDashboard', { title: 'Admin Dashboard', user: allUsers });
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

/**
 * Deletes a user and all associated tweets from the database
 */
exports.deleteUser = {
  handler: function (request, reply) {
    const userId = request.params.id;
    Tweet.remove({ tweetUser: userId }).then(success => {
      console.log('Successfully removed all tweets with user id:' + userId);
      return User.remove({ _id: userId });
    }).then(removeUserSuccess => {
      console.log('Successfully user with id:' + userId);
      reply.redirect('/admin');
    }).catch(err => {
      console.log('Something went wrong remove user and associated tweets :(');
      reply.redirect('/admin');
    });
  },
};

/**
 * Views a user dashboard and all associated tweets
 */
exports.viewUser = {
  handler: function (request, reply) {
    const userId = request.params.id;
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

      return Tweet.find({ tweetUser: { $in: userIds } }).populate('tweetUser');
    }).then(foundTweets => {
      // Sets isCurrentUser and admin to true to allow admin to delete all/specific tweets and add
      // user tweets
      reply.view('dashboard', {
        title: 'Tweet | Dashboard',
        tweets: sortHelper.sortDateTimeNewToOld(foundTweets),
        user: user,
        isCurrentUser: true,
        isAdmin: true,
        followers: followers,
        following: followings,
      });
    }).catch(err => {
      reply.redirect('/admin');
    });
  },
};

/**
 * Deletes all tweets and users from the database
 */
exports.deleteAllUserAndTweets = {
  handler: function (request, reply) {
    Tweet.remove({}).then(success => {
      console.log('Successfully removed all tweets');
      return User.remove({});
    }).then(removeUserSuccess => {
      console.log('Successfully removed all users');
      reply.redirect('/admin');
    }).catch(err => {
      console.log('Something went wrong removing all user and tweets :(');
      reply.redirect('/admin');
    });
  },
};
