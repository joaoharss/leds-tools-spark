import fs from "fs";
import path from "path";

import type { Model } from "spark-generators-lib";
import { generators } from "spark-generators-lib";

export function generate(model: Model, target_folder: string): void {
  const target_folder_back = path.join(target_folder, "backend");
  const target_folder_projname = path.join(target_folder_back, model.configuration?.name || "Projeto");

  fs.mkdirSync(target_folder_back, { recursive: true });

  if (model.configuration?.language === "csharp-minimal-api") {
    generators.minimal.minimalApiGenerate(model, target_folder_projname);
    generators.minimal.minimalprojectGenerate(model, target_folder_back);
    generators.minimal.minimalgenerateDocker(model, target_folder_back);
  } else {
    generators.clean.cleanArchGenerate(model, target_folder_projname);
    generators.clean.cleanprojectGenerate(model, target_folder_back);
    generators.clean.cleangenerateDocker(model, target_folder_back);
  }
}



