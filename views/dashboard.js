var data = JSON;
const pubgName = document.getElementById("pubgname").innerText;

const url = 'https://localhost:3000';

// Vastaanotetaan JSON ja haetaan kuvat näkyville
request = new XMLHttpRequest;
request.open('GET', url + '/playerName/' + pubgName, true);
request.onload = function() {
    if (request.status >= 200 && request.status < 400){
        // Success!

        data = JSON.parse(request.responseText);
        for(var i in data) {
            //Create button
            var match = document.createElement("div");
            var matchimage = document.createElement("img");
            var mapNameText = document.createElement('div');
            var mapDetailsText = document.createElement('div');
            match.setAttribute('matchId', data[i].matchId);
            match.setAttribute('class', 'matchesImageDiv');
            mapNameText.setAttribute('class', 'matchNameText');
            mapDetailsText.setAttribute('class', 'matchDetailsText');

            match.addEventListener("click", function(){
                request.open('GET', url + '/matchDetails/' + this.getAttribute('matchId') + '/' + pubgName, true);
                request.send();
                window.location.replace(url + '/matchDetails/' + this.getAttribute('matchId') + '/' + pubgName);
            });

            //Change button text according to the map's name
            console.log(data[i]);
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
            //match.onclick = onClick;
            match.appendChild(matchimage);
            match.appendChild(mapNameText);
            match.appendChild(mapDetailsText);



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
//-----------//
request.send();

