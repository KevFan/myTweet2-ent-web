'use strict';

const Handlebars = require('handlebars');
const moment = require('moment');

/**
 * Handlebars helper function to format a date string to the format:
 * August 31, 2017 5:19 PM using moment js
 */
Handlebars.registerHelper('formatDate', (dateString) => {
  return moment(new Date(dateString)).format('lll');
});

/**
 * Handle bar helper to determine if tweet is owned by user
 */
Handlebars.registerHelper('isMyTweet', (userId, compareId) => {
  return userId === compareId;
});

/**
 * Handle bar helper to determine if lat, long co-ordinates are at 0,0
 */
Handlebars.registerHelper('notAtEquator', (lat, long) => {
  return (lat !== 0) && (long !== 0);
});
