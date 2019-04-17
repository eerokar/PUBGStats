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
            match.setAttribute('matchId', data[i].matchId);
            match.setAttribute('class', 'matchesImageDiv');
            mapNameText.setAttribute('class', 'matchName');

            //Change button text according to the map's name
            if(data[i].matchDetails.mapName === 'Erangel_Main'){
                matchimage.src = './upload-images/erangel.png';
                mapNameText.innerText = 'Erangel';
            }
            if(data[i].matchDetails.mapName === 'Desert_Main'){
                matchimage.src = './upload-images/miramar.png';
                mapNameText.innerText = 'Miramar';
            }
            if(data[i].matchDetails.mapName === 'Savage_Main'){
                matchimage.src = './upload-images/sanhok.png';
                mapNameText.innerText = 'Sanhok';
            }
            if(data[i].matchDetails.mapName === 'DihorOtok_Main'){
                matchimage.src = './upload-images/vikendi.png';
                mapNameText.innerText = 'Vikendi';
            }
            match.onclick = onClick;
            match.appendChild(matchimage);
            match.appendChild(mapNameText);
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

function onClick(e) {
    var matchId = e.path[1].attributes[0].value;
    request.open('GET', url + '/matchDetails/' + matchId + '/' + pubgName, true);
    request.send();
    window.location.replace(url + '/matchDetails/' + matchId + '/' + pubgName);
}


