const fs = require("fs");
const { getDirectory, createDirectory, getRelativePath } = require("./utils/file");

function writeTypescriptFile(soundDescriptions, config)
{
    createDirectory(getDirectory(config.definitionDestFilePath));
    const newTypescriptText = composeTypescriptText(soundDescriptions, config);
    if (fs.existsSync(config.definitionDestFilePath))
    {
        const currentTypescriptText = fs.readFileSync(config.definitionDestFilePath).toString();
        if (currentTypescriptText === newTypescriptText)
            return;
    }

    console.log(`Writing ${config.definitionDestFilePath}...`);
    fs.writeFileSync(config.definitionDestFilePath, newTypescriptText);
}

function composeTypescriptText(textureDescriptions, config)
{
    let loadsText = "";
    let definitionsText = "";
    let assignmentsText = "";

    textureDescriptions.forEach(x => {
        loadsText += toLoadText(x, config.definitionDestFilePath);
        definitionsText += toDefinitionText(x);
        assignmentsText += toAssignmentText(x);
    });

    return `import * as PIXI from "pixi.js";
    
// This file is generated. Do not touch.

${definitionsText}

export function loadTexturesAsync()
{
    const loader = new PIXI.Loader();
${loadsText}
    
    return new Promise(resolve =>
    {
        loader.load((_, resources) => {
${assignmentsText}
            resolve();
        });
    });
}`;
}

function toLoadText(soundDescription, typescriptFilePath)
{
    const typescriptDirectory = getDirectory(typescriptFilePath);
    return `
    const ${soundDescription.typedName}Path = require("${getRelativePath(typescriptDirectory, soundDescription.sourceFilePath)}");
    loader.add(${soundDescription.typedName}Path); 
`;
}

function toDefinitionText(soundDescription)
{
    return `export let ${soundDescription.typedName}: PIXI.Texture = undefined as unknown as PIXI.Texture;
`;
}

function toAssignmentText(soundDescription)
{
    return `            ${soundDescription.typedName} = resources[${soundDescription.typedName}Path]?.texture as PIXI.Texture;
`;
}

module.exports = { writeTypescriptFile };