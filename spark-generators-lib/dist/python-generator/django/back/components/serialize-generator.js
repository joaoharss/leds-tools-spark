"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSerializer = generateSerializer;
const ast_js_1 = require("../../../../shared/ast.js");
const generator_utils_js_1 = require("../../../../shared/generator-utils.js");
const ident = generator_utils_js_1.base_ident;
function generateSerializer(m) {
    const non_abstract_entities = m.elements.filter(ast_js_1.isLocalEntity).filter(e => !e.is_abstract);
    const lines = [
        `from rest_framework import serializers`,
        `from .models import (`,
        ...non_abstract_entities.map(e => `${ident}${e.name},`),
        `)`,
        ``,
        ...non_abstract_entities.map(entitySerializer),
    ];
    return lines.join('\n');
}
function entitySerializer(e) {
    const lines = [
        `class ${e.name}WriteSerializer(serializers.ModelSerializer):`,
        `${ident}class Meta:`,
        `${ident}${ident}model = ${e.name}`,
        `${ident}${ident}exclude = ("polymorphic_ctype",)`,
        ``,
        `class ${e.name}ReadSerializer(serializers.ModelSerializer):`,
        `${ident}class Meta:`,
        `${ident}${ident}depth = 1`,
        `${ident}${ident}model = ${e.name}`,
        `${ident}${ident}exclude = ("polymorphic_ctype",)`,
        ``,
        ``
    ];
    return lines.join('\n');
}
