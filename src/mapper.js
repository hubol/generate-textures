const { toPascalCase } = require("./utils/pascalCaser");
const { getAllFiles, getRelativePath } = require("./utils/file");

function getTextureDescriptions(config)
{
    return getAllFiles(config.textureSourceDirectoryPath)
        .map(x => toTextureDescription(x, config.textureSourceDirectoryPath));
}

function toTextureDescription(textureFilePath, sourceDirectoryPath)
{
    const textureFileName = getRelativePath(sourceDirectoryPath, textureFilePath);
    const textureFileNameNoExtension = textureFileName.replace(/\.[^/.]+$/, "");
    const pascalCasedName = toPascalCase(textureFileNameNoExtension);

    return {
        typedName: pascalCasedName,
        sourceFilePath: textureFilePath
    };
}

module.exports = { getTextureDescriptions };