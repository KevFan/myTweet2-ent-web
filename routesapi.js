const UsersApi = require('./app/api/usersapi');
const TweetsApi = require('./app/api/tweetssapi');
const AdminsApi = require('./app/api/adminapi');
const FollowApi = require('./app/api/followapi');
const AuthApi = require('./app/api/authapi');

module.exports = [
  { method: 'GET', path: '/api/users', config: UsersApi.find },
  { method: 'GET', path: '/api/users/{id}', config: UsersApi.findOne },
  { method: 'POST', path: '/api/users', config: UsersApi.create },
  { method: 'DELETE', path: '/api/users/{id}', config: UsersApi.deleteOne },
  { method: 'DELETE', path: '/api/users', config: UsersApi.deleteAll },
  { method: 'PUT', path: '/api/users/{id}', config: UsersApi.update },
  { method: 'PUT', path: '/api/profilePicture/{id}', config: UsersApi.updateProfilePicture },
  { method: 'DELETE', path: '/api/profilePicture/{id}', config: UsersApi.deleteProfilePicture },

  { method: 'GET', path: '/api/tweets', config: TweetsApi.findAll },
  { method: 'GET', path: '/api/tweets/{id}', config: TweetsApi.findOne },
  { method: 'POST', path: '/api/tweets', config: TweetsApi.create },
  { method: 'DELETE', path: '/api/tweets/{id}', config: TweetsApi.deleteOne },
  { method: 'DELETE', path: '/api/tweets', config: TweetsApi.deleteAll },
  { method: 'GET', path: '/api/tweets/users/{userid}', config: TweetsApi.findAllUser },
  { method: 'DELETE', path: '/api/tweets/users/{userid}', config: TweetsApi.deleteAllUser },

  { method: 'GET', path: '/api/admins', config: AdminsApi.find },
  { method: 'GET', path: '/api/admins/{id}', config: AdminsApi.findOne },
  { method: 'POST', path: '/api/admins', config: AdminsApi.create },
  { method: 'DELETE', path: '/api/admins/{id}', config: AdminsApi.deleteOne },
  { method: 'DELETE', path: '/api/admins', config: AdminsApi.deleteAll },
  { method: 'PUT', path: '/api/admins/{id}', config: AdminsApi.update },

  { method: 'GET', path: '/api/follow/followers/{id}', config: FollowApi.findFollowers },
  { method: 'GET', path: '/api/follow/following/{id}', config: FollowApi.findFollowings },
  { method: 'POST', path: '/api/follow', config: FollowApi.follow },
  { method: 'DELETE', path: '/api/follow/{id}', config: FollowApi.unfollow },
  { method: 'DELETE', path: '/api/follow/followers/{id}', config: FollowApi.removeUserFollowers },
  { method: 'DELETE', path: '/api/follow/following/{id}', config: FollowApi.removeUserFollowings },
  { method: 'DELETE', path: '/api/follow', config: FollowApi.removeAllFollows },
  { method: 'GET', path: '/api/follow', config: FollowApi.findAll },

  { method: 'POST', path: '/api/users/authenticate', config: AuthApi.authenticate },

];
