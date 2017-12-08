'use strict';

const assert = require('chai').assert;
const TweetService = require('./tweet-service');
const fixtures = require('./fixtures.json');
const _ = require('lodash');

suite('Admin API tests', function () {
  let admins = fixtures.admins;
  let newAdmin = fixtures.newAdmin;

  const tweetService = new TweetService('http://localhost:4000');

  beforeEach(function () {
    tweetService.deleteAllAdmins();
  });

  afterEach(function () {
    tweetService.deleteAllAdmins();
  });

  test('create an admin', function () {
    const returnedAdmin = tweetService.createAdmin(newAdmin);
    assert(_.some([returnedAdmin], newAdmin), 'returnedAdmin must be a superset of of newAdmin');
    assert.isDefined(returnedAdmin._id);
  });

  test('get admin', function () {
    const admin1 = tweetService.createAdmin(newAdmin);
    const admin2 = tweetService.getAdmin(admin1._id);
    assert.deepEqual(admin1, admin2);
  });

  test('get invalid admin', function () {
    const admin1 = tweetService.getAdmin('1234');
    assert.isNull(admin1);
    const admin2 = tweetService.getAdmin('012345678901234567890123');
    assert.isNull(admin2);
  });

  test('delete a admin', function () {
    const admin = tweetService.createAdmin(newAdmin);
    assert(tweetService.getAdmin(admin._id) != null);
    tweetService.deleteOneAdmin(admin._id);
    assert(tweetService.getAdmin(admin._id) == null);
  });

  test('get all admins', function () {
    for (let admin of admins) {
      tweetService.createAdmin(admin);
    }

    const allAdmin = tweetService.getAdmins();
    assert.equal(allAdmin.length, admins.length);
  });

  test('get admins detail', function () {
    for (let admin of admins) {
      tweetService.createAdmin(admin);
    }

    const allAdmin = tweetService.getAdmins();
    for (let i = 0; i < admins.length; i++) {
      assert(_.some([allAdmin[i]], admins[i]), 'admin in allAdmin must be a superset of admins at same index');
    }
  });

  test('get all admins empty', function () {
    const allAdmins = tweetService.getAdmins();
    assert.equal(allAdmins.length, 0);
  });
});
