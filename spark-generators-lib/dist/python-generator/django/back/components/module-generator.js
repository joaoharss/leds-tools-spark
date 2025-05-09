"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateModules = generateModules;
const admin_generator_js_1 = require("./admin-generator.js");
const model_generator_js_1 = require("./model-generator.js");
const url_generator_js_1 = require("./url-generator.js");
const view_generator_js_1 = require("./view-generator.js");
const serialize_generator_js_1 = require("./serialize-generator.js");
const generator_utils_js_1 = require("../../../../shared/generator-utils.js");
const ast_js_1 = require("../../../../shared/ast.js");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const generate_1 = require("langium/generate");
const ident = generator_utils_js_1.base_ident;
function generateModules(app, target_folder) {
    // Processa quais Entidades representam algum ator
    const entity_to_actor = new Map();
    // app.abstractElements.filter(isActor).forEach(a => {
    //     if(a.entity.ref) {
    //         entity_to_actor.set(a.entity.ref, a)
    //     }
    // })
    const APPS_PATH = (0, generator_utils_js_1.createPath)(target_folder, "backend", "apps/");
    // Criando os models, service e applications
    for (const m of app.abstractElements.filter(ast_js_1.isModule)) {
        const MODULE_PATH = (0, generator_utils_js_1.createPath)(APPS_PATH, m.name.toLowerCase());
        fs_1.default.writeFileSync(path_1.default.join((0, generator_utils_js_1.createPath)(MODULE_PATH, "migrations/"), "__init__.py"), "");
        fs_1.default.writeFileSync(path_1.default.join(MODULE_PATH, "/__init__.py"), create_init(m));
        fs_1.default.writeFileSync(path_1.default.join(MODULE_PATH, "/models.py"), (0, model_generator_js_1.generateModels)(m));
        fs_1.default.writeFileSync(path_1.default.join(MODULE_PATH, "/admin.py"), (0, admin_generator_js_1.generateAdmin)(m));
        fs_1.default.writeFileSync(path_1.default.join(MODULE_PATH, "/utils.py"), generateUtil());
        // fs.writeFileSync(APPS_PATH + m.name.toLowerCase + "/factory.py", m.createFactory)
        fs_1.default.writeFileSync(path_1.default.join(MODULE_PATH, "/apps.py"), createApps(m));
        fs_1.default.writeFileSync(path_1.default.join(MODULE_PATH, "/api_urls.py"), (0, url_generator_js_1.generateURLAPI)(m));
        fs_1.default.writeFileSync(path_1.default.join(MODULE_PATH, "/api_views.py"), (0, view_generator_js_1.generateAPIView)(m, new Set(entity_to_actor.keys())));
        fs_1.default.writeFileSync(path_1.default.join(MODULE_PATH, "/pagination.py"), pagination());
        fs_1.default.writeFileSync(path_1.default.join(MODULE_PATH, "/signals.py"), generateSignals(m, entity_to_actor));
        fs_1.default.writeFileSync(path_1.default.join(MODULE_PATH, "/serializers.py"), (0, serialize_generator_js_1.generateSerializer)(m));
        const TEST_PATH = (0, generator_utils_js_1.createPath)(MODULE_PATH, "/test/unit/");
        for (const e of m.elements.filter(ast_js_1.isLocalEntity)) {
            fs_1.default.writeFileSync(path_1.default.join(TEST_PATH, e.name.toLowerCase() + "_tests.py"), createclasstest(e, m));
        }
    }
}
function generateUtil() {
    const lines = [
        `from hashids import Hashids`,
        `from django.conf import settings`,
        ``,
        `hashids = Hashids(settings.HASHIDS_SALT, min_length=8)`,
        ``,
        `def h_encode(id):`,
        `${ident}return hashids.encode(id)`,
        ``,
        `def h_decode(h):`,
        `${ident}if z := hashids.decode(h):`,
        `${ident}${ident}return z[0]`,
        ``,
        ``,
        `class HashIdConverter:`,
        `${ident}regex = '[a-zA-Z0-9]{8,}'`,
        ``,
        `${ident}def to_python(self, value):`,
        `${ident}${ident}return h_decode(value)`,
        ``,
        `${ident}def to_url(self, value):`,
        `${ident}${ident}return h_encode(value)`,
        ``
    ];
    return lines.join('\n');
}
function pagination() {
    const lines = [
        `from rest_framework import pagination`,
        `from rest_framework.response import Response`,
        ``,
        `class CustomPagination(pagination.PageNumberPagination):`,
        `${ident}page_size = 10`,
        `${ident}page_size_query_param = 'page_size'`,
        `${ident}max_page_size = 1000`,
        ``,
        `${ident}def get_paginated_response(self, data):`,
        `${ident}${ident}return Response({`,
        `${ident}${ident}${ident}'meta': {`,
        `${ident}${ident}${ident}${ident}'current_page': self.page.number,`,
        `${ident}${ident}${ident}${ident}'per_page': self.page.paginator.per_page,`,
        `${ident}${ident}${ident}${ident}'max_per_page': self.max_page_size,`,
        `${ident}${ident}${ident}${ident}'total': self.page.paginator.count`,
        `${ident}${ident}${ident}},`,
        `${ident}${ident}${ident}'data': data`,
        `${ident}${ident}})`,
        ``
    ];
    return lines.join('\n');
}
function create_init(m) {
    return `default_app_config = 'apps.${m.name.toLowerCase()}.apps.${(0, generator_utils_js_1.capitalizeString)(m.name)}Config'\n`;
}
function createApps(m) {
    const lines = [
        `from django.apps import AppConfig`,
        // `from django.utils.translation import gettext_lazy as _`,
        ``,
        `class ${(0, generator_utils_js_1.capitalizeString)(m.name)}Config(AppConfig):`,
        `${ident}name  = 'apps.${m.name.toLowerCase()}'`,
        `${ident}label = 'apps_${m.name.toLowerCase()}'`,
        ``,
        `${ident}def ready(self):`,
        `${ident}${ident}import apps.${m.name.toLowerCase()}.signals`,
        ``,
    ];
    return lines.join('\n');
}
function createattributeJsontest(e) {
    return e.attributes.map(a => `'${a.name}' : ${createAtrributeValuesTest(a)}`);
}
function createattributetest(e) {
    return e.attributes.map(a => `${a.name} = ${createAtrributeValuesTest(a)}`).join(', ');
}
function createAtrributeValuesTest(a) {
    switch (a.type.toLowerCase()) {
        case 'cpf': return "self.faker.cpf()";
        case 'cnpj': return "self.faker.cnpj()";
        case 'string': return "self.faker.first_name()";
        case 'integer': return "random.uniform(0, 100)";
        case 'decimal': return "random.uniform(0.00, 100.5)";
        case 'email': return "self.faker.ascii_company_email()";
        case 'url': return `'http://'+ self.fake.domain_name()`;
        case 'telefone':
        case 'celular':
            return "self.faker.phone_number()";
        case 'datetime':
        case 'date':
            return "self.faker.date()";
        default:
            return "TODO";
    }
}
function createclasstest(e, m) {
    const lines = [
        `import json`,
        `from rest_framework import status`,
        `from django.test import TestCase, Client`,
        `from django.urls import reverse`,
        `from ${m.name.toLowerCase()}.models import ${e.name}`,
        `from ${m.name.toLowerCase()}.serializers import ${e.name}Serializer`,
        `from faker import Faker`,
        `import random`,
        ``,
        `class ${e.name}Tests(TestCase):`,
        `${ident}def setUp(self):`,
        `${ident}${ident}self.faker = Faker('pt_BR')`,
        `${ident}${ident}self.client = Client()`,
        ``,
        `${ident}${ident}self.${e.name.toLowerCase()}_1 = ${e.name}.objects.create(${createattributetest(e)})`,
        `${ident}${ident}self.${e.name.toLowerCase()}_2 = ${e.name}.objects.create(${createattributetest(e)})`,
        `${ident}${ident}self.${e.name.toLowerCase()}_3 = ${e.name}.objects.create(${createattributetest(e)})`,
        ``,
        `${ident}${ident}self.valid_payload = {`,
        `${ident}${ident}${ident}${createattributeJsontest(e)}`,
        `${ident}${ident}}`,
        `${ident}${ident}self.invalid_payload = {`,
        // TODO Como gerar um payload invalido
        `${ident}${ident}${ident}${createattributeJsontest(e)}`,
        `${ident}${ident}}`,
        ``,
        `${ident}def test_valid_create(self):`,
        `${ident}${ident}response = self.client.post(`,
        `${ident}${ident}${ident}reverse('${e.name.toLowerCase()}-api-list'),`,
        `${ident}${ident}${ident}data=json.dumps(self.valid_payload),`,
        `${ident}${ident}${ident}content_type='application/json'`,
        `${ident}${ident})`,
        `${ident}${ident}self.assertEqual(response.status_code, status.HTTP_201_CREATED)`,
        ``,
        `${ident}def test_invalid_create(self):`,
        `${ident}${ident}response = self.client.post(`,
        `${ident}${ident}${ident}reverse('${e.name.toLowerCase()}-api-list'),`,
        `${ident}${ident}${ident}data=json.dumps(self.invalid_payload),`,
        `${ident}${ident}${ident}content_type='application/json'`,
        `${ident}${ident})`,
        `${ident}${ident}self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)`,
        ``,
        `${ident}def test_valid_upload(self):`,
        `${ident}${ident}response = self.client.put(`,
        `${ident}${ident}${ident}reverse('${e.name.toLowerCase()}-detail',`,
        `${ident}${ident}${ident}kwargs={'pk': self.${e.name.toLowerCase()}_1.id}),`,
        `${ident}${ident}${ident}data=json.dumps(self.valid_payload),`,
        `${ident}${ident}${ident}content_type='application/json'`,
        `${ident}${ident})`,
        `${ident}${ident}self.assertEqual(response.status_code, status.HTTP_200_OK)`,
        ``,
        `${ident}def test_invalid_upload(self):`,
        `${ident}${ident}response = self.client.put(`,
        `${ident}${ident}${ident}reverse('${e.name.toLowerCase()}-detail',`,
        `${ident}${ident}${ident}kwargs={'pk': self.${e.name.toLowerCase()}_1.id}),`,
        `${ident}${ident}${ident}data=json.dumps(self.invalid_payload),`,
        `${ident}${ident}${ident}content_type='application/json'`,
        `${ident}${ident})`,
        `${ident}${ident}self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)`,
        ``,
        `${ident}# retornando todos os elementos    `,
        `${ident}def test_retrieve_all(self):`,
        `${ident}${ident}response   = self.client.get(reverse('${e.name.toLowerCase()}-api-list'))`,
        `${ident}${ident}data       = ${e.name}.objects.all()`,
        `${ident}${ident}serializer = ${e.name}Serializer(data, context={'request': None}, many=True)`,
        `${ident}${ident}# Aqui deve comparar todos os compos do objeto com serialização`,
        `${ident}${ident}self.assertEqual(response.data, serializer.data)`,
        ``,
        `${ident}${ident}self.assertIsNotNone(response.data)`,
        `${ident}${ident}self.assertEqual(response.status_code, status.HTTP_200_OK)`,
        ``,
        `${ident}# retornando um elemento`,
        `${ident}def test_valid_get_element(self):`,
        `${ident}${ident}response = self.client.get(reverse('${e.name.toLowerCase()}-detail',kwargs={'pk': self.${e.name.toLowerCase()}_1.id}))`,
        `${ident}${ident}data = ${e.name}.objects.get(pk=self.condicao_1.id)`,
        `${ident}${ident}# Aqui deve comparar todos os campos do objeto com serialização`,
        `${ident}${ident}self.assertEqual(str(data.uuid),response.data['uuid'])`,
        `${ident}${ident}self.assertIsNotNone(response.data)`,
        `${ident}${ident}self.assertEqual(response.status_code, status.HTTP_200_OK)`,
        ``,
        `${ident}# erro ao retornar um elemento invalido`,
        `${ident}def test_invalid_get_element(self):`,
        `${ident}${ident}response = self.client.get(reverse('${e.name.toLowerCase()}-detail',kwargs={'pk': 666}))`,
        `${ident}${ident}self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)`,
        ``,
        `${ident}# Delete um elemento valido`,
        `${ident}def test_valid_delete(self):`,
        `${ident}${ident}response = self.client.delete(reverse('${e.name.toLowerCase()}-detail',kwargs={'pk': self.${e.name.toLowerCase()}_1.id}))`,
        `${ident}${ident}self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)`,
        ``,
        `${ident}# Delete um elemento valido`,
        `${ident}def test_invalid_delete(self):`,
        `${ident}${ident}response = self.client.delete(reverse('${e.name.toLowerCase()}-detail',kwargs={'pk': 666}))`,
        `${ident}${ident}self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)`,
        ``
    ];
    return lines.join('\n');
}
function generateSignals(m, map) {
    const non_abstract_entities = m.elements.filter(ast_js_1.isLocalEntity).filter(e => !e.is_abstract);
    const lines = [
        `from .models import ${non_abstract_entities.map(e => e.name).join(', ')}`,
        `from django.db.models.signals import (`,
        `${ident}pre_init,   post_init,`,
        `${ident}pre_save,   post_save,`,
        `${ident}pre_delete, post_delete,`,
        `${ident}m2m_changed`,
        `)`,
        `from django.dispatch import receiver`,
        `from django.contrib.auth.models import Group`,
        // `from .services import *`,
        ``,
        ...non_abstract_entities.flatMap(e => {
            return [
                `## Signals from ${e.name}`,
                entitySignals(e, map),
                ``,
            ];
        }),
    ];
    return lines.join('\n');
}
function entitySignals(e, map) {
    const post_save = map.has(e) ?
        (0, generate_1.expandToStringWithNL) `
            if created:
                group = Group.objects.get(name="${map.get(e)?.id}")
                instance.user_application.groups.add(group)
        ` :
        'pass';
    return (0, generate_1.expandToStringWithNL) `
        @receiver(pre_init, sender=${e.name})
        def pre_init_${e.name.toLowerCase()}(sender, *args, **kwargs):
        ${ident}pass

        @receiver(post_init, sender=${e.name})
        def post_init_${e.name.toLowerCase()}(sender, instance, **kwargs):
        ${ident}pass

        @receiver(pre_save, sender=${e.name})
        def pre_save_${e.name.toLowerCase()}(sender, instance, raw, using, update_fields, **kwargs):
        ${ident}pass

        @receiver(post_save, sender=${e.name})
        def post_save_${e.name.toLowerCase()}(sender, instance, created, raw, using, update_fields, **kwargs):
        ${ident}${post_save}

        @receiver(pre_delete, sender=${e.name})
        def pre_delete_${e.name.toLowerCase()}(sender, instance, using, **kwargs):
        ${ident}pass

        @receiver(post_delete, sender=${e.name})
        def post_delete_${e.name.toLowerCase()}(sender, instance, using, **kwargs):
        ${ident}pass

        @receiver(m2m_changed, sender=${e.name})
        def m2m_changed_${e.name.toLowerCase()}(sender, instance, action, reverse, model, pk_set, using, **kwargs):
        ${ident}pass
    `;
}
