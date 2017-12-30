'use strict';

const mongoose = require('mongoose');

/**
 * Tweet mongoose schema/model
 */
const tweetSchema = mongoose.Schema({
  tweetText: String,
  tweetDate: { type: Date, default: Date.now },
  tweetUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  tweetImage: { type: String, default: '' },
  marker: {
    id: Number,
    coords: {
      latitude: Number,
      longitude: Number,
    },
  },
});

const Tweet = mongoose.model('Tweet', tweetSchema);
module.exports = Tweet;
