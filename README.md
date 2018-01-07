# MyTweet v2 Hapi

This project is a continuation of the first MyTweet application with additional features. Allows server rendering of functionality, while also providing an API for cross application communication.

## Additional Features
* Follower / Following
  * Follow another user
    * Tweets from followed user is merges onto own dashboard for viewing
  * Unfollow another user
    * Removed following user tweets would no longer show on user dashbaord
* Images - Cloudinary
  * Images can be added to tweets and rendered in tweet listing
  * User's may also update and delete existing profile image
* Admin Stats
  * Admin's now have a statistic view on number of users, tweets and follower/followings in the database
* Maps - Google Maps
  * Timeline and Global timeline view has google map that plots tweets with markers into map
  * User's can click onto map markers for to tweet info
* Bcrypt Password Hashing / Salting
  * Passwords no longer saved - salt & hash saved instead 
  * Authenticate pasword compared with saved hash/salt value
* API Additions
  * Tweets API
    * Find all user and following tweets as one merged list of tweets
    * Add tweet - can upload with tweet image
  * User API
    * Update profile picture
    * Delete profile picture
  * Follow API
    * Find all user followers
    * Find all user followings
    * Follow another user
    * Unfollow another user
    * Find all follows
    * Remove user followers associated with user id
    * Remove user followings associated with user id
    * Remove all follows
  * Routes secured and authenticated with JWT

## Pre-requisites

To get started, you'll need to have the following requirements installed

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/en/)
* npm (Installed with Node.js)
* [MongoDB 2.6.x / 3.2.x](https://docs.mongodb.com/manual/administration/install-community/)

## Getting started
	
	# Ensure `mongod` is running, either as a service or in another shell
	git clone <this repo>
	npm install

The project also requires the [Cloudinary](http://cloudinary.com/) services in order to upload and delete profile picture. In order to run, you will need to place a Cloudinary credentials file in the .data folder called .env.json:

.data/.env.json
```
{
  "cloudinary": {
    "cloud_name": "YOURID",
    "api_key": "YOURKEY",
    "api_secret": "YOURSECRET"
  }
}
```

For Google Maps to render correctly, you would also need to provide an Google Map API key
into the .data/googleMapsAPKey.json:
```
{
  "apiKey": "YOUR_MAP_API_KEY"
}
```

Finally start the project with `npm start` to host the project locally and seed the database with default data.
The project can then be viewed on <http://localhost:4000/>

## Running tests

Endpoints of the API are tested using mocha/chai.
To run tests enter:
 ```
 # Ensure the project is hosted locally and database seeded (see getting started)
 # Open another terminal
 npm test
 ```

Mochawesome test reports are also generated and included which can be found in the project directory:

```
myTweet-enterprise-web/mochawesome-report/mochawesome.html
```

## User Instructions:
After hosting the project locally, users can signup or login using the preloaded accounts provided: 
```
User Accounts:

email: homer@simpson.com
password: secret

email: marge@simpson.com
password: secret

email: bart@simpson.com
password: secret
```
There is also a preloaded admin accounts that can delete users and tweets 
```
Admin Account:

email: admin@simpson.com
password: secret

email: granpa@simpson.com
password: secret
```

Alternatively, for the deployed version, you can visit http://34.242.209.100. The above default accounts can also be used to log in the deployed version if they have not been deleted.

## List of Software + Technologies Used
* [Node.js](https://nodejs.org/en/) - JavaScript runtime
* [MongoDB 2.6.x / 3.2.x](https://docs.mongodb.com/manual/administration/install-community/) 
* [Hapi](https://hapijs.com/) - Node.js Web Framework
* [mochawesome](https://www.npmjs.com/package/mochawesome) - Testing report
* [Mocha](https://mochajs.org/) - JavaScript test framework
* [WebStorm](https://www.jetbrains.com/webstorm/) - JavaScript IDE

## Improvements
* Allow add location to tweets by adding marker to map and getting latitude and longitude of marker

## Authors:
Kevin Fan ([KevFan](https://github.com/KevFan))

## Version/Date:
7th January 2018
