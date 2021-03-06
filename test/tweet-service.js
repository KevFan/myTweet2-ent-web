'use strict';

const SyncHttpService = require('./sync-http-service');
const baseUrl = 'http://localhost:4000';

class TweetService {

  constructor(baseUrl) {
    this.httpService = new SyncHttpService(baseUrl);
  }

  // Tweets
  getTweets() {
    return this.httpService.get('/api/tweets');
  }

  getTweet(id) {
    return this.httpService.get('/api/tweets/' + id);
  }

  getUserTweets(userId) {
    return this.httpService.get('/api/tweets/users/' + userId);
  }

  createTweet(newTweet) {
    return this.httpService.post('/api/tweets', newTweet);
  }

  deleteAllTweets() {
    return this.httpService.delete('/api/tweets');
  }

  deleteOneTweet(id) {
    return this.httpService.delete('/api/tweets/' + id);
  }

  deleteAllUserTweets(userId) {
    return this.httpService.delete('/api/tweets/users/' + userId);
  }

  // Users
  getUsers() {
    return this.httpService.get('/api/users');
  }

  getUser(id) {
    return this.httpService.get('/api/users/' + id);
  }

  createUser(newUser) {
    return this.httpService.post('/api/users', newUser);
  }

  deleteAllUsers() {
    return this.httpService.delete('/api/users');
  }

  deleteOneUser(id) {
    return this.httpService.delete('/api/users/' + id);
  }

  updateUser(id, updatedUser) {
    return this.httpService.put('/api/users/' + id, updatedUser);
  }

  // Admins
  getAdmins() {
    return this.httpService.get('/api/admins');
  }

  getAdmin(id) {
    return this.httpService.get('/api/admins/' + id);
  }

  createAdmin(newAdmin) {
    return this.httpService.post('/api/admins', newAdmin);
  }

  deleteAllAdmins() {
    return this.httpService.delete('/api/admins');
  }

  deleteOneAdmin(id) {
    return this.httpService.delete('/api/admins/' + id);
  }

  updateAdmin(id, updatedAdmin) {
    return this.httpService.put('/api/admins/' + id, updatedAdmin);
  }

  // Follows
  getFollowers(id) {
    return this.httpService.get('/api/follow/followers/' + id);
  }

  getFollowings(id) {
    return this.httpService.get('/api/follow/following/' + id);
  }

  follow(newFollow) {
    return this.httpService.post('/api/follow', newFollow);

  }

  unfollow(id) {
    return this.httpService.delete('/api/follow/' + id);
  }

  login(user) {
    return this.httpService.setAuth('/api/users/authenticate', user);
  }

  logout() {
    this.httpService.clearAuth();
  }
}

module.exports = TweetService;
