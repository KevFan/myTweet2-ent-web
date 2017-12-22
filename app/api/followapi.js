'use strict';

const Follow = require('../models/follow');
const Boom = require('boom');

/**
 * Find all followers
 */
exports.findFollowers = {
  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    Follow.find({ following: request.params.id }).populate('follower').then(foundFollowers => {
      if (foundFollowers) {
        reply(foundFollowers);
      }

      reply(Boom.notFound('id not found'));
    }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },
};

/**
 * Find all followings
 */
exports.findFollowings = {
  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    Follow.find({ follower: request.params.id }).populate('following').then(foundFollowings => {
      if (foundFollowings) {
        reply(foundFollowings);
      }

      reply(Boom.notFound('id not found'));
    }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },
};

/**
 * Follow a user
 */
exports.follow = {
  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    const follow = new Follow(request.payload);
    follow.save().then(newFollow => {
      reply(newFollow).code(201);
    }).catch(err => {
      reply(Boom.badImplementation('error creating follower/following'));
    });
  },
};

/**
 * Unfollow a user
 */
exports.unfollow = {
  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    Follow.remove({ follower: request.params.userid, following: request.params.id }).then(err => {
      reply().code(204);
    }).catch(err => {
      reply(Boom.badImplementation('error removing tweets'));
    });
  },
};
