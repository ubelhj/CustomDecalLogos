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
if (process.argv.length == 5) {
    console.log(process.argv[2]);
    console.log(process.argv[3]);
    console.log(process.argv[4]);
    run(process.argv[2], process.argv[3], process.argv[4]);
} else if (process.argv.length == 4) {
    console.log(process.argv[2]);
    console.log(process.argv[3]);
    run(process.argv[2], process.argv[3]);
}

async function run(logoLoc, logoName, carType) {
    //var carType = typeof carType  !== 'undefined' ?  carType  : 22;

    let decalNames = require("./img/" + carType + "/decalnames.json");

    let jsonVal = {};

    let creator = require("./decalbuilder");

    let skinLocation = "C:\\Program Files (x86)\\Steam\\steamapps\\common\\rocketleague\\Binaries\\Win64\\bakkesmod\\data\\acplugin\\DecalTextures";

    let dir = skinLocation + "/" + logoName + "/";

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

    async.eachSeries(decalNames, function(decalName, callback) {
        creator.draw(logoLoc, logoName, carType, decalName, false).then(function() {
            jsonVal[decalName] = {
                "BodyID": parseInt(carType),
                    "SkinID": 0,
                    "Body": {
                        "Diffuse": logoName + "/diffuse.png",
                        "Skin": logoName + "/" + decalName + ".png"
                    }
                }
                //console.log(jsonVal);
            callback();
        });
    }, function(err){
        if (err) {
            throw err;
        }

        console.log(jsonVal);
        console.log(JSON.stringify(jsonVal));
        fs.writeFile(dir + logoName + ".json", JSON.stringify(jsonVal), (err) => {
            if (err) {
                throw err;
            }
            console.log("JSON data is saved.");
        });
    });

    
}