#!/usr/bin/env node

import {config} from "./config";
import {run} from "./run";

run(config)
    .then(() => process.exit(0))
    .catch(e => {
        console.error(`An unexpected error occurred: ${e}`);
        process.exit(1);
    });