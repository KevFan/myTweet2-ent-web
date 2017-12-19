'use strict';

const Follow = require('../models/follow');

/**
 * Follow a user
 */
exports.follow = {
  handler: function (request, reply) {
    let followData = request.payload;
    followData.follower = request.auth.credentials.loggedInUser;
    console.log(followData);
    Follow.create(followData).then(newFollowing => {
      reply.redirect('/view/' + followData.following);
    }).catch(err => {
      console.log(err);
      reply.redirect('/home');
    });
  },
};

exports.unfollow = {
  handler: function (request, reply) {
    Follow.remove({ follower: request.auth.credentials.loggedInUser, following: request.params.id }).then(unFollowed => {
      reply.redirect('/view/' + request.params.id);
    }).catch(err => {
      console.log(err);
      reply.redirect('/home');
    });
  },
};