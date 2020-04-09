const fs = require('fs');
const path = require("path");

function getAllFiles(dirPath, arrayOfFiles)
{
    arrayOfFiles = arrayOfFiles || [];
    if (!fs.existsSync(dirPath))
        return arrayOfFiles;

    const files = fs.readdirSync(dirPath);

    files.forEach(function(file) {
        const filePath = path.join(dirPath, file);
        if (fs.statSync(filePath).isDirectory())
            arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
        else
            arrayOfFiles.push(filePath);
    });

    return arrayOfFiles;
}

function getDirectory(filePath)
{
    return path.basename(path.dirname(filePath));
}

function createDirectory(directoryPath)
{
    fs.mkdirSync(directoryPath, { recursive: true });
}

function getRelativePath(sourcePath, destinationPath)
{
    const relativePath = path.relative(sourcePath, destinationPath).replace(/\\/g, "/");
    if (relativePath.charAt(0) !== ".")
        return "./" + relativePath;
    return relativePath;
}

module.exports = { getAllFiles, createDirectory, getDirectory, getRelativePath };