'use strict';

const User = require('../models/user');
const Admin = require('../models/admin');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const saltRounds = 10;

/**
 * Sends the main home view
 */
exports.home = {
  auth: false,
  handler: (request, reply) => {
    reply.view('main', { title: 'MyTweet | Home' });
  },
};

/**
 * Sends the sign up view
 */
exports.signup = {
  auth: false,
  handler: (request, reply) => {
    reply.view('signup', { title: 'MyTweet | Sign Up' });
  },
};

/**
 * Sends the login view
 */
exports.login = {
  auth: false,
  handler: (request, reply) => {
    reply.view('login', { title: 'MyTweet | Login' });
  },
};

/**
 * Registers a new user. Form is validated before registering
 */
exports.register = {
  validate: {
    payload: {
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
    options: {
      abortEarly: false,
    },
    failAction: function (request, reply, source, error) {
      const userRole = request.params.role;
      if (userRole === 'user') {
        reply.view('signup', {
          title: 'Sign up error',
          errors: error.data.details,
        }).code(400);
      } else {
        User.find({}).then(allUser => {
          reply.view('adminDashboard', {
            title: 'Add user error',
            user: allUser,
            errors: error.data.details,
          }).code(400);
        });
      }
    },
  },

  auth: false,
  handler: function (request, reply) {
    const user = new User(request.payload);
    const plaintextPassword = user.password;

    // A role parameter to correctly redirect if a admin adds a user
    const userRole = request.params.role;
    bcrypt.hash(plaintextPassword, saltRounds).then(hash => {
      user.password = hash;
      return user.save();
    }).then(newUser => {
      console.log(newUser);
      if (userRole === 'user') {
        reply.redirect('/login');
      } else if (userRole === 'admin') {
        reply.redirect('/admin');
      }
    }).catch(err => {
      console.log(err);
      reply.redirect('/');
    });;
  },
};

/**
 * Authenticate method to validate credentials for a member or admin account. Form is validated
 * before authenticating
 */
exports.authenticate = {
  validate: {
    payload: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
    options: {
      abortEarly: false,
    },
    failAction: function (request, reply, source, error) {
      reply.view('login', {
        title: 'Login error',
        errors: error.data.details,
      }).code(400);
    },
  },

  auth: false,
  handler: function (request, reply) {
    const userData = request.payload;
    let user = null;
    User.findOne({ email: userData.email }).then(foundUser => {
      user = foundUser;
      return Admin.findOne({ email: userData.email });
    }).then(foundAdmin => {
      if (user) {
        compareAndRedirect(userData.password, user, request, reply);
      } else if (foundAdmin) {
        compareAndRedirect(userData.password, foundAdmin, request, reply);
      } else {
        reply.view('login', { message: 'Email/Password incorrect', messageType: 'negative' });
      }
    }).catch(err => {
      console.log(err);
      reply.redirect('/');
    });
  },
};

/**
 * Logs the current user out, and clears the cookie
 */
exports.logout = {
  auth: false,
  handler: function (request, reply) {
    request.cookieAuth.clear();
    reply.redirect('/');
  },
};

/**
 * View setting passing either the admin or member details
 */
exports.viewSettings = {
  handler: function (request, reply) {
    const userId = request.auth.credentials.loggedInUser;

    // Find user using userId in cookie
    User.findOne({ _id: userId }).then(foundUser => {
      // If haven't found user, then try finding an admin
      if (!foundUser) {
        Admin.findOne({ _id: userId }).then(foundAdmin => {
          reply.view('settings', {
            title: 'Edit Account Settings',
            user: foundAdmin,
            isAdmin: true,
            role: 'admin',
          });
        });
      } else {
        reply.view('settings', { title: 'Edit Account Settings', user: foundUser, role: 'user' });
      }
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

/**
 * Updates an user or admin details - form is validated before trying to update
 */
exports.updateSettings = {
  validate: {
    payload: {
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
    options: {
      abortEarly: false,
    },
    failAction: function (request, reply, source, error) {
      const userId = request.params.userid;
      const role = request.params.role;

      // Try finding user by user Id parameter
      User.findOne({ _id: userId }).then(user => {
        // If found user
        if (user) {
          // if user is updating itself
          if (role === 'user') {
            reply.view('settings', {
              title: 'Update settings error',
              user: user,
              role: 'user',
              errors: error.data.details,
            }).code(400);
          } else {
            // other user if updated by admin
            User.find({}).then(allUsers => {
              reply.view('adminDashboard', {
                title: 'Update user error',
                user: allUsers,
                role: 'user',
                errors: error.data.details,
              }).code(400);
            });
          }
        } else {
          // if admin is updating itself
          Admin.findOne({ _id: userId }).then(admin => {
            reply.view('settings', {
              title: 'Update settings error',
              user: admin,
              isAdmin: true,
              role: 'admin',
              errors: error.data.details,
            }).code(400);
          });
        }
      });
    },
  },

  handler: function (request, reply) {
    const userId = request.params.userid;
    const role = request.params.role;
    const editedUser = request.payload;
    let user = null;
    console.log(editedUser.password);

    User.findOne({ _id: userId }).then(foundUser => {
      user = foundUser;
      return Admin.findOne({ _id: userId });
    }).then(foundAdmin => {
      if (user && user.password === editedUser.password) {
        user.firstName = editedUser.firstName;
        user.lastName = editedUser.lastName;
        user.email = editedUser.email;
        return user.save();
      } else if (user) {
        return bcrypt.hash(editedUser.password, saltRounds).then(hash => {
          editedUser.password = hash;
          console.log(hash);
          return User.findOneAndUpdate({ _id: userId }, editedUser, { new: true });
        });
      } else if (foundAdmin && foundAdmin.password === editedUser.password) {
        foundAdmin.firstName = editedUser.firstName;
        foundAdmin.lastName = editedUser.lastName;
        foundAdmin.email = editedUser.email;
        return foundAdmin.save();
      } else if (foundAdmin) {
        return bcrypt.hash(editedUser.password, saltRounds).then(hash => {
          editedUser.password = hash;
          console.log(hash);
          return Admin.findOneAndUpdate({ _id: userId }, editedUser,  { new: true });
        });
      }
    }).then(updatedUser => {
      if (updatedUser instanceof User) {
        if (role === 'user') {
          reply.redirect('/settings');
        } else if (role === 'admin') {
          reply.redirect('/admin');
        }
      } else {
        reply.redirect('/settings');
      }
    }).catch(err => {
      console.log('no user or admin with id: ' + userId);
      reply.redirect('/');
    });
  },
};

/**
 * Helper to perform compare of password attempt to user salt/hash and redirect to correct dashboard
 * if is user/admin and set session cookie
 * @param passwordAttempt plain text of password attempt
 * @param user user containing hash/salt password to compare
 * @param request
 * @param reply
 */
function compareAndRedirect(passwordAttempt, user, request, reply) {
  bcrypt.compare(passwordAttempt, user.password).then(isValid => {
    if (isValid) {
      request.cookieAuth.set(
          {
            loggedIn: true,
            loggedInUser: user._id,
          });
      console.log('Successfully logged in, email: ' + user.email + ' password: ' + user.password);
      if (user instanceof User) {
        reply.redirect('/home');
      } else if (user instanceof Admin) {
        reply.redirect('/admin');
      }
    } else {
      reply.view('login', { message: 'Email/Password incorrect', messageType: 'negative' });
    }
  });
}
