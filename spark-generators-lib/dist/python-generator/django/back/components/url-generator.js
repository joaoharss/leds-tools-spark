"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateURLAPI = generateURLAPI;
const ast_js_1 = require("../../../../shared/ast.js");
const generator_utils_js_1 = require("../../../../shared/generator-utils.js");
const ident = generator_utils_js_1.base_ident;
function generateURLAPIAux(e) {
    return `router.register(r'${e.name.toLowerCase()}', ${e.name}ViewSet, basename='${e.name.toLowerCase()}')`;
}
function generateURLAPI(m) {
    const entities = m.elements.filter(ast_js_1.isLocalEntity).filter(e => !e.is_abstract);
    const lines = [
        `from django.urls import path, register_converter, include`,
        `from rest_framework import routers`,
        `from .api_views import (`,
        ...entities.map(e => `${ident}${e.name}ViewSet,`),
        `)`,
        `router = routers.DefaultRouter()`,
        ``,
        ...entities.map(e => generateURLAPIAux(e)),
        ``,
        `urlpatterns = [`,
        `${ident}path('${m.name.toLowerCase()}/', include(router.urls))`,
        `]`,
        ``
    ];
    return lines.join('\n');
}
