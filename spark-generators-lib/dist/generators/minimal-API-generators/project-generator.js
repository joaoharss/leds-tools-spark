"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = generate;
const generate_1 = require("langium/generate");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function generate(model, target_folder) {
    fs_1.default.writeFileSync(path_1.default.join(target_folder, model.configuration?.name + ".sln"), generateProjectsln(model));
}
function generateProjectsln(model) {
    return (0, generate_1.expandToStringWithNL) `
﻿
Microsoft Visual Studio Solution File, Format Version 12.00
# Visual Studio Version 17
VisualStudioVersion = 17.9.34902.65
MinimumVisualStudioVersion = 10.0.40219.1
Project("{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}") = "${model.configuration?.name}", "${model.configuration?.name}\\${model.configuration?.name}.csproj", "{PROJECT GUID}"
EndProject
Project("{E53339B2-1760-4266-BCC7-CA923CBCF16C}") = "docker-compose", "docker-compose.dcproj", "{COMPOSE_GUID}"
EndProject
Global
	GlobalSection(SolutionConfigurationPlatforms) = preSolution
		Debug|Any CPU = Debug|Any CPU
		Release|Any CPU = Release|Any CPU
	EndGlobalSection
	GlobalSection(ProjectConfigurationPlatforms) = postSolution
		{PROJECT GUID}.Debug|Any CPU.ActiveCfg = Debug|Any CPU
		{PROJECT GUID}.Debug|Any CPU.Build.0 = Debug|Any CPU
		{PROJECT GUID}.Release|Any CPU.ActiveCfg = Release|Any CPU
		{PROJECT GUID}.Release|Any CPU.Build.0 = Release|Any CPU
	EndGlobalSection
	GlobalSection(SolutionProperties) = preSolution
		HideSolutionNode = FALSE
	EndGlobalSection
	GlobalSection(ExtensibilityGlobals) = postSolution
		SolutionGuid = {SOLUTION GUID}
	EndGlobalSection
EndGlobal
    `;
}
