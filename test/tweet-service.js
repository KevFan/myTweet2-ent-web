'use strict';

const SyncHttpService = require('./sync-http-service');
const baseUrl = 'http://localhost:4000';

class TweetService {

  constructor(baseUrl) {
    this.httpService = new SyncHttpService(baseUrl);
  }

  getTweets() {
    return this.httpService.get('/api/tweets');
  }

  getTweet(id) {
    return this.httpService.get('/api/tweets/' + id);
  }

  createTweet(newTweet) {
    return this.httpService.post('/api/tweets', newTweet);
  }

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
}

module.exports = TweetService;
