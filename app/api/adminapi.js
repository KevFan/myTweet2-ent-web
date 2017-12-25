'use strict';

const Admin = require('../models/admin');
const Boom = require('boom');
const bcrypt = require('bcrypt');
const saltRounds = 10;

/**
 * Find all admins
 */
exports.find = {
  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    Admin.find({}).exec().then(admins => {
      reply(admins);
    }).catch(err => {
      reply(Boom.badImplementation('error accessing db'));
    });
  },
};

/**
 * Find one admin by id
 */
exports.findOne = {
  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    Admin.findOne({ _id: request.params.id }).then(admin => {
      if (admin) {
        reply(admin);
      }

      reply(Boom.notFound('id not found'));
    }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },
};

/**
 * Create an admin
 */
exports.create = {
  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    const admin = new Admin(request.payload);
    const plaintextPassword = admin.password;
    bcrypt.hash(plaintextPassword, saltRounds).then(hash => {
      admin.password = hash;
      admin.save();
    }).then(newAdmin => {
      reply(newAdmin).code(201);
    }).catch(err => {
      reply(Boom.badImplementation('error creating admin'));
    });
  },
};

/**
 * Delete all admins
 */
exports.deleteAll = {
  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    Admin.remove({}).then(err => {
      reply().code(204);
    }).catch(err => {
      reply(Boom.badImplementation('error removing admins'));
    });
  },
};

/**
 * Delete one admin by id
 */
exports.deleteOne = {
  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    Admin.remove({ _id: request.params.id }).then(admin => {
      reply(admin).code(204);
    }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },
};

/**
 * Update an admin by id
 */
exports.update = {
  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    let updateData = request.payload;
    Admin.findOne({ _id: request.params.id }).then(foundAdmin => {
      if (foundAdmin.password !== updateData.password) {
        return bcrypt.hash(updateData.password, saltRounds).then(hash => {
          updateData.password = hash;
          return Admin.findOneAndUpdate({ _id: request.params.id }, updateData, { new: true });
        });
      } else {
        foundAdmin.firstname = updateData.firstName;
        foundAdmin.lastname = updateData.lastname;
        foundAdmin.email = updateData.email;
        return foundAdmin.save();
      }
    }).then(admin => {
      reply(admin).code(200);
    }).catch(err => {
      reply(Boom.notFound('error updating admin'));
    });
  },
};
