'use strict';

const Tweet = require('../models/tweet');
const Boom = require('boom');
const cloudinary = require('cloudinary');
const deleteFromCloud = require('../utils/pictureHelpers');
const fs = require('fs');
const utils = require('./utils.js');

/**
 * Find all tweets
 */
exports.findAll = {
  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    Tweet.find({}).populate('tweetUser').then(tweets => {
      reply(tweets);
    }).catch(err => {
      reply(Boom.badImplementation('error accessing db'));
    });
  },
};

/**
 * Find one tweet by id
 */
exports.findOne = {
  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    Tweet.findOne({ _id: request.params.id }).populate('tweetUser').then(tweet => {
      if (tweet) {
        reply(tweet);
      }

      reply(Boom.notFound('id not found'));
    }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },
};

/**
 * Find all tweets associated with a userId
 */
exports.findAllUser = {
  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    Tweet.find({ tweetUser: request.params.userid }).populate('tweetUser').then(tweets => {
      reply(tweets);
    }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },
};

/**
 * Create a tweet
 */
exports.create = {
  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    let tweetData = request.payload;
    console.log(tweetData);
    try {
      // try parse marker to json object - due to multipart upload by android
      tweetData.marker = JSON.parse(tweetData.marker);
      console.log('parsed marker to json object');
    } catch (e) {
      console.log('No need to parse');
    }

    tweetData.tweetUser = utils.getUserIdFromRequest(request);
    console.log(tweetData);

    fs.writeFile('tempimg', tweetData.picture, (err) => {
      if (!err) {
        cloudinary.v2.uploader.upload('tempimg', (error, result) => {
          if (result) {
            tweetData.tweetImage = result.url;
          }

          Tweet.create(tweetData).then(newTweet => {
            return Tweet.findOne(newTweet).populate('tweetUser');
          }).then(newTweet => {
            reply(newTweet).code(201);
            console.log(newTweet);
          }).catch(err => {
            console.log(err);
            reply(Boom.badImplementation('error creating tweet'));
          });
        });
      }
    });
  },
};

/**
 * Delete all tweets
 */
exports.deleteAll = {
  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    Tweet.find({}).then(foundTweets => {
      for (let tweet of foundTweets) {
        deleteFromCloud(tweet.tweetImage);
      }

      return Tweet.remove({});
    }).then(err => {
      reply().code(204);
    }).catch(err => {
      reply(Boom.badImplementation('error removing tweets'));
    });
  },
};

/**
 * Delete one tweet by id
 */
exports.deleteOne = {
  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    Tweet.findOne({ _id: request.params.id }).then(foundTweet => {
      deleteFromCloud(foundTweet.tweetImage);
      return Tweet.remove({ _id: request.params.id });
    }).then(tweet => {
      reply(tweet).code(204);
    }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },
};

/**
 * Delete all tweets associated with userId
 */
exports.deleteAllUser = {
  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    Tweet.find({ tweetUser: request.params.userid }).then(foundTweets => {
      for (let tweet of foundTweets) {
        deleteFromCloud(tweet.tweetImage);
      }

      return Tweet.remove({ tweetUser: request.params.userid });
    }).then(err => {
      reply().code(204);
    }).catch(err => {
      reply(Boom.badImplementation('error removing tweets'));
    });
  },
};
