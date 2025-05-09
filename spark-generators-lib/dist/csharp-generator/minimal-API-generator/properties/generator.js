"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = generate;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const generate_1 = require("langium/generate");
function generate(model, target_folder) {
    if (model.configuration) {
        fs_1.default.writeFileSync(path_1.default.join(target_folder, 'Properties.json'), createPropertiesJSON());
        fs_1.default.writeFileSync(path_1.default.join(target_folder, 'launchSettings.json'), createLaunchSettingsJSON());
    }
}
function createPropertiesJSON() {
    return (0, generate_1.expandToStringWithNL) `
    {
        "profiles": {
          "http": {
            "commandName": "Project",
            "launchBrowser": true,
            "environmentVariables": {
              "ASPNETCORE_ENVIRONMENT": "Development"
            },
            "dotnetRunMessages": true,
            "applicationUrl": "http://localhost:5112"
          },
          "https": {
            "commandName": "Project",
            "launchBrowser": true,
            "environmentVariables": {
              "ASPNETCORE_ENVIRONMENT": "Development"
            },
            "dotnetRunMessages": true,
            "applicationUrl": "https://localhost:7000;http://localhost:5112"
          },
          "IIS Express": {
            "commandName": "IISExpress",
            "launchBrowser": true,
            "environmentVariables": {
              "ASPNETCORE_ENVIRONMENT": "Development"
            }
          },
          "Container (Dockerfile)": {
            "commandName": "Docker",
            "launchBrowser": true,
            "launchUrl": "{Scheme}://{ServiceHost}:{ServicePort}",
            "environmentVariables": {
              "ASPNETCORE_HTTPS_PORTS": "8081",
              "ASPNETCORE_HTTP_PORTS": "8080"
            },
            "publishAllPorts": true,
            "useSSL": true
          }
        },
        "$schema": "http://json.schemastore.org/launchsettings.json",
        "iisSettings": {
          "windowsAuthentication": false,
          "anonymousAuthentication": true,
          "iisExpress": {
            "applicationUrl": "http://localhost:58487",
            "sslPort": 44375
          }
        }
      }
    `;
}
function createLaunchSettingsJSON() {
    return (0, generate_1.expandToStringWithNL) `
  {
    "profiles": {
      "testeminimalapi": {
        "commandName": "Project",
        "launchBrowser": true,
        "environmentVariables": {
          "ASPNETCORE_ENVIRONMENT": "Development"
        },
        "applicationUrl": "https://localhost:62775;http://localhost:62776"
      },
      "Container (Dockerfile)": {
        "commandName": "Docker",
        "launchBrowser": true,
        "launchUrl": "{Scheme}://{ServiceHost}:{ServicePort}",
        "environmentVariables": {
          "ASPNETCORE_HTTPS_PORTS": "8081",
          "ASPNETCORE_HTTP_PORTS": "8080"
        },
        "publishAllPorts": true,
        "useSSL": true
      }
    }
  }
  `;
}
