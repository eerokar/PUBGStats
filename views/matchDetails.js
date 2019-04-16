var responseText = document.getElementById("data").innerText;
var data = JSON.parse(responseText);

var DOMobject = document.createElement('div');
DOMobject.id = 'myDiv';
DOMobject.style.width = 'fit-content';
DOMobject.style.height = 'fit-content';
DOMobject.style.background = 'green';

console.log(data);

victimStats = {
    name: '',
    areaHit: '',
    gunShotWith: '',
    damageDone: 0
};

var killedVictims = [];
var knockedVictims = [];
var woundedVictims = [];

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
    var killsDiv = document.createElement('div');
    killsDiv.className = "card card-body text-center";
    killsDiv.innerText = 'Kills: '+ killedStats.length+ '\n\n';

    for (var i in killedStats) {
        var killedPlayer = document.createElement('div');
        killedPlayer.innerText =
            'Player: ' + killedStats[i].name + ' \n' +
            'Killed with: ' + weaponNameConverter(killedStats[i].gunShotWith) + '. \n' +
            'Hit area: ' + hitAreaConverter(killedStats[i].areaHit)+ '. \n\n';
        killsDiv.appendChild(killedPlayer);
    }
    document.body.appendChild(killsDiv);
}

//Render knocks
function renderKnockStats(knockedVics) {
    var knocksDiv  = document.createElement('div');

    knocksDiv.className = "card card-body text-center";
    knocksDiv.innerText = 'Knocks: \n\n';

    for(var i in knockedVics) {
        var knockedPlayer = document.createElement('div');
        knockedPlayer.className = "card card-body text-left";
        var thisVictimStats = knockedVics[i];
        knockedPlayer.innerText =
            'Player: \n' + thisVictimStats[0].name + ' \n' +
            'knocked: ' + thisVictimStats.length + ' times.\n';

            for (var i in thisVictimStats) {
                var knockStats = document.createElement('div');
                knockStats.innerText =
                    'Knocked with ' + weaponNameConverter(thisVictimStats[i].gunShotWith) + '. Hit area: ' + hitAreaConverter(thisVictimStats[i].areaHit)+ '. \n';
                knockedPlayer.appendChild(knockStats);
        }
        knocksDiv.appendChild(knockedPlayer);
    }
    document.body.appendChild(knocksDiv);
}

//Render Damages
function renderDamageStats(woundedVictims) {
    var damagesDiv = document.createElement('div');
    var totalDamageInGameDiv = document.createElement('div');
    damagesDiv.className = "card card-body text-center";
    totalDamageInGameDiv.className = "card card-body text-left";

    damagesDiv.innerText = "Damages: \n\n";

    var totalDamage = 0;
    var totalDamageToOnePlayer = 0;

    for(var i in woundedVictims){
        var woundedPlayer = document.createElement('div');
        var totalDamageToPlayerDiv = document.createElement('div');
        woundedPlayer.className = "card card-body text-center";
        totalDamageToPlayerDiv.className = "card card-body text-left";
        var thisVictimStats = woundedVictims[i];
        woundedPlayer.innerText =
            'Player: \n' + thisVictimStats[0].name + ' \n' +
            'Hit ' + thisVictimStats.length + ' times.' + ' \n\n' +
            'individual hits: ';
            for (var i in thisVictimStats){
                var individualHitsDiv = document.createElement('div');
                individualHitsDiv.className = "card card-body text-left";
                individualHitsDiv.innerText =
                    'Weapon: ' + weaponNameConverter(thisVictimStats[i].gunShotWith) + ' \n' +
                    'Area: ' + hitAreaConverter(thisVictimStats[i].areaHit) + '\n' +
                    'Damage: ' + thisVictimStats[i].damageDone.toFixed(2) + ' points. \n\n';
                totalDamage = totalDamage + thisVictimStats[i].damageDone;
                totalDamageToOnePlayer = totalDamageToOnePlayer + thisVictimStats[i].damageDone;
                totalDamageToPlayerDiv.innerText = 'Total damage done to player: ' + totalDamageToOnePlayer.toFixed(2);
                woundedPlayer.appendChild(individualHitsDiv);
                woundedPlayer.appendChild(totalDamageToPlayerDiv);
             }
            damagesDiv.appendChild(woundedPlayer);
        totalDamageToOnePlayer = 0;
    }
    totalDamageInGameDiv.innerText = 'Total damage done in the game: ' + totalDamage.toFixed(2);
    damagesDiv.appendChild(totalDamageInGameDiv);
    document.body.appendChild(damagesDiv);

}

//Knocked statistics
function playerKnockedStatistics(victims) {
    var playersKnocked = {};

    for (var i in victims) {
        var thisVictim = victims[i];

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
    var playersWounded = {};

    for (var i in victims) {
        var thisVictim = victims[i];

        if (playersWounded.hasOwnProperty(thisVictim.name)) {
            playersWounded[thisVictim.name].push(thisVictim);
        }else{
            playersWounded[thisVictim.name] = [];
            playersWounded[thisVictim.name].push(thisVictim)
        }
    }
    return(playersWounded);
}

//Converters

//Hit area
function hitAreaConverter(hitArea) {
    var convertedHitArea = {
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
    var convertedName = {
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
        "PlayerFemale_A_C": "-",
        "PlayerMale_A_C": "-",
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
        "WeapUMP_C": "UMP9",
        "WeapUZI_C": "Micro Uzi",
        "WeapVector_C": "Vector",
        "WeapVSS_C": "VSS",
        "Weapvz61Skorpion_C": "Skorpion",
        "WeapWin94_C": "Win94",
        "WeapWinchester_C": "S1897"
    };
    return convertedName[weapon];
}

