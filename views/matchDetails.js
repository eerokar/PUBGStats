'use strict';
const responseText = document.getElementById("data").innerText;
const userName = document.getElementById("userName").innerText;
const matchId = document.getElementById("matchId").innerText;
const data = JSON.parse(responseText);
const url = 'https://env-0097919.jelastic.metropolia.fi';
//const url = 'http://localhost:3000'; //For testing in localhost

var isFavourited;

const saveObject = {
    userName: userName,
    matchId: matchId,
    match: responseText
};

const saveToFavsBtn = document.getElementById('saveToFavsBtn');
checkIfValueExists();

//Change the functionality of the add/remove favourite button
async function checkIfValueExists(){
    let doesExsist = await getFavExistsValue();
    if (doesExsist === 'true'){
        isFavourited = true;
        saveToFavsBtn.innerText = 'Remove from favourites'
    }else{
        isFavourited = false;
        saveToFavsBtn.innerText = 'Save to favourites'
    }
}

//Check if the match is in favourites
async function getFavExistsValue() {
return new Promise(function(resolve) {
        let checkRequest = new XMLHttpRequest;
        checkRequest.open('GET', url + '/users/checkIfExists/' + userName + '/' + matchId, true);
        checkRequest.onload = function () {
                let value = checkRequest.response;
                resolve(value);
        };
        checkRequest.send();
    });
}

//Save this match to favourites or remove it from the favourites
saveToFavsBtn.addEventListener("click", function(){
    if(!isFavourited) {
        const request = new XMLHttpRequest;
        request.open('POST', url + '/users/saveFav', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify(saveObject));
        window.location.reload(true);
    }else{
        const removeDetails = {
            userName: userName,
            matchId: matchId,
        };
        const request = new XMLHttpRequest;
        request.open('DELETE', url + '/users/removeFav', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify(removeDetails));
        window.location.reload(true);
    }
});

//Object for victim stats
const victimStats = {
    name: '',
    areaHit: '',
    gunShotWith: '',
    damageDone: 0
};

//Arrays for kills, knocks and damages
const killedVictims = [];
const knockedVictims = [];
const woundedVictims = [];

//Kills
for (var i in data.kills){
    victimStats[i] = {
        name: data.kills[i].victim.name,
        areaHit: data.kills[i].damageReason,
        gunShotWith: data.kills[i].damageCauserName
    };
    killedVictims.push(victimStats[i]);
}

//Knocks
for (var i in data.knocks){
    victimStats[i] = {
        name: data.knocks[i].victim.name,
        areaHit: data.knocks[i].damageReason,
        gunShotWith: data.knocks[i].damageCauserName
    };
    knockedVictims.push(victimStats[i]);
}

//Damages
for (var i in data.damages){
    if (data.damages[i].damage !== 0) {
        victimStats[i] = {
            name: data.damages[i].victim.name,
            areaHit: data.damages[i].damageReason,
            gunShotWith: data.damages[i].damageCauserName,
            damageDone: data.damages[i].damage
    };
        woundedVictims.push(victimStats[i]);
    }
}

renderKillStats(killedVictims);

renderKnockStats(playerKnockedStatistics(knockedVictims));

renderDamageStats(playerWoundedStatistics(woundedVictims));

//Functions

//Render kills
function renderKillStats(killedStats) {
    const killsDiv = document.createElement('div');

    killsDiv.setAttribute('class', 'statsBackground');
    killsDiv.innerText = 'Kills: '+ killedStats.length + '\n\n';

    for (var i in killedStats) {
        const killedPlayer = document.createElement('div');
        killedPlayer.className = "card card-body text-left";
        killedPlayer.innerText =
            'Player: ' + killedStats[i].name + ' \n' +
            'Killed with: ' + weaponNameConverter(killedStats[i].gunShotWith) + ' \n' +
            'Hit area: ' + hitAreaConverter(killedStats[i].areaHit)+ ' \n';
        killsDiv.appendChild(killedPlayer);
    }
    document.body.appendChild(killsDiv);
}

//Render knocks
function renderKnockStats(knockedVics) {
    const knocksDiv  = document.createElement('div');

    knocksDiv.setAttribute('class', 'statsBackground');
    knocksDiv.innerText = 'Knocks: ' + objectSize(knockedVics) + '\n\n';

    for(var i in knockedVics) {
        const knockedPlayer = document.createElement('div');
        knockedPlayer.className = "card card-body text-left";
        const thisVictimStats = knockedVics[i];
        knockedPlayer.innerText =
            'Player: ' + thisVictimStats[0].name + ' \n' +
            'knocked: ' + thisVictimStats.length + ' times\n';

            for (var i in thisVictimStats) {
                const knockStats = document.createElement('div');
                knockStats.innerText =
                    'Knocked with ' + weaponNameConverter(thisVictimStats[i].gunShotWith) + ' \n' +
                    'Hit area: ' + hitAreaConverter(thisVictimStats[i].areaHit)+ '. \n';
                knockedPlayer.appendChild(knockStats);
        }
        knocksDiv.appendChild(knockedPlayer);
    }
    document.body.appendChild(knocksDiv);
}

//Render Damages
function renderDamageStats(woundedVictims) {
    const damagesDiv = document.createElement('div');
    const totalDamageInGameDiv = document.createElement('div');

    damagesDiv.setAttribute('class', 'statsBackground');
    totalDamageInGameDiv.className = "card card-body4 text-left";

    damagesDiv.innerText = "Damages: \n\n";

    var totalDamage = 0;
    var totalDamageToOnePlayer = 0;

    for(var i in woundedVictims){
        const woundedPlayer = document.createElement('div');
        const totalDamageToPlayerDiv = document.createElement('div');

        woundedPlayer.className = "card card-body text-left";
        totalDamageToPlayerDiv.className = "card card-body3 text-left";

        const thisVictimStats = woundedVictims[i];

        woundedPlayer.innerText =
            'Player: ' + thisVictimStats[0].name + ' \n' +
            'Times hit: ' + thisVictimStats.length + ' \n\n' +
            'individual hits: ';

            for (var i in thisVictimStats){
                var individualHitsDiv = document.createElement('div');
                individualHitsDiv.className = "card card-body2 text-left";
                individualHitsDiv.innerText =
                    'Weapon: ' + weaponNameConverter(thisVictimStats[i].gunShotWith) + ' \n' +
                    'Area: ' + hitAreaConverter(thisVictimStats[i].areaHit) + '\n' +
                    'Damage: ' + thisVictimStats[i].damageDone.toFixed(2) + ' points \n\n';
                totalDamage = totalDamage + thisVictimStats[i].damageDone;
                totalDamageToOnePlayer = totalDamageToOnePlayer + thisVictimStats[i].damageDone;
                totalDamageToPlayerDiv.innerText = 'Total damage done to player: ' + totalDamageToOnePlayer.toFixed(2)+ ' points';

                woundedPlayer.appendChild(individualHitsDiv);
                woundedPlayer.appendChild(totalDamageToPlayerDiv);
             }
            damagesDiv.appendChild(woundedPlayer);
        totalDamageToOnePlayer = 0;
    }
    totalDamageInGameDiv.innerText = 'Total damage done in the game: ' + totalDamage.toFixed(2) + ' points';
    damagesDiv.appendChild(totalDamageInGameDiv);
    document.body.appendChild(damagesDiv);

}

//Knocked statistics
function playerKnockedStatistics(victims) {
    const playersKnocked = {};

    for (var i in victims) {
        const thisVictim = victims[i];

        if (playersKnocked.hasOwnProperty(thisVictim.name)) {
            playersKnocked[thisVictim.name].push(thisVictim);
        }else{
            playersKnocked[thisVictim.name] = [];
            playersKnocked[thisVictim.name].push(thisVictim)
        }
    }
    return(playersKnocked);
}

//Wounded statistics
function playerWoundedStatistics(victims) {
    const playersWounded = {};

    for (var i in victims) {
        const thisVictim = victims[i];

        if (playersWounded.hasOwnProperty(thisVictim.name)) {
            playersWounded[thisVictim.name].push(thisVictim);
        }else{
            playersWounded[thisVictim.name] = [];
            playersWounded[thisVictim.name].push(thisVictim)
        }
    }
    return(playersWounded);
}

//Calculates the size of an object
function objectSize(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
}

//Converters

//Hit area
function hitAreaConverter(hitArea) {
    const convertedHitArea = {
        "HeadShot": "Head",
        "TorsoShot": "Torso",
        "ArmShot": "Arm",
        "LegShot": "Leg",
        "PelvisShot": "Pelvis",
        "NonSpecific": "Whole body",
        "None": "Bleed out"
    };
    return convertedHitArea[hitArea];
}

//Weapon name
function weaponNameConverter(weapon){
    const convertedName = {
        "AquaRail_A_01_C": "Aquarail",
        "AquaRail_A_02_C": "Aquarail",
        "AquaRail_A_03_C": "Aquarail",
        "BattleRoyaleModeController_Def_C": "Bluezone",
        "BattleRoyaleModeController_Desert_C": "Bluezone",
        "BattleRoyaleModeController_DihorOtok_C": "Bluezone",
        "BattleRoyaleModeController_Savage_C": "Bluezone",
        "Boat_PG117_C": "PG-117",
        "BP_M_Rony_A_01_C": "Rony",
        "BP_M_Rony_A_02_C": "Rony",
        "BP_M_Rony_A_03_C": "Rony",
        "BP_Mirado_A_02_C": "Mirado",
        "BP_Mirado_Open_03_C": "Mirado (open top)",
        "BP_Mirado_Open_04_C": "Mirado (open top)",
        "BP_MolotovFireDebuff_C": "Molotov Fire Damage",
        "BP_Motorbike_04_C": "Motorcycle",
        "BP_Motorbike_04_Desert_C": "Motorcycle",
        "BP_Motorbike_04_SideCar_C": "Motorcycle (w/ Sidecar)",
        "BP_Motorbike_04_SideCar_Desert_C": "Motorcycle (w/ Sidecar)",
        "BP_Niva_01_C": "Zima",
        "BP_Niva_02_C": "Zima",
        "BP_Niva_03_C": "Zima",
        "BP_Niva_04_C": "Zima",
        "BP_PickupTruck_A_01_C": "Pickup Truck (closed top)",
        "BP_PickupTruck_A_02_C": "Pickup Truck (closed top)",
        "BP_PickupTruck_A_03_C": "Pickup Truck (closed top)",
        "BP_PickupTruck_A_04_C": "Pickup Truck (closed top)",
        "BP_PickupTruck_A_05_C": "Pickup Truck (closed top)",
        "BP_PickupTruck_B_01_C": "Pickup Truck (open top)",
        "BP_PickupTruck_B_02_C": "Pickup Truck (open top)",
        "BP_PickupTruck_B_03_C": "Pickup Truck (open top)",
        "BP_PickupTruck_B_04_C": "Pickup Truck (open top)",
        "BP_PickupTruck_B_05_C": "Pickup Truck (open top)",
        "BP_Scooter_01_A_C": "Scooter",
        "BP_Scooter_02_A_C": "Scooter",
        "BP_Scooter_03_A_C": "Scooter",
        "BP_Scooter_04_A_C": "Scooter",
        "BP_Snowbike_01_C": "Snowbike",
        "BP_Snowbike_02_C": "Snowbike",
        "BP_Snowmobile_01_C": "Snowmobile",
        "BP_Snowmobile_02_C": "Snowmobile",
        "BP_Snowmobile_03_C": "Snowmobile",
        "BP_TukTukTuk_A_01_C": "Tukshai",
        "BP_TukTukTuk_A_02_C": "Tukshai",
        "BP_TukTukTuk_A_03_C": "Tukshai",
        "BP_Van_A_01_C": "Van",
        "BP_Van_A_02_C": "Van",
        "BP_Van_A_03_C": "Van",
        "Buff_DecreaseBreathInApnea_C": "Drowning",
        "Buggy_A_01_C": "Buggy",
        "Buggy_A_02_C": "Buggy",
        "Buggy_A_03_C": "Buggy",
        "Buggy_A_04_C": "Buggy",
        "Buggy_A_05_C": "Buggy",
        "Buggy_A_06_C": "Buggy",
        "Dacia_A_01_v2_C": "Dacia",
        "Dacia_A_01_v2_snow_C": "Dacia",
        "Dacia_A_02_v2_C": "Dacia",
        "Dacia_A_03_v2_C": "Dacia",
        "Dacia_A_04_v2_C": "Dacia",
        "None": "None",
        "PG117_A_01_C": "PG-117",
        "PlayerFemale_A_C": " - ",
        "PlayerMale_A_C": " - ",
        "ProjGrenade_C": "Frag Grenade",
        "ProjMolotov_C": "Molotov Cocktail",
        "ProjMolotov_DamageField_Direct_C": "Molotov Cocktail Fire Field",
        "RedZoneBomb_C": "Redzone",
        "Uaz_A_01_C": "UAZ (open top)",
        "Uaz_B_01_C": "UAZ (soft top)",
        "Uaz_C_01_C": "UAZ (hard top)",
        "WeapAK47_C": "AKM",
        "WeapAUG_C": "AUG A3",
        "WeapAWM_C": "AWM",
        "WeapBerreta686_C": "S686",
        "WeapBerylM762_C": "Beryl",
        "WeapBizonPP19_C": "Bizon",
        "WeapCowbar_C": "Crowbar",
        "WeapCrossbow_1_C": "Crossbow",
        "WeapDP28_C": "DP-28",
        "WeapFNFal_C": "SLR",
        "WeapG18_C": "P18C",
        "WeapG36C_C": "G36C",
        "WeapGroza_C": "Groza",
        "WeapHK416_C": "M416",
        "WeapKar98k_C": "Kar98k",
        "WeapM16A4_C": "M16A4",
        "WeapM1911_C": "P1911",
        "WeapM249_C": "M249",
        "WeapM24_C": "M24",
        "WeapM9_C": "P92",
        "WeapMachete_C": "Machete",
        "WeapMini14_C": "Mini 14",
        "WeapMk14_C": "Mk14 EBR",
        "WeapMk47Mutant_C": "Mk47 Mutant",
        "WeapMP5K_C": "MP5K",
        "WeapNagantM1895_C": "R1895",
        "WeapPan_C": "Pan",
        "WeapQBU88_C": "QBU88",
        "WeapQBZ95_C": "QBZ95",
        "WeapRhino_C": "R45",
        "WeapSaiga12_C": "S12K",
        "WeapSawnoff_C": "Sawed-off",
        "WeapSCAR-L_C": "SCAR-L",
        "WeapSickle_C": "Sickle",
        "WeapSKS_C": "SKS",
        "WeapThompson_C": "Tommy Gun",
        "WeapUMP_C": "UMP45",
        "WeapUZI_C": "Micro Uzi",
        "WeapVector_C": "Vector",
        "WeapVSS_C": "VSS",
        "Weapvz61Skorpion_C": "Skorpion",
        "WeapWin94_C": "Win94",
        "WeapWinchester_C": "S1897"
    };
    return convertedName[weapon];
}

