import {createDirectory, getDirectory, getRelativePath} from "pissant-node";
import {Config} from "./config";
import {TextureDescription} from "./mapper";
import fs from "fs";

export function writeTypescriptFile(textureDescriptions: TextureDescription[], config: Config)
{
    createDirectory(getDirectory(config.definitionDestFilePath));
    const newTypescriptText = composeTypescriptText(textureDescriptions, config);
    if (fs.existsSync(config.definitionDestFilePath))
    {
        const currentTypescriptText = fs.readFileSync(config.definitionDestFilePath).toString();
        if (currentTypescriptText === newTypescriptText)
            return;
    }

    console.log(`Writing ${config.definitionDestFilePath}...`);
    fs.writeFileSync(config.definitionDestFilePath, newTypescriptText);
}

function composeTypescriptText(textureDescriptions: TextureDescription[], config: Config)
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
    
    return new Promise<void>(resolve =>
    {
        loader.load((_, resources) => {
${assignmentsText}
            resolve();
        });
    });
}`;
}

function toLoadText(textureDescription: TextureDescription, typescriptFilePath: string)
{
    const typescriptDirectory = getDirectory(typescriptFilePath);
    return `
    const ${textureDescription.typedName}Path = require("${getRelativePath(typescriptDirectory, textureDescription.sourceFilePath)}");
    loader.add(${textureDescription.typedName}Path); 
`;
}

function toDefinitionText(textureDescription: TextureDescription)
{
    return `export let ${textureDescription.typedName}: PIXI.Texture;
`;
}

function toAssignmentText(textureDescription: TextureDescription)
{
    return `            ${textureDescription.typedName} = resources[${textureDescription.typedName}Path]?.texture as PIXI.Texture;
`;
}