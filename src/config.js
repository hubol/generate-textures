const path = require("path");

const args = process.argv.slice(2);

const textureSourceDirectoryPath = path.resolve(args[0]);
const definitionDestFilePath = path.resolve(args[1]);
const runImmediately = args.filter(x => x === "--build").length > 0;

const config = {
    textureSourceDirectoryPath,
    definitionDestFilePath,
    runImmediately
};

module.exports = { config };