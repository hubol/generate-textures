import {Config} from "./config";
import {sleep} from "pissant";
import {getTextureDescriptions} from "./mapper";
import {writeTypescriptFile} from "./typeWriter";

export async function run(config: Config)
{
    if (config.runImmediately) {
        runOnce(config);
        return;
    }

    while (true)
    {
        runOnce(config);
        await sleep(8 * 1000);
    }
}

export function runOnce(config: Config)
{
    const textureDescriptions = getTextureDescriptions(config);
    writeTypescriptFile(textureDescriptions, config);
}