console.log(process.argv);

const jimp = require("jimp");
const fs = require("fs");

console.log(process.argv.length);

// args
// 0 node location
// 1 current location
// 2 image location
// 3 new name
// 4 car type
// 5 decal name
// 6 write JSON

if (process.argv.length = 4) {
    console.log(process.argv[2]);
    console.log(process.argv[3]);
    draw(process.argv[2], process.argv[3]);
} else if (process.argv.length = 5) {
    console.log(process.argv[2]);
    console.log(process.argv[3]);
    console.log(process.argv[4]);
    draw(process.argv[2], process.argv[3], process.argv[4]);
} else if (process.argv.length = 6) {
    console.log(process.argv[2]);
    console.log(process.argv[3]);
    console.log(process.argv[4]);
    console.log(process.argv[5]);
    draw(process.argv[2], process.argv[3], process.argv[4], process.argv[5]);
} else if (process.argv.length >= 7) {
    console.log(process.argv[2]);
    console.log(process.argv[3]);
    console.log(process.argv[4]);
    console.log(process.argv[5]);
    console.log(process.argv[6]);
    draw(process.argv[2], process.argv[3], process.argv[4], process.argv[5], process.argv[6])
}

async function draw(logoLoc, logoName, carType = 22, decalName = "baseDecal", writeJson = true) {
    console.log(logoName);

    var skinLocation = "C:\\Program Files (x86)\\Steam\\steamapps\\common\\rocketleague\\Binaries\\Win64\\bakkesmod\\data\\acplugin\\DecalTextures";

    var drawLocations = require("./img/" + carType + "/drawlocations.json");

    let baseDecal = await jimp.read("./img/" + carType + "/" + decalName + ".png").catch(function (err) {
        console.log(err);
        return;
     });

    var drawLocations = require("./img/" + carType + "/drawlocations.json");

    //let decalNames = require("./img/" + carType + "/decalnames.json");

    let bodyDecal = await jimp.read("./img/" + carType + "/body.png").catch(function (err) {
        console.log(err);
        return;
    });

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

        logoClone.rotate(rotation);

        let blackBox = await new jimp(size, size, 0x000000ff, (err, image) => {
            if (err) {
                throw err;
            }
        });


        let redBox = await new jimp(size, size, 0xff0000ff, (err, image) => {
            if (err) {
                throw err;
            }
        });

        console.log(xLoc);
        console.log(yLoc);
        console.log(size);

        logoClone.resize(size, size);

        //blackBox.write("./" + logoName + "/boxpre.png");
        blackBox.mask(logoClone);
        //blackBox.opaque();

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

        //blackBox.write(skinLocation + "/" + logoName + "/blackbox.png");

        //blackBox.write("./" + logoName + "/boxpost.png");
        //baseDecal.mask(blackBox, xLoc, yLoc);
        baseDecal.composite(blackBox, xLoc, yLoc);

        baseDecal.scan(xLoc, yLoc, blackBox.bitmap.width, blackBox.bitmap.height, function(x, y, idx) {
            // x, y is the position of this pixel on the image
            // idx is the position start position of this rgba tuple in the bitmap Buffer
            // this is the image

            var alpha = this.bitmap.data[idx + 3];
            /*var isBlack = this.bitmap.data[idx] == 0 &&
                this.bitmap.data[idx + 1] == 0 &&
                this.bitmap.data[idx + 2] == 0;*/

            // ensures proper rgb values of logo
            if (alpha < 250) {
                this.bitmap.data[idx] = 255;
                this.bitmap.data[idx + 1] = 0;
                this.bitmap.data[idx + 2] = 0;
                this.bitmap.data[idx + 3] = 0;
            }
        });
       
        bodyDecal.composite(logoClone, xLoc, yLoc);
    }

    baseDecal.write(skinLocation + "/" + logoName + "/" + decalName + ".png");

    bodyDecal.write(skinLocation + "/" + logoName + "/diffuse.png");

    const jsonVal = {};

    jsonVal[logoName] = {
        "BodyID": parseInt(carType),
            "SkinID": 0,
            "Body": {
                "Diffuse": logoName + "/diffuse.png",
                "Skin": logoName + "/" + decalName + ".png"
            }
    };

     fs.writeFile(skinLocation + "/" + logoName + "/" + logoName + ".json", JSON.stringify(jsonVal), (err) => {
        if (err) {
            throw err;
        }
        console.log("JSON data is saved.");
    });

    /*
    {
    "jerry": {
		"BodyID": 22,
		"SkinID": 0,
		"Body": {
            "Diffuse": "jerry/coloredicon.png",
            "Skin": "jerry/base.png"
		}
    }
    */
    //drawTemplate.write("./" + logoName + "/skin.png");
}