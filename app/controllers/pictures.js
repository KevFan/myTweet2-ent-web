const cloudinary = require('cloudinary');
const User = require('../models/user');
const path = require('path');

try {
  const env = require('../../.data/.env.json');
  cloudinary.config(env.cloudinary);
}
catch (e) {
  console.log('Cloudinary credentials file not found, profile picture options disabled - see README.md');
}

/**
 * Upload profile picture
 */
exports.updateProfilePicture = {
  payload: {
    maxBytes: 209715200,
    output: 'stream',
    parse: true,
  },

  handler: function (request, reply) {
    const stream = cloudinary.v2.uploader.upload_stream(function (error, uploadResult) {
      console.log(uploadResult);
      User.findOne({ _id: request.auth.credentials.loggedInUser }).then(foundUser => {
        deleteFromCloud(foundUser);
        foundUser.image = uploadResult.url;
        return foundUser.save();
      }).then(savedUser => {
        console.log(savedUser);
        reply.redirect('/home');
      }).catch(err => {
        console.log(err);
        reply.redirect('/home');
      });
    });

    request.payload.image.pipe(stream);
  },
};

/**
 * Delete profile picture
 */
exports.deleteProfilePicture = {
  handler: function (request, reply) {

    User.findOne({ _id: request.auth.credentials.loggedInUser }).then(foundUser => {
      deleteFromCloud(foundUser);
      foundUser.image = '';
      return foundUser.save();
    }).then(savedUser => {
      reply.redirect('/home');
    }).catch(err => {
      console.log(err);
      reply.redirect('/home');
    });

  },
};
/**
 * Helper to delete the user profile picture from the cloudinary store
 * @param loggedInUser User with the profile image to delete
 */
function deleteFromCloud(loggedInUser) {
  if (loggedInUser.image) {
    const id = path.parse(loggedInUser.image);
    cloudinary.api.delete_resources([id.name], function (result) {
      console.log(result);
    });
  }
}
