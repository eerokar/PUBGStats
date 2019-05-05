# PUBG Stats

WEB-service for inspecting detailed stats of played matches in PUBG. A schoolproject utilizing Node.js.

## How to:
* `git clone`
* `npm install`<br />
-Get PUBG api key from: https://developer.playbattlegrounds.com/ <br />
-Make a file called conf.json to the config-folder an paste your api key there. <br />
Like this:
```json
{
  "apiKey": "paste-your-api-key-here"
}
```
-Change the db in DB Config in app.js. <br />
-Change the URLs in js-files in the views-folder. <br />
- Run  `npm run dev`

## Folder structure:
The app uses the basic MVC-structure.<br />
The app.js starts the application. The connection to the database and the middleware initialization happens here.<br />
All the endpoints are defined in files found in the routes-folder and those files use methods that can be found in the controllers-folder.<br />
Models-folder contains the User data-model.<br />
![alt text](https://upload.wikimedia.org/wikipedia/commons/a/a0/MVC-Process.svg)<br />
The config-folder contains the necessary values such as the MongoDB URI and the api key for accessing the PUBG-backend.
It also has the passport-functionality usded dor the login and authorization to use the application.<br />
Views-folder has all the frontend elements including .js, .ejs and CSS files.

## API DOCUMENTATION

#### Index
* `'/' - GET` - Get the welcome page.
* `'/dashboard' - GET` - Get the main page with recent matches if user is logged in.

#### Users

* `'/users/login' - GET` - Get the login page.
* `'/users/login' - POST` - Login with your username and password.

* `'/users/register' - GET` - Get the registering page.
* `'/users/register' - POST` - Create a new user with username, PUBG-nickname and password.

* `'/users/logout' - GET` - Log out the current user. 

* `'/users/editProfile/:originalname/:originalpubgname' - GET` - Get the edit profile page.
* `'/users/editProfile/:originalname/:originalpubgname' - PUT` - Change the PUBG-nickname.

* `'/users/saveFav' - POST` - Save a match to favourites.
* `'/users/removeFav' - DELETE` - Delete a match from favourites.
* `'/users/checkIfExists/:userName/:id' - GET` - Check if favourite match exists.
* `'/users/showFavs/:originalname/:pubgname' - GET` - Get the list of favourite matches.

#### Matches

* `'/matches/playerName/:id' - GET` - Get recent matches of a player.
* `'/matches/favouriteMatches/:id/:pubgName' - GET` - Get favourite matches of a player
* `'/matches/matchDetails/:id/:pubgName' - GET` - Get detailed information about a specific match.
* `'/matchDetailsRender/:id/:pubgName/:userName' - GET` - Get the details page.




#### Author Eero Karvonen
