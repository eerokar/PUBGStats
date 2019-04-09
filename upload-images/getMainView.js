var data = JSON;

var matchBasicsData = JSON;

const url = 'https://localhost:3000';

// Vastaanotetaan JSON ja haetaan kuvat näkyville
request = new XMLHttpRequest;
request.open('GET', url + '/playerName/GYROFIN', true);
request.onload = function() {
    if (request.status >= 200 && request.status < 400){
        // Success!
        data = JSON.parse(request.responseText);
        for(var i in data) {
            //Create button
            var match = document.createElement("img");
            match.setAttribute('matchId', data[i].matchId);
            //match.setAttribute('telemetryURL', data[i].matchDetails.telemetryEventsURL);

            //Change button text according to the map's name
            if(data[i].matchDetails.mapName === 'Erangel_Main'){
                match.src = './upload-images/erangel.png';
            }
            if(data[i].matchDetails.mapName === 'Desert_Main'){
                match.src = './upload-images/miramar.png';
            }
            if(data[i].matchDetails.mapName === 'Savage_Main'){
                match.src = './upload-images/sanhok.png';
            }
            if(data[i].matchDetails.mapName === 'DihorOtok_Main'){
                match.src = './upload-images/vikendi.png';
            }
            match.onclick = onClick;
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
    console.log(e.path[0].attributes[0].value);
    var matchId = e.path[0].attributes[0].value;
    window.location.replace(url + '/matchDetails/' + matchId);
}


