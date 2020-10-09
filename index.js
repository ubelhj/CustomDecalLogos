console.log(process.argv);

const jimp = require("jimp");
const fs = require("fs");

console.log(process.argv.length);

if (process.argv.length >= 3) {
    console.log(process.argv[2]);

    var logoLoc = process.argv[2];

    draw(logoLoc);
}

async function draw(logoLoc) {
    var logoName = logoLoc.substring(0, logoLoc.indexOf("."));

    console.log(logoName);

    var carType = "22";
    var skinLocation = "C:\\Program Files (x86)\\Steam\\steamapps\\common\\rocketleague\\Binaries\\Win64\\bakkesmod\\data\\acplugin\\DecalTextures";

    var drawLocations = require("./img/" + carType + "/drawlocations.json");

    let baseDecal = await jimp.read("./img/" + carType + "/basedecal.png").catch(function (err) {
        console.log(err);
        return;
     });

    let baseClone = baseDecal.clone();

    let bodyDecal = await jimp.read("./img/" + carType + "/body.png").catch(function (err) {
        console.log(err);
        return;
    });

    //let drawTemplate = await jimp.read("./img/" + carType + "/drawlocations.png").catch(function (err) {
    //    console.log(err);
    // });

    console.log("loaded locations");

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

        blackBox.write(skinLocation + "/" + logoName + "/blackbox.png");

        //blackBox.write("./" + logoName + "/boxpost.png");
        //baseDecal.mask(blackBox, xLoc, yLoc);
        baseDecal.composite(blackBox, xLoc, yLoc);
        
        bodyDecal.composite(logoClone, xLoc, yLoc);/*, {
            //mode: jimp.BLEND_DIFFERENCE,
            mode: jimp.BLEND_OVERLAY,
            opacitySource: 1,
            opacityDest: 1
        });*/

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
    }

    baseDecal.write(skinLocation + "/" + logoName + "/skin.png");
    bodyDecal.write(skinLocation + "/" + logoName + "/diffuse.png");

    const jsonVal = {};

    jsonVal[logoName] = {
        "BodyID": parseInt(carType),
            "SkinID": 0,
            "Body": {
                "Diffuse": logoName + "/diffuse.png",
                "Skin": logoName + "/skin.png"
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

