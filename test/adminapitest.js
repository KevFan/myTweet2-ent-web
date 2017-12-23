'use strict';

const assert = require('chai').assert;
const TweetService = require('./tweet-service');
const fixtures = require('./fixtures.json');
const bcrypt = require('bcrypt');

suite('Admin API tests', function () {
  let admins = fixtures.admins;
  let newAdmin = fixtures.newAdmin;

  const tweetService = new TweetService('http://localhost:4000');

  beforeEach(function () {
    tweetService.login(admins[0]);
  });

  afterEach(function () {
    tweetService.logout();
  });

  test('create an admin', function () {
    const returnedAdmin = tweetService.createAdmin(newAdmin);
    assert.equal(newAdmin.firstName, returnedAdmin.firstName);
    assert.equal(newAdmin.lastName, returnedAdmin.lastName);
    assert.equal(newAdmin.email, returnedAdmin.email);
    assert.isTrue(bcrypt.compareSync(newAdmin.password, returnedAdmin.password));
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
    assert.isNotNull(tweetService.getAdmin(admin._id));
    tweetService.deleteOneAdmin(admin._id);
    assert.isNull(tweetService.getAdmin(admin._id));
  });

  // test('get all admins', function () {
  //   const allAdmin = tweetService.getAdmins();
  //   assert.equal(allAdmin.length, admins.length);
  // });

  test('get admins detail', function () {
    for (let admin of admins) {
      tweetService.createAdmin(admin);
    }

    const allAdmin = tweetService.getAdmins();
    for (let i = 0; i < admins.length; i++) {
      assert.isDefined(allAdmin[i]._id);
      assert.equal(admins[i].firstName, allAdmin[i].firstName);
      assert.equal(admins[i].lastName, allAdmin[i].lastName);
      assert.equal(admins[i].email, allAdmin[i].email);
      assert.isTrue(bcrypt.compareSync(admins[i].password, allAdmin[i].password));
    }
  });

  // test('get all admins empty', function () {
  //   const allAdmins = tweetService.getAdmins();
  //   assert.equal(allAdmins.length, 0);
  // });

  test('update a admin', function () {
    let returnedAdmin = tweetService.createAdmin(newAdmin);
    assert.equal(returnedAdmin.firstName, newAdmin.firstName);
    returnedAdmin.firstName = 'update';
    returnedAdmin.password = 'test';
    tweetService.updateAdmin(returnedAdmin._id, returnedAdmin);
    returnedAdmin = tweetService.getAdmin(returnedAdmin._id);
    assert.equal(returnedAdmin.firstName, 'update');
    assert.isTrue(bcrypt.compareSync('test', returnedAdmin.password));
  });
});
