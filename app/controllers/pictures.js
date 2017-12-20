const cloudinary = require('cloudinary');
const User = require('../models/user');

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
    let result = null;
    const stream = cloudinary.v2.uploader.upload_stream(function (error, uploadResult) {
      console.log(uploadResult);
      result = uploadResult;
      User.findOne({ _id: request.auth.credentials.loggedInUser }).then(foundUser => {
        foundUser.image = result.url;
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
