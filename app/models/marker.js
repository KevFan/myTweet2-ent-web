'use strict';

const mongoose = require('mongoose');

/**
 * Marker mongoose schema/model
 */
const markerSchema = mongoose.Schema({
  id: Number,
  coords: {
    latitude: Number,
    longitude: Number,
  },
});

const Marker = mongoose.model('Marker', markerSchema);
module.exports = Marker;
