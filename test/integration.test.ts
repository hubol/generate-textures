import mock = require("mock-fs");
import {readFileSync} from "fs";
import {runOnce} from "../src/run";

test("Integration", () => {
    const definitionDestFilePath = "src/typedAssets/textures.ts";
    runOnce({
        definitionDestFilePath,
        runImmediately: true,
        textureSourceDirectoryPath: "assets/images"
    });

    expect(readFileSync(definitionDestFilePath).toString()).toBe(`import * as PIXI from "pixi.js";
    
// This file is generated. Do not touch.

export let Image0: PIXI.Texture;
export let Image1: PIXI.Texture;


export function loadTexturesAsync()
{
    const loader = new PIXI.Loader();

    const Image0Path = require("../../assets/images/image0.png");
    loader.add(Image0Path); 

    const Image1Path = require("../../assets/images/image1.png");
    loader.add(Image1Path); 

    
    return new Promise<void>(resolve =>
    {
        loader.load((_, resources) => {
            Image0 = resources[Image0Path]?.texture as PIXI.Texture;
            Image1 = resources[Image1Path]?.texture as PIXI.Texture;

            resolve();
        });
    });
}`);
});

beforeEach(() => mock({
    "assets/images/image0.png": "whatever",
    "assets/images/image1.png": "whatever"
}));
afterEach(mock.restore);