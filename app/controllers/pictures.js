const cloudinary = require('cloudinary');
const User = require('../models/user');
const deleteFromCloud = require('../utils/pictureHelpers');

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
    const stream = cloudinary.v2.uploader.upload_stream({ upload_preset: "cth4nyko-profile" }, function (error, uploadResult) {
      console.log(uploadResult);
      User.findOne({ _id: request.auth.credentials.loggedInUser }).then(foundUser => {
        deleteFromCloud(foundUser.image);
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
      deleteFromCloud(foundUser.image);
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

