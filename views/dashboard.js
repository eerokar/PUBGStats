'use strict';
const userName = document.getElementById("name").innerText;
const pubgName = document.getElementById("pubgname").innerText;
const url = 'https://env-0097919.jelastic.metropolia.fi';
//const url = 'http://localhost:3000'; //For testing in localhost

//Loader
const loadingIcon = document.createElement("div");
loadingIcon.setAttribute('class', 'loader');
document.body.appendChild(loadingIcon);

// Getting the JSON of recent matches
const request = new XMLHttpRequest;
request.open('GET', url + '/matches/playerName/' + pubgName, true);

request.onload = async function() {
    if (request.status >= 200 && request.status < 400){
        // Success!
        const data = JSON.parse(request.responseText);
        for(var i in data) {
            //Create button
            const match = document.createElement("div");
            const matchimage = document.createElement("img");
            const mapNameText = document.createElement('div');
            const mapDetailsText = document.createElement('div');
            const killcountText = document.createElement('div');
            const knockcountText = document.createElement('div');
            const positionText = document.createElement('div');
            const datePlayedText = document.createElement('div');
            const datePlayed = data[i].matchDetails.basics.createdAt;
            var dateConverted = new Date(datePlayed).toLocaleString('en-GB');
            var dateWithDots = dateConverted.replace(/\//g, '.');
            var dateWithSpace = dateWithDots.replace(/,/g, '\n');
            match.setAttribute('matchId', data[i].matchId);
            match.setAttribute('class', 'matchesImageDiv');
            matchimage.setAttribute('class', 'matchesImage');
            mapNameText.setAttribute('class', 'matchNameText');
            mapDetailsText.setAttribute('class', 'matchDetailsText');
            killcountText.setAttribute('class', 'killCountText');
            knockcountText.setAttribute('class', 'knockCountText');
            positionText.setAttribute('class', 'positionText');
            datePlayedText.setAttribute('class', 'datePlayedText');

            match.addEventListener("click", function(){
                request.open('GET', url + '/matches/matchDetailsRender/' + this.getAttribute('matchId') + '/' + pubgName + '/' + userName, true);
                request.send();
                window.location.href = url + '/matches/matchDetailsRender/' + this.getAttribute('matchId') + '/' + pubgName + '/' + userName;
            });

            //Change button text according to the map's name
            let mapName = data[i].matchDetails.basics.mapName;

            if(mapName === 'Erangel_Main'){
                matchimage.src = './image-assets/erangel.png';
                mapNameText.innerText = 'Erangel';
            }
            if(mapName === 'Desert_Main'){
                matchimage.src = './image-assets/miramar.png';
                mapNameText.innerText = 'Miramar';
            }
            if(mapName === 'Savage_Main'){
                matchimage.src = './image-assets/sanhok.png';
                mapNameText.innerText = 'Sanhok';
            }
            if(mapName === 'DihorOtok_Main'){
                matchimage.src = './image-assets/vikendi.png';
                mapNameText.innerText = 'Vikendi';
            }

            //Change game mode text
            let gameMode = data[i].matchDetails.basics.gameMode;

            if(gameMode === 'solo-fpp') {
                mapDetailsText.innerText = 'Solo FPP';
            }
            else if(gameMode === 'solo-tpp') {
                mapDetailsText.innerText = 'Solo TPP';
            }
            else if(gameMode === 'duo-fpp') {
                mapDetailsText.innerText = 'Duo FPP';
            }
            else if(gameMode === 'duo-tpp') {
                mapDetailsText.innerText = 'Duo TPP';
            }
            else if(gameMode === 'squad-fpp') {
                mapDetailsText.innerText = 'Squad FPP';
            }
            else if(gameMode === 'squad-tpp') {
                mapDetailsText.innerText = 'Squad TPP';
            } else {
                mapDetailsText.innerText = 'Custom';
            }

            let killcount = await getKillsAndKnocksOfTheGame(data[i].matchId, 'kills');
            let knockcount = await getKillsAndKnocksOfTheGame(data[i].matchId, 'knocks');

            killcountText.innerText = 'Kills: ' + killcount;
            knockcountText.innerText = 'Knocks: ' + knockcount;

            positionText.innerText = '#' + data[i].matchDetails.position;

            datePlayedText.innerText = 'Played at: \n ' + dateWithSpace;

            matchimage.style.borderRadius = '15px';

            match.appendChild(matchimage);
            match.appendChild(mapNameText);
            match.appendChild(mapDetailsText);
            match.appendChild(killcountText);
            match.appendChild(knockcountText);
            match.appendChild(positionText);
            match.appendChild(datePlayedText);

            if(document.body.contains(loadingIcon)) {
                document.body.removeChild(loadingIcon);
            }
            document.body.appendChild(match);
        }

//------Errors----//
    } else {
        console.log("We reached our target server, but it returned an error")
    }
};
request.onerror = function() {
    console.log("here was a connection error of some sort")
};
//-----------------//

request.send();

async function getKillsAndKnocksOfTheGame(matchId, type) {
    return new Promise(function(resolve) {
        let killsRequest = new XMLHttpRequest;
        killsRequest.open('GET', url + '/matches/matchDetails/' + matchId + '/' + pubgName, true);
        killsRequest.onload = function () {
            if(type === 'kills') {
                const data = JSON.parse(killsRequest.responseText);
                let killcount = data.kills.length;
                resolve(killcount);
            }
            if(type === 'knocks') {
                const data = JSON.parse(killsRequest.responseText);
                let knockcount = data.knocks.length;
                resolve(knockcount);
            }
        };
        killsRequest.send();
    });
}

