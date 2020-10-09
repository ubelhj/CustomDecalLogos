const fs = require("fs");
var async = require("async");

console.log(process.argv);
console.log(process.argv.length);

// args
// 0 node location
// 1 current location
// 2 image location
// 3 new name
// 4 car type
if (process.argv.length = 4) {
    console.log(process.argv[2]);
    console.log(process.argv[3]);
    run(process.argv[2], process.argv[3]);
} else if (process.argv.length = 5) {
    console.log(process.argv[2]);
    console.log(process.argv[3]);
    console.log(process.argv[4]);
    run(process.argv[2], process.argv[3], process.argv[4]);
}

async function run(logoLoc, logoName, carType) {
    var carType = typeof carType  !== 'undefined' ?  carType  : 22;

    let decalNames = require("./img/" + carType + "/decalnames.json");

    let jsonVal = [];
    let creator = require("./CreateDecal");

    let skinLocation = "C:\\Program Files (x86)\\Steam\\steamapps\\common\\rocketleague\\Binaries\\Win64\\bakkesmod\\data\\acplugin\\DecalTextures";

    let dir = skinLocation + "/" + logoName + "/";

    await async.each(decalNames, function(decalName, callback) {
        creator.draw(logoLoc, logoName, carType, decalName, false);
        jsonVal[decalName] = {
            "BodyID": parseInt(carType),
                "SkinID": 0,
                "Body": {
                    "Diffuse": logoName + "/diffuse.png",
                    "Skin": logoName + "/" + decalName + ".png"
                }
            }
        callback();
    }, function(err){

    });

    // create new directory
    try {
        // first check if directory already exists
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
            console.log("Directory is created.");
        } else {
            console.log("Directory already exists.");
        }
    } catch (err) {
        console.log(err);
    }

    fs.writeFile(dir + logoName + ".json", JSON.stringify(jsonVal), (err) => {
        if (err) {
            throw err;
        }
        console.log("JSON data is saved.");
    });
}

async function drawAll(decalNames) {
    
    let creator = require("./CreateDecal");
    var jsonArray = [decalNames.size];
    var counter = 0;
    for (let i = 0; i < decalNames.size; i++) {
        creator.draw(logoLoc, logoName, carType, decalNames[i], false).then(function (err, result) {
            jsonVal[decalNames[i]] = {
                "BodyID": parseInt(carType),
                    "SkinID": 0,
                    "Body": {
                        "Diffuse": logoName + "/diffuse.png",
                        "Skin": logoName + "/" + decalNames[i] + ".png"
                    }
                }
            if(counter == jsonArray.length - 1) {
                return jsonArray;
            }
            counter++;
        });
    }
}