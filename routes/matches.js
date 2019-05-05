'use strict';
const express = require('express');
const router = express.Router();

// Matches controller
const matchesController = require('../controllers/matchesController');

router.get('/playerName/:id', async (req, res) => {
    let name = req.params.id;
    let response = await matchesController.getMatches(name);
    res.send(response);
});

router.get('/favouriteMatches/:id/:pubgName', async (req, res) => {
    let favMatches = JSON.parse(req.params.id);
    let pubgName = req.params.pubgName;
    let response = await matchesController.getFavouriteMatches(favMatches, pubgName);
    res.send(response);
});

router.get('/matchDetails/:id/:pubgName', async (req, res) => {
    let matchId = req.params.id;
    let pubgName = req.params.pubgName;
    let response = await matchesController.getMatchDetails(matchId, pubgName);
    res.send(response);
});

router.get('/matchDetailsRender/:id/:pubgName/:userName', async (req, res) => {
    let matchId = req.params.id;
    let pubgName = req.params.pubgName;
    let userName = req.params.userName;
    let response = await matchesController.getMatchDetails(matchId, pubgName);
    res.render('matchDetails',{ statistics: response, userName: userName, matchId: matchId });
});

module.exports = router;