const path = require('path');
const cloudinary = require('cloudinary');

/**
 * Helper to delete the user profile picture from the cloudinary store
 * @param loggedInUser User with the profile image to delete
 */
function deleteFromCloud(image) {
  if (image) {
    const id = path.parse(image);
    cloudinary.api.delete_resources([id.name], function (result) {
      console.log(result);
    });
  }
}

module.exports = deleteFromCloud;
