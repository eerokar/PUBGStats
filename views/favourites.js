const matchIds = document.getElementById("matchIds").innerText;
const userName = document.getElementById("name").innerText;
const pubgName = document.getElementById("pubgname").innerText;
console.log(matchIds);
const url = 'https://localhost:3000';


// Getting hte JSON of recent matches
request = new XMLHttpRequest;
request.open('GET', url + '/favouriteMatches/' + matchIds, true);

request.onload = function() {
    if (request.status >= 200 && request.status < 400){
        // Success!

        const data = JSON.parse(request.responseText);
        for(var i in data) {
            //Create button
            const match = document.createElement("div");
            const matchimageDiv = document.createElement("div");
            const matchimage = document.createElement("img");
            const mapNameText = document.createElement('div');
            const mapDetailsText = document.createElement('div');
            const removeFavBtn = document.createElement("button");
            const removeIcon = document.createElement("img");

            match.setAttribute('matchId', data[i].matchId);
            match.setAttribute('class', 'matchesImageDiv');

            mapNameText.setAttribute('class', 'matchNameText');
            mapDetailsText.setAttribute('class', 'matchDetailsText');

            removeFavBtn.setAttribute('class', 'removeButton');
            removeIcon.setAttribute('class', 'icon');
            removeIcon.src = '../../../image-assets/remove-icon.png';

            removeFavBtn.addEventListener("click", function(){
                event.stopPropagation();
                const removeDetails = {
                    userName: userName,
                    matchId: match.getAttribute('matchId'),
                };
                const request = new XMLHttpRequest;
                request.open('POST', url + '/users/removeFav', true);
                request.setRequestHeader('Content-Type', 'application/json');
                request.send(JSON.stringify(removeDetails));
                location.reload();
            });

            match.addEventListener("click", function(){
                request.open('GET', url + '/matchDetails/' + this.getAttribute('matchId') + '/' + pubgName + '/' + userName, true);
                request.send();
                window.location.href = url + '/matchDetails/' + this.getAttribute('matchId') + '/' + pubgName + '/' + userName;
            });

            //Change button text according to the map's name
            if(data[i].matchDetails.mapName === 'Erangel_Main'){
                matchimage.src = '../../../image-assets/erangel.png';
                mapNameText.innerText = 'Erangel';
            }
            if(data[i].matchDetails.mapName === 'Desert_Main'){
                matchimage.src = '../../../image-assets/miramar.png';
                mapNameText.innerText = 'Miramar';
            }
            if(data[i].matchDetails.mapName === 'Savage_Main'){
                matchimage.src = '../../../image-assets/sanhok.png';
                mapNameText.innerText = 'Sanhok';
            }
            if(data[i].matchDetails.mapName === 'DihorOtok_Main'){
                matchimage.src = '../../../image-assets/vikendi.png';
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
            removeFavBtn.appendChild(removeIcon);
            matchimageDiv.appendChild(removeFavBtn);
            matchimageDiv.appendChild(matchimage);
            match.appendChild(matchimageDiv);
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