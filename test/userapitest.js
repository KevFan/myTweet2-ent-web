'use strict';

const assert = require('chai').assert;
const TweetService = require('./tweet-service');
const fixtures = require('./fixtures.json');
const _ = require('lodash');

suite('User API tests', function () {

  let users = fixtures.users;
  let newUser = fixtures.newUser;

  const tweetService = new TweetService('http://localhost:4000');

  test('create a user', function () {
    const returnedUser = tweetService.createUser(newUser);
    assert(_.some([returnedUser], newUser), 'returnedUser must be a superset of of newUser');
    assert.isDefined(returnedUser._id);
  });

  // test('get users', function () {
  //   for (let user of users) {
  //
  //   }
  // });
  //
  // test('get one user', function () {
  //
  //   const allUsersUrl = 'http://localhost:4000/api/users';
  //   let res = request('GET', allUsersUrl);
  //   const users = JSON.parse(res.getBody('utf8'));
  //
  //   const oneUserUrl = allUsersUrl + '/' + users[0]._id;
  //   res = request('GET', oneUserUrl);
  //   const oneUser = JSON.parse(res.getBody('utf8'));
  //
  //   assert.equal(oneUser.firstName, 'Homer');
  //   assert.equal(oneUser.lastName, 'Simpson');
  //   assert.equal(oneUser.email, 'homer@simpson.com');
  //   assert.equal(oneUser.password, 'secret');
  //
  // });
  //
  //
  // test('update a user', function () {
  //
  //   const allUsersUrl = 'http://localhost:4000/api/users';
  //   let res = request('GET', allUsersUrl);
  //   const users = JSON.parse(res.getBody('utf8'));
  //
  //   const oneUserUrl = allUsersUrl + '/' + users[0]._id;
  //   res = request('GET', oneUserUrl);
  //   let oneUser = JSON.parse(res.getBody('utf8'));
  //
  //   assert.equal(oneUser.firstName, 'Homer');
  //   assert.equal(oneUser.lastName, 'Simpson');
  //   assert.equal(oneUser.email, 'homer@simpson.com');
  //   assert.equal(oneUser.password, 'secret');
  //
  //   oneUser.firstName = 'Update';
  //   const updateUserUrl = allUsersUrl + '/' + oneUser._id;
  //   res = request('PUT', updateUserUrl, { json: oneUser });
  //   const returnedUser = JSON.parse(res.getBody('utf8'));
  //   assert.equal(returnedUser.firstName, 'Update');
  //   assert.equal(returnedUser.lastName, 'Simpson');
  //   assert.equal(returnedUser.email, 'homer@simpson.com');
  //   assert.equal(returnedUser.password, 'secret');
  //
  // });
  //
  // test('delete a user', function () {
  //
  //   // Get all the users
  //   const allUsersUrl = 'http://localhost:4000/api/users';
  //   const res = request('GET', allUsersUrl);
  //   const users = JSON.parse(res.getBody('utf8'));
  //
  //   // Test first user name is currently Update Simpson due to put test
  //   assert.equal(users[0].firstName, 'Update');
  //   assert.equal(users[0].lastName, 'Simpson');
  //   assert.equal(users[0].email, 'homer@simpson.com');
  //   assert.equal(users[0].password, 'secret');
  //
  //   // Delete the first user - Homer
  //   const deleteAUserUrl = allUsersUrl + '/' + users[0]._id;
  //   request('DELETE', deleteAUserUrl);
  //
  //   // Get new list of all users
  //   const newAllUserList = JSON.parse(request('GET', 'http://localhost:4000/api/users').getBody('utf8'));
  //
  //   assert.equal(3, newAllUserList.length);
  //   assert.equal(newAllUserList[0].firstName, 'Marge');
  //   assert.equal(newAllUserList[0].lastName, 'Simpson');
  //   assert.equal(newAllUserList[0].email, 'marge@simpson.com');
  //   assert.equal(newAllUserList[0].password, 'secret');
  // });
  //
  // test('delete all users', function () {
  //
  //   // Get all the users
  //   const allUsersUrl = 'http://localhost:4000/api/users';
  //   const res = request('GET', allUsersUrl);
  //   const users = JSON.parse(res.getBody('utf8'));
  //
  //   // Test first user is currently Marge after deleting Lisa
  //   assert.equal(users[0].firstName, 'Marge');
  //   assert.equal(users[0].lastName, 'Simpson');
  //   assert.equal(users[0].email, 'marge@simpson.com');
  //   assert.equal(users[0].password, 'secret');
  //
  //   // Delete all users
  //   request('DELETE', allUsersUrl);
  //
  //   // Get new list of all users
  //   const newListOfUsers = JSON.parse(request('GET', 'http://localhost:4000/api/users').getBody('utf8'));
  //
  //   assert.equal(0, newListOfUsers.length);
  // });
});
