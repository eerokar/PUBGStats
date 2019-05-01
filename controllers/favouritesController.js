const User = require('../models/User');

module.exports = {

    saveFavourite: function(name, matchId, match){
        let matchObject = {
            matchId: matchId,
            match: match
        };
        let userToUpdate = User.findOne({name: name});
        //Check if match is already in favourites
        userToUpdate.find( { "favouriteMatches.matchId": { $in: [ matchId ] } } )
            .then(user => {
                if(user.length === 0) {
                    //If it is not:
                    User.updateOne({name: name}, {$push: {favouriteMatches: matchObject}})
                        .catch(err => console.log('Error: ' + err));
                }
            });
    },

    showFavourites: function(name){
        return new Promise(function(resolve, reject) {
            let userToGetMatchesFrom = User.findOne({name: name});
            let favouriteMatches = [];

            userToGetMatchesFrom.findOne({}, {favouriteMatches}, function (err, item) {
                let matchIds = [];
                if (item !== null) {
                    for (var i in item.favouriteMatches) {
                        if (item.favouriteMatches[i].matchId !== undefined) {
                            matchIds.push(item.favouriteMatches[i].matchId);
                        }
                    }
                }
                resolve (matchIds.reverse());
            });
        });
    },

    removeFavourite: function(name, matchId) {
        let userToUpdate = User.findOne({name: name});
        //Check if favourite match exists
        userToUpdate.find( { "favouriteMatches.matchId": { $in: [ matchId ] } } )
            .then(user => {
                if(user.length !== 0) {
                    //If it does:
                    User.updateOne({name: name},
                        {$pull: {favouriteMatches: {matchId: matchId}}})
                        .catch(err => console.log('Error: ' + err));
                }
            });
    }
};
