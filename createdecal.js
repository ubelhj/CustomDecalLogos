console.log(process.argv);

let creator = require("./decalbuilder");

console.log(process.argv.length);

// args
// 0 node location
// 1 current location
// 2 image location
// 3 new name
// 4 car type
// 5 decal name
// 6 write JSON

if (process.argv.length == 4) {
    console.log(process.argv[2]);
    console.log(process.argv[3]);
    creator.draw(process.argv[2], process.argv[3]);
} else if (process.argv.length == 5) {
    console.log(process.argv[2]);
    console.log(process.argv[3]);
    console.log(process.argv[4]);
    creator.draw(process.argv[2], process.argv[3], process.argv[4]);
} else if (process.argv.length == 6) {
    console.log(process.argv[2]);
    console.log(process.argv[3]);
    console.log(process.argv[4]);
    console.log(process.argv[5]);
    creator.draw(process.argv[2], process.argv[3], process.argv[4], process.argv[5]);
} else if (process.argv.length >= 7) {
    console.log(process.argv[2]);
    console.log(process.argv[3]);
    console.log(process.argv[4]);
    console.log(process.argv[5]);
    console.log(process.argv[6]);
    creator.draw(process.argv[2], process.argv[3], process.argv[4], process.argv[5], process.argv[6])
}