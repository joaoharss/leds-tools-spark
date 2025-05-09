"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = generate;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const generate_1 = require("langium/generate");
function generate(model, target_folder) {
    fs_1.default.mkdirSync(target_folder, { recursive: true });
    if (model.configuration) {
        fs_1.default.writeFileSync(path_1.default.join(target_folder, 'README.md'), createProjectReadme(model.configuration));
        fs_1.default.writeFileSync(path_1.default.join(target_folder, '.gitlab-ci.yml'), createGitLab(model));
    }
}
function createGitLab(model) {
    return (0, generate_1.expandToStringWithNL) `
    docker-build:
    image: docker:cli
    stage: build
    services:
      - docker:dind
    variables:
      DOCKER_IMAGE_NAME: "$CI_REGISTRY_IMAGE:latest"
      CI_DOCKERFILE_IMAGE: Dockerfile
    before_script:
      - cd backend/
      - docker login -u "$CI_REGISTRY_USER" -p "$CI_REGISTRY_PASSWORD" "$CI_REGISTRY"
    script:
      - docker build -t "$DOCKER_IMAGE_NAME" -f "$CI_DOCKERFILE_IMAGE" .
      - docker push "$DOCKER_IMAGE_NAME"
    rules:
      - if: '$CI_COMMIT_BRANCH == "main" || $CI_COMMIT_BRANCH == "dev"'
  `;
}
function stackREADME() {
    return (0, generate_1.expandToStringWithNL) `
    1. Minimal API
    2. Swagger API
    `;
}
function createProjectReadme(configuration) {
    return (0, generate_1.expandToStringWithNL) `
    # ${configuration.name}
    ## 🚀 Goal
    ${configuration.description}

    ## 📕 Domain Documentation
    
    Domain documentation can be found [here](./docs/README.md)

    ## ⚙️ Stack 
    ${stackREADME()}

    ## 🔧 Install

    ## 🔧 Usage

    `;
}
