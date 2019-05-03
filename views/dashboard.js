const userName = document.getElementById("name").innerText;
const pubgName = document.getElementById("pubgname").innerText;
const url = 'https://env-0097919.jelastic.metropolia.fi';
//const url = 'http://localhost:3000';

//Loader
const loadingIcon = document.createElement("div");
loadingIcon.setAttribute('class', 'loader');
document.body.appendChild(loadingIcon);

// Getting the JSON of recent matches
request = new XMLHttpRequest;
request.open('GET', url + '/playerName/' + pubgName, true);

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
            const datePlayedText = document.createElement('div');
            const datePlayed = data[i].matchDetails.createdAt;
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
            datePlayedText.setAttribute('class', 'datePlayedText');

            match.addEventListener("click", function(){
                request.open('GET', url + '/matchDetails/' + this.getAttribute('matchId') + '/' + pubgName + '/' + userName, true);
                request.send();
                window.location.href = url + '/matchDetails/' + this.getAttribute('matchId') + '/' + pubgName + '/' + userName;
            });

            //Change button text according to the map's name
            if(data[i].matchDetails.mapName === 'Erangel_Main'){
                matchimage.src = './image-assets/erangel.png';
                mapNameText.innerText = 'Erangel';
            }
            if(data[i].matchDetails.mapName === 'Desert_Main'){
                matchimage.src = './image-assets/miramar.png';
                mapNameText.innerText = 'Miramar';
            }
            if(data[i].matchDetails.mapName === 'Savage_Main'){
                matchimage.src = './image-assets/sanhok.png';
                mapNameText.innerText = 'Sanhok';
            }
            if(data[i].matchDetails.mapName === 'DihorOtok_Main'){
                matchimage.src = './image-assets/vikendi.png';
                mapNameText.innerText = 'Vikendi';
            }

            //Change game mode text
            if(data[i].matchDetails.gameMode === 'solo-fpp') {
                mapDetailsText.innerText = 'Solo FPP';
            }
            else if(data[i].matchDetails.gameMode === 'solo-tpp') {
                mapDetailsText.innerText = 'Solo TPP';
            }
            else if(data[i].matchDetails.gameMode === 'duo-fpp') {
                mapDetailsText.innerText = 'Duo FPP';
            }
            else if(data[i].matchDetails.gameMode === 'duo-tpp') {
                mapDetailsText.innerText = 'Duo TPP';
            }
            else if(data[i].matchDetails.gameMode === 'squad-fpp') {
                mapDetailsText.innerText = 'Squad FPP';
            }
            else if(data[i].matchDetails.gameMode === 'squad-tpp') {
                mapDetailsText.innerText = 'Squad TPP';
            } else {
                mapDetailsText.innerText = 'Custom';
            }
            let killcount = await getKillsAndKnocksOfTheGame(data[i].matchId, 'kills');
            let knockcount = await getKillsAndKnocksOfTheGame(data[i].matchId, 'knocks');
            killcountText.innerText = 'Kills: ' + killcount;
            knockcountText.innerText = 'Knocks: ' + knockcount;

            datePlayedText.innerText = 'Played at: \n ' + dateWithSpace;

            matchimage.style.borderRadius = '15px';

            match.appendChild(matchimage);
            match.appendChild(mapNameText);
            match.appendChild(mapDetailsText);
            match.appendChild(killcountText);
            match.appendChild(knockcountText);
            match.appendChild(datePlayedText);

            if(document.body.contains(loadingIcon)) {
                document.body.removeChild(loadingIcon);
            }
            document.body.appendChild(match);
        }

//------Erroreita----//
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
        killsRequest.open('GET', url + '/matchDetailsNoRender/' + matchId + '/' + pubgName, true);
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

