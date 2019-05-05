# PUBG Stats

WEB-service for inspecting detailed stats of played matches in PUBG. A schoolproject utilizing Node.js.


## APIDOC

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
