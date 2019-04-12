var responseText = document.getElementById("data").innerText;
var data = JSON.parse(responseText);

console.log(data);


victimStats = {
    name: '',
    areasHit: '',
    gunsShotWith: '',
    damageDone: 0
};

var victims = [];


var killcount =  1;
var knockcount = 1;

for (var i in data.kills){
    console.log(
        'Kill ' + killcount + ': ' + data.kills[i].victim.name + '\n' +
        'With weapon: ' + data.kills[i].damageCauserName + '\n' +
        'From a distance of ' + Math.round((data.kills[i].distance)/100) + ' meters.' + '\n' +
        'Killshot area: ' + data.kills[i].damageReason + '.'
    );
    killcount++
}

for (var i in data.knocks){
    console.log(
        'Knock ' + knockcount + ': ' + data.knocks[i].victim.name + '\n' +
        'With weapon: ' + data.knocks[i].damageCauserName + '\n' +
        'From a distance of ' + Math.round((data.knocks[i].distance)/100) + ' meters.' + '\n' +
        'Knocked from: ' + data.knocks[i].damageReason + '.'
    );
    knockcount++
}

for (var i in data.damages){
    if (data.damages[i].damage !== 0) {
        victimStats[i] = {
            name: data.damages[i].victim.name,
            areasHit: data.damages[i].damageReason,
            gunsShotWith: data.damages[i].damageCauserName,
            damageDone: data.damages[i].damage
    };
        victims.push(victimStats[i]);

        /*console.log(
            'Damage of ' + data.damages[i].damage + ' points, done to: ' + data.damages[i].victim.name + '\n' +
            'With weapon: ' + data.damages[i].damageCauserName + '\n' +
            'Damage done to area: ' + data.damages[i].damageReason + '.'
        );*/
    }
}

victimDetails = {

}
for (var i in victims){


}

console.log(victims);

