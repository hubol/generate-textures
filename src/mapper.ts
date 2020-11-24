import {Config} from "./config";
import {getAllFiles, getRelativePath} from "pissant-node";
import {toPascalCase} from "./toPascalCase";

export function getTextureDescriptions(config: Config)
{
    return getAllFiles(config.textureSourceDirectoryPath)
        .map(x => toTextureDescription(x, config.textureSourceDirectoryPath));
}

function toTextureDescription(textureFilePath: string, sourceDirectoryPath: string)
{
    const textureFileName = getRelativePath(sourceDirectoryPath, textureFilePath);
    const textureFileNameNoExtension = textureFileName.replace(/\.[^/.]+$/, "");
    const pascalCasedName = toPascalCase(textureFileNameNoExtension);

    return {
        typedName: pascalCasedName,
        sourceFilePath: textureFilePath
    };
}

export type TextureDescription = ReturnType<typeof toTextureDescription>;