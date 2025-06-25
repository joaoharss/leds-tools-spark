import type { Model } from '../language/generated/ast.js';

import { backend } from 'leds-spark-lib';

import { GenerateOptions } from './main.js';
import { generate as pythonGenerate } from './backend/python/generator.js';
import { generate as javaGenerate } from './backend/java/generator.js';
import { generate as docGenerate} from './documentation/generator.js';
import { generate as vueVitegenerate} from './frontend/vue-vite/generate.js';
import { generate as csharpGenerator} from './backend/csharp/generator.js';
import { generate as opaGenerate } from './opa/generator.js'

import path from 'path';
import chalk from 'chalk';

export import LibModel = backend.Model;

export function generate(model: Model, filePath: string, destination: string | undefined, opts: GenerateOptions): string {
    const final_destination = extractDestination(filePath, destination);

    if (opts.only_back) {
        // Backend generation
        if (model.configuration?.language === 'python') {
            pythonGenerate(model as unknown as LibModel.Model, final_destination);
        } else if (model.configuration?.language?.startsWith("csharp")) {
            csharpGenerator(model as unknown as LibModel.Model, final_destination);
        } else if (model.configuration?.language === "java") {
            javaGenerate(model as unknown as LibModel.Model, final_destination);
        }
    } else if (opts.only_front) {
        // Frontend generation
        vueVitegenerate(model as unknown as LibModel.Model, final_destination);
    } else if (opts.only_Documentation) {
        // Documentation generation
        docGenerate(model, final_destination);
    } else if (opts.only_Backlog) {
        // Backlog generation
        console.log(chalk.yellow(`Not implemented yet`));
    } else if (opts.only_opa) {
        // OPA generation
        opaGenerate(model, final_destination);
    } else {
        // Generate All
        if (model.configuration?.language === 'python') {
            pythonGenerate(model as unknown as LibModel.Model, final_destination);
        } else if (model.configuration?.language?.startsWith("csharp")) {
            csharpGenerator(model as unknown as LibModel.Model, final_destination);
        } else if (model.configuration?.language === 'java') {
            javaGenerate(model as unknown as LibModel.Model, final_destination);
        }

        docGenerate(model, final_destination);
        vueVitegenerate(model as unknown as LibModel.Model, final_destination);
        opaGenerate(model, final_destination);
    }

    return final_destination;
}

function extractDestination(filePath: string, destination?: string) : string {
    const path_ext = new RegExp(path.extname(filePath)+'$', 'g')
    filePath = filePath.replace(path_ext, '')

    return destination ?? path.join(path.dirname(filePath))
}

