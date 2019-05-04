const apiKey = require('../config/conf').apiKey;
const fetch = require("node-fetch");

module.exports = {
    getMatches: async (name) => {
        let url = "https://api.pubg.com/shards/pc-eu/players?filter[playerNames]=" + name;
        let response = await getRecentMatches(url, name);
        return(response)
    },
    getFavouriteMatches: async (favouriteMatches, pubgName) => {
        let response = await getFavMatchBasics(favouriteMatches, pubgName);
        return(response);
    },
    getMatchBasicData: async (id) => {
        let url = "https://api.pubg.com/shards/eu/matches/" + id;
        let response = await getMatchBasics(url);
        return(response);
    },
    getMatchDetails: async (id, pubgName) => {
        let url = "https://api.pubg.com/shards/eu/matches/" + id;
        let matchBasics = await getMatchBasics(url, pubgName);
        let telemetryUrl = await matchBasics.basics.telemetryEventsURL;
        let response = await getTelemetryEvents(telemetryUrl, pubgName);
        let strngRes = JSON.stringify(response);
        return(strngRes);
    }
};

const apiRequestConfig = {
    headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: 'application/vnd.api+json'
    }
};
// Gets recent played matches
async function getRecentMatches(url, pubgName) {
    const recentMatchDetails = {};

    const response = await fetch(url, apiRequestConfig);
    const object = await response.json();

    let recentMatchesArray = await object.data[0].relationships.matches.data;

    recentMatchesArray.splice(0, 3);
    for(var i in recentMatchesArray){
        let matchBasicsURL = "https://api.pubg.com/shards/eu/matches/" + recentMatchesArray[i].id;
        recentMatchDetails[i] = {
            matchId: recentMatchesArray[i].id,
            matchDetails: await getMatchBasics(matchBasicsURL, pubgName)};
    }
    return(recentMatchDetails);
}

async function getFavMatchBasics(matchIds, pubgName){
    const favouriteMatchDetails = {};
    for(var i in matchIds){
        let matchBasicsURL = "https://api.pubg.com/shards/eu/matches/" + matchIds[i];
        favouriteMatchDetails[i] = {
            matchId: matchIds[i],
            matchDetails: await getMatchBasics(matchBasicsURL, pubgName)};
    }
    return(favouriteMatchDetails);
}

// Gets basic information about each match
async function getMatchBasics(url, pubgName) {
    const response = await fetch(url, apiRequestConfig);
    const object = await response.json();
    let matchBasics = await object.data.attributes;

    //Searches the URLs of telemetry events for each match
    let included = await object.included;
    let asset = {};
    let position;

    for (var i in included){
        if (included[i].type === 'asset'){
            asset = included[i];
        }
        if (included[i].type === 'participant'){
            let player = included[i];
            if(player.attributes.stats.name === pubgName){
                position = player.attributes.stats.winPlace;
            }
        }
    }
    let basicsObject ={
        basics: matchBasics,
        position: position
    };
    matchBasics.telemetryEventsURL = asset.attributes.URL;
    return(basicsObject);
}

async function getTelemetryEvents(url, selectedPlayer) {
    return new Promise(async function(resolve, reject) {
        const response = await fetch(url, apiRequestConfig);
        const object = await response.json();

        const allKillsInTheGame = [];
        const allKnocksInTheGame = [];
        const allDamagesInTheGame = [];

        const selectedPlayerKills = [];
        const selectedPlayerKnocks = [];
        const selectedPlayerDamages = [];

        var selectedPlayerKillsKnocksAndDamages;

        //Get all kills, knocks and damages
        for (var i in object) {
            //Get all kills in the game
            if (object[i]._T === "LogPlayerKill") {
                allKillsInTheGame.push(object[i])
            }
            //Get all knocks in the game
            if (object[i]._T === "LogPlayerMakeGroggy") {
                allKnocksInTheGame.push(object[i])
            }
            //Get all damages dealt in the game
            if (object[i]._T === "LogPlayerTakeDamage") {
                allDamagesInTheGame.push(object[i])
            }
        }

        //Get kills, knocks and damages of a specific player
        //Get the kills of a selected player
        for (var i in allKillsInTheGame) {
            if (allKillsInTheGame[i].killer.name === selectedPlayer) {
                selectedPlayerKills.push(allKillsInTheGame[i]);
            }
        }
        //Get the knocks of a selected player
        for (var i in allKnocksInTheGame) {
            if (allKnocksInTheGame[i].attacker !== null) {
                if (allKnocksInTheGame[i].attacker.name === selectedPlayer) {
                    selectedPlayerKnocks.push(allKnocksInTheGame[i]);
                }
            }
        }
        //Get the damages dealt by a selected player
        for (var i in allDamagesInTheGame) {
            if (allDamagesInTheGame[i].attacker !== null) {
                if (allDamagesInTheGame[i].victim.name !== selectedPlayer) {
                    if (allDamagesInTheGame[i].attacker.name === selectedPlayer) {
                        selectedPlayerDamages.push(allDamagesInTheGame[i]);
                    }
                }
            }
        }
        //Creates an object of all kills, knocks and damages of a selected player
        selectedPlayerKillsKnocksAndDamages = {
            kills: selectedPlayerKills,
            knocks: selectedPlayerKnocks,
            damages: selectedPlayerDamages
        };
        resolve (selectedPlayerKillsKnocksAndDamages);
    });
}