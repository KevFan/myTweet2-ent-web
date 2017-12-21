const User = require('../models/user');
const Admin = require('../models/admin');
const Tweet = require('../models/tweet');
const Follow = require('../models/follow');
const sortHelper = require('../utils/sort');
const deleteFromCloud = require('../utils/pictureHelpers');

/**
 * Finds all the users in the database and renders it in admin dashboard view
 */
exports.home = {
  handler: function (request, reply) {
    let admin = null;
    let users = null;
    let tweets = null;
    Admin.findOne({ _id: request.auth.credentials.loggedInUser }).then(foundAdmin => {
      admin = foundAdmin;
      return User.find({});
    }).then(allUsers => {
      users = allUsers;
      return Tweet.find({});
    }).then(foundTweets => {
      tweets = foundTweets;
      return Follow.find({});
    }).then(foundFollows => {
      if (admin) {
        reply.view('adminDashboard', {
          title: 'Admin Dashboard', user: users, numUsers: users.length, numTweets: tweets.length,
          numFollows: foundFollows.length,
        });
      } else {
        console.log('Not an admin');
        reply.redirect('/');
      }
    }).catch(err => {
      reply.redirect('/');
      console.log(err);
    });
  },
};

/**
 * Deletes a user and all associated tweets from the database
 */
exports.deleteUser = {
  handler: function (request, reply) {
    const userId = request.params.id;
    Tweet.find({ tweetUser: userId }).then(foundTweets => {
      for (let tweet of foundTweets) {
        deleteFromCloud(tweet.tweetImage);
      }

      return Tweet.remove({ tweetUser: userId });
    }).then(success => {
      console.log('Successfully removed all tweets with user id:' + userId);
      return User.findOne({ _id: userId });
    }).then(foundUser => {
      deleteFromCloud(foundUser.image);
      return User.remove({ _id: userId });
    }).then(removeUserSuccess => {
      console.log('Successfully user with id:' + userId);
      return Follow.remove({ follower: userId });
    }).then(removedFollowers => {
      console.log('Successfully removed ' + userId + ' from follower listing');
      return Follow.remove({ following: userId });
    }).then(removedFollowing => {
      console.log('Successfully removed ' + userId + ' from following listing');
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
    let admin = null;
    let followers = null;
    let user = null;
    let followings = null;

    Admin.findOne({ _id: request.auth.credentials.loggedInUser }).then(foundAdmin => {
      admin = foundAdmin;
      return User.findOne({ _id: userId });
    }).then(foundUser => {
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
      if (admin) {
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
      } else {
        console.log('Not an admin');
        reply.redirect('/');
      }
    }).catch(err => {
      console.log(err);
      reply.redirect('/admin');
    });
  },
};

/**
 * Deletes all tweets and users from the database
 */
exports.deleteAllUserAndTweets = {
  handler: function (request, reply) {
    Tweet.find({}).then(foundTweets => {
      for (let tweet of foundTweets) {
        deleteFromCloud(tweet.tweetImage);
      }

      return Tweet.remove({});
    }).then(success => {
      console.log('Successfully removed all tweets');
      return User.find({});
    }).then(foundUser => {
      for (let user of foundUser) {
        deleteFromCloud(user.image);
      }

      return User.remove({});
    }).then(removeUserSuccess => {
      console.log('Successfully removed all users');
      return Follow.remove({});
    }).then(removedFollows => {
      console.log('Successfully removed all follows');
      reply.redirect('/admin');
    }).catch(err => {
      console.log('Something went wrong removing all user and tweets :(');
      reply.redirect('/admin');
    });
  },
};
