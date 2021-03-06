const jimp = require("jimp");
const fs = require("fs");
const defaultvalues = require("./defaultvalues.json");

async function draw(logoLoc, logoName, carType, decalName, writeJson, makeDiffuse) {
    var carType = typeof carType  !== 'undefined' ?  carType  : defaultvalues.carID;
    var decalName = typeof decalName  !== 'undefined' ?  decalName  : defaultvalues.decal;
    var writeJson = typeof writeJson  !== 'undefined' ?  writeJson  : true;
    var writeJson = typeof writeJson  !== 'undefined' ?  makeDiffuse  : true;

    console.log(logoLoc);
    console.log(logoName);
    console.log(carType);
    console.log(decalName);
    console.log(writeJson);

    var skinLocation = defaultvalues.skinlocation;

    var drawLocations = require("./img/" + carType + "/drawlocations.json");

    let baseDecal = await jimp.read("./img/" + carType + "/" + decalName + ".png").catch(function (err) {
        console.log(err);
        return;
     });

    var drawLocations = require("./img/" + carType + "/drawlocations.json");

    //let decalNames = require("./img/" + carType + "/decalnames.json");

    let bodyDecal;

    if (makeDiffuse) {
        bodyDecal = await jimp.read("./img/" + carType + "/" + defaultvalues.bodytexture).catch(function (err) {
            console.log(err);
            return;
        });
    }

    //console.log("loaded locations");

    let logo = await jimp.read(logoLoc).catch(function (err) {
            console.log(err);
         });

    

    for (var i = 0; i < drawLocations.length; i++) {
        logoClone = logo.clone();
        var xLoc = drawLocations[i].x;
        var yLoc = drawLocations[i].y;
        var size = drawLocations[i].size;
        var rotation = drawLocations[i].rotation;
        var shouldDraw = drawLocations[i].shouldDraw;
        
        if (shouldDraw) {
            logoClone.rotate(rotation);
            logoClone.resize(size, size);

            let blackBox = logoClone.clone();
            blackBox.scan(0, 0, blackBox.bitmap.width, blackBox.bitmap.height, function(x, y, idx) {
                // x, y is the position of this pixel on the image
                // idx is the position start position of this rgba tuple in the bitmap Buffer
                // this is the image

                var alpha = this.bitmap.data[idx + 3];

                // ensures proper rgb values of logo
                if (alpha > 50) {
                    this.bitmap.data[idx] = 0;
                    this.bitmap.data[idx + 1] = 0;
                    this.bitmap.data[idx + 2] = 0;
                    this.bitmap.data[idx + 3] = 255;
                } else {
                    this.bitmap.data[idx] = 255;
                    this.bitmap.data[idx + 1] = 0;
                    this.bitmap.data[idx + 2] = 0;
                    this.bitmap.data[idx + 3] = 0;
                }
            });

            baseDecal.composite(blackBox, xLoc, yLoc);

            baseDecal.scan(xLoc, yLoc, blackBox.bitmap.width, blackBox.bitmap.height, function(x, y, idx) {
                // x, y is the position of this pixel on the image
                // idx is the position start position of this rgba tuple in the bitmap Buffer
                // this is the image

                var alpha = this.bitmap.data[idx + 3];
                var isBlack = this.bitmap.data[idx] <= 10 &&
                    this.bitmap.data[idx + 1] <= 10 &&
                    this.bitmap.data[idx + 2] <= 10;

                // ensures proper rgb values of logo
                if (isBlack && alpha < 250) {
                    this.bitmap.data[idx] = 255;
                    this.bitmap.data[idx + 1] = 0;
                    this.bitmap.data[idx + 2] = 0;
                    this.bitmap.data[idx + 3] = 0;
                }
            });
            
            if (makeDiffuse) {
                bodyDecal.composite(logoClone, xLoc, yLoc);
            }
        }
    }

    baseDecal.write(skinLocation + "/" + logoName + "/" + decalName + ".png");

    if (makeDiffuse) {
        bodyDecal.write(skinLocation + "/" + logoName + "/diffuse.png");
    }

    if (writeJson) {
        const jsonVal = {};

        jsonVal[logoName] = {
            "BodyID": parseInt(carType),
                "SkinID": 0,
                "Body": {
                    "Diffuse": logoName + "/diffuse.png",
                    "Skin": logoName + "/" + decalName + ".png"
                }
        };

        await fs.writeFile(skinLocation + "/" + logoName + "/" + logoName + ".json", JSON.stringify(jsonVal, null, 2), (err) => {
            if (err) {
                throw err;
            }
            console.log("JSON data is saved.");
        });
    }
}

module.exports.draw = draw;