<template>
  <v-container grid-list-lg class="ksa-submit" >

    <v-toolbar color="primary lighten-3" tabs dark>
      <v-toolbar-title>KSA Submit - Photo</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu bottom left>
        <v-btn slot="activator" dark icon >
          <v-icon>more_vert</v-icon>
        </v-btn>

        <v-list>
          <v-list-tile @click="" >
            <v-list-tile-title>{{ $t('Create template') }}</v-list-tile-title>
          </v-list-tile>
          <v-list-tile @click="" >
            <v-list-tile-title>{{ $t('Load template') }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>

      <v-tabs v-model="activetab" slot="extension" slider-color="primary" color="primary lighten-3" align-with-title>
        <v-tab ripple >Form</v-tab>
        <v-tab ripple @click="generateJson()">Debug</v-tab>
      </v-tabs>
    </v-toolbar>
    <v-tabs-items v-model="activetab">
      <v-tab-item class="pa-3">

        <v-layout v-for="(s) in this.form.sections" :key="s.id" column wrap class="ma-3">
          
          <v-card >
            <v-card-title class="headline grey lighten-2 white--text">
              <span>{{ $t(s.title) }}</span>
              <v-spacer></v-spacer>
              <v-btn v-if="s.multiplicable" flat icon v-on:click.native="addSection(s)" class="grey lighten-2 white--text">
                <icon name="material-content-add" width="24px" height="24px"></icon>
              </v-btn>
              <v-btn v-if="s.multiplicable" flat icon v-on:click.native="removeSection(s)" class="grey lighten-2 white--text">
                <icon name="material-content-remove" width="24px" height="24px"></icon>
              </v-btn>
            </v-card-title>
            <v-card-text class="mt-4">
              <v-layout v-for="(f) in s.fields" :key="f.id" row wrap>

                <v-flex offset-xs1 v-if="f.component == 'p-text-field'" >
                  <p-text-field             
                    v-bind.sync="f"
                    v-on:input="f.value=$event"
                    v-on:input-language="f.language=$event"
                    v-on:add="addField(s.fields, f)"
                    v-on:remove="removeField(s.fields, f)"
                  ></p-text-field>
                </v-flex>

                <v-flex offset-xs1 v-else-if="f.component == 'p-text-field-suggest'" >
                  <p-text-field-suggest
                    v-bind.sync="f"
                    v-on:input="f.value=$event"
                    v-on:input-language="f.language=$event"
                    v-on:add="addField(s.fields, f)"
                    v-on:remove="removeField(s.fields, f)"
                  ></p-text-field-suggest>
                </v-flex>

                <v-flex offset-xs1 v-if="f.component == 'p-title'" >
                  <p-title            
                    v-bind.sync="f"
                    v-on:input-title="f.title=$event"
                    v-on:input-subtitle="f.subtitle=$event"
                    v-on:input-language="f.language=$event"
                    v-on:add="addField(s.fields, f)"
                    v-on:remove="removeField(s.fields, f)"
                    v-on:up="sortFieldUp(s.fields, f)"
                    v-on:down="sortFieldDown(s.fields, f)"
                  ></p-title>
                </v-flex>

                <v-flex offset-xs1 xs4 v-else-if="f.component == 'p-select'" >
                  <p-select 
                    v-bind.sync="f" 
                    v-on:input="f.value=$event"
                    v-on:add="addField(s.fields, f)"
                    v-on:remove="removeField(s.fields, f)"
                  ></p-select>        
                </v-flex>

                <v-flex offset-xs1 v-else-if="f.component == 'p-entity'" >
                  <p-entity
                    v-bind.sync="f"
                    v-on:input-firstname="f.firstname=$event"
                    v-on:input-lastname="f.lastname=$event"
                    v-on:input-institution="f.institution=$event"
                    v-on:input-role="f.role=$event"
                    v-on:input-date="f.date=$event"
                    v-on:add="addField(s.fields, f)"
                    v-on:remove="removeField(s.fields, f)"
                    v-on:up="sortFieldUp(s.fields, f)"
                    v-on:down="sortFieldDown(s.fields, f)"
                  ></p-entity>
                </v-flex>

                <v-flex offset-xs1 v-else-if="f.component == 'p-gbv-suggest-getty'" >
                  <p-gbv-suggest-getty
                    v-bind.sync="f" 
                    v-on:input="f.value=$event"
                    v-on:resolve="updatePlace(f, $event)"
                    v-on:add="addField(s.fields, f)"
                    v-on:remove="removeField(s.fields, f)"
                  ></p-gbv-suggest-getty>        
                </v-flex>

                <v-flex offset-xs1 v-else-if="f.component == 'p-dimension'" >
                  <p-dimension
                    v-bind.sync="f" 
                    v-on:input-value="f.value=$event"
                    v-on:input-unit="f.unit=$event"
                    v-on:add="addField(s.fields, f)"
                    v-on:remove="removeField(s.fields, f)"
                  ></p-dimension>        
                </v-flex>

                <v-flex offset-xs1 v-else-if="f.component == 'p-project'" >
                  <p-project
                    v-bind.sync="f" 
                    v-on:input-name="f.name=$event"
                    v-on:input-name-language="f.nameLanguage=$event"
                    v-on:input-description="f.description=$event"
                    v-on:input-description-language="f.descriptionLanguage=$event"
                    v-on:input-identifier="f.identifier=$event"
                    v-on:input-homepage="f.homepage=$event"
                    v-on:add="addField(s.fields, f)"
                    v-on:remove="removeField(s.fields, f)"
                  ></p-project>        
                </v-flex>

                <v-flex offset-xs1 v-else-if="f.component == 'p-funder'" >
                  <p-funder
                    v-bind.sync="f" 
                    v-on:input-name="f.name=$event"
                    v-on:input-name-language="f.nameLanguage=$event"
                    v-on:input-identifier="f.identifier=$event"
                    v-on:add="addField(s.fields, f)"
                    v-on:remove="removeField(s.fields, f)"
                  ></p-funder>        
                </v-flex>

                <v-flex offset-xs1 v-else-if="f.component == 'input-file'" >
                  <input type="file" @input="f.value = $event.target.files[0]">
                </v-flex>

              </v-layout>
            </v-card-text>
          </v-card>

        </v-layout>

        <v-layout row wrap class="ma-3">
          <v-spacer></v-spacer>
          <v-btn raised color="primary lighten-2" @click="submit()">Submit</v-btn>
        </v-layout>
  
      </v-tab-item>
      <v-tab-item class="ma-4">
        <vue-json-pretty :data="metadata" ref="prettyprint"></vue-json-pretty>
      </v-tab-item>
    </v-tabs-items>

  </v-container>
 
</template>

<script>
import base64 from 'base-64'
import VueJsonPretty from 'vue-json-pretty'
import arrays from '@/utils/arrays'
import PTextField from '@/components/input-fields/PTextField'
import PTextFieldSuggest from '@/components/input-fields/PTextFieldSuggest'
import PTitle from '@/components/input-fields/PTitle'
import PEntity from '@/components/input-fields/PEntity'
import PSelect from '@/components/input-fields/PSelect'
import PGbvSuggestGetty from '@/components/input-fields/PGbvSuggestGetty'
import PDimension from '@/components/input-fields/PDimension'
import PProject from '@/components/input-fields/PProject'
import PFunder from '@/components/input-fields/PFunder'

export default {
  name: 'submit-ksa-photo',
  components: {
    PTextField,
    PTextFieldSuggest,
    PTitle,
    PEntity,
    PSelect,
    PGbvSuggestGetty,
    PDimension,
    PProject,
    PFunder,
    VueJsonPretty
  },
  data () {
    return {
      activetab: null,
      jsonldcontext: {
        bf: 'http://id.loc.gov/ontologies/bibframe/',
        dce: 'http://purl.org/dc/elements/1.1/',
        rdfs: 'https://www.w3.org/TR/rdf-schema/',
        dcterms: 'http://purl.org/dc/terms/',
        role: 'https://phaidra.org/vocabulary/roles',
        edm: 'http://www.europeana.eu/schemas/edm/',
        schema: 'http://schema.org/',
        vra: 'http://purl.org/vra/',
        frapo: 'http://purl.org/cerif/frapo',
        ebucore: 'http://www.ebu.ch/metadata/ontologies/ebucore/ebucore'
      },
      jsonlds: {},
      metadata: {},
      form: {
        sections: [
          {
            title: 'General',
            id: 'general',
            fields: [
              {
                id: 100,
                predicate: 'dcterms:type',
                metadataset: 'digital',
                component: 'p-select',
                vocabulary: 'http://purl.org/coar/resource_type/',
                required: true,
                multiplicable: false,
                label: 'Resource type',
                value: 'http://purl.org/coar/resource_type/c_ecc8'
              },
              {
                id: 101,
                predicate: 'dce:title',
                metadataset: 'digital',
                component: 'p-title',
                required: true,
                multiplicable: true,
                multilingual: true,
                ordergroup: 'title',
                label: 'Title',
                title: '',
                subtitle: '',
                language: ''
              },
              {
                id: 102,
                predicate: 'bf:note',
                metadataset: 'digital',
                component: 'p-text-field',
                multiplicable: true,
                multilingual: true,
                multiline: true,
                label: 'Description',
                value: '',
                language: ''
              },
              {
                id: 103,
                predicate: 'opaque:ethnographic',
                metadataset: 'digital',
                component: 'p-text-field-suggest',
                suggester: 'titlesuggester',
                multiplicable: true,
                multilingual: true,
                label: 'Sociocultural category',
                value: ''
              },
              {
                id: 104,
                predicate: 'dcterms:language',
                metadataset: 'digital',
                component: 'p-select',
                vocabulary: 'http://id.loc.gov/vocabulary/iso639-2',
                required: true,
                multiplicable: true,
                label: 'Language',
                value: ''
              },
              {
                id: 105,
                predicate: 'role',
                type: 'schema:Person',
                metadataset: 'digital',
                component: 'p-entity',
                multiplicable: true,
                ordered: true,
                ordergroup: 'general-entity',
                label: 'Contributions',
                firstname: '',
                lastname: '',
                role: '',
                date: ''
              },
              {
                id: 106,
                predicate: 'bf:note',
                type: 'phaidra:Remark',
                metadataset: 'digital',
                component: 'p-text-field',
                multilingual: true,
                multiline: true,
                label: 'Note',
                value: '',
                language: ''
              },
              {
                id: 107,
                predicate: 'dce:subject',
                metadataset: 'digital',
                component: 'p-text-field-suggest',
                suggester: 'titlesuggester',
                multiplicable: true,
                multilingual: true,
                label: 'Keyword',
                value: '',
                language: ''
              },
              {
                id: 108,
                predicate: 'frapo:isOutputOf',
                metadataset: 'digital',
                component: 'p-project',
                name: '',
                nameLanguage: '',
                description: '',
                descriptionLanguage: '',
                identifier: '',
                homepage: ''
              },
              {
                id: 109,
                predicate: 'frapo:hasFundingAgency',
                metadataset: 'digital',
                component: 'p-funder',
                name: '',
                nameLanguage: '',
                identifier: ''
              }
            ]
          },
          {
            title: 'Digitized object',
            id: 'digitized',
            fields: [
              {
                id: 200,
                predicate: 'bf:shelfMark',
                metadataset: 'analog',
                component: 'p-text-field',
                multiplicable: true,
                label: 'Call number',
                value: ''
              },
              {
                id: 201,
                predicate: 'schema:temporalCoverage',
                metadataset: 'analog',
                component: 'p-text-field',
                label: 'Temporal coverage',
                value: ''
              },
              {
                id: 202,
                predicate: 'dcterms:provenance',
                metadataset: 'analog',
                component: 'p-text-field',
                multiline: true,
                multilingual: true,
                label: 'Provenance',
                value: '',
                language: ''
              },
              {
                id: 203,
                predicate: 'bf:physicalLocation',
                metadataset: 'digital',
                component: 'p-text-field',
                label: 'Physical location',
                value: ''
              },
              {
                id: 204,
                predicate: 'opaque:cco_accessionNumber',
                metadataset: 'analog',
                component: 'p-text-field',
                label: 'Accession number',
                value: ''
              },
              {
                id: 205,
                predicate: 'bf:note',
                type: 'phaidra:ConditionNote',
                metadataset: 'analog',
                component: 'p-text-field',
                multilingual: true,
                multiline: true,
                label: 'Condition',
                value: '',
                language: ''
              },
              {
                id: 206,
                predicate: 'bf:note',
                type: 'phaidra:ReproductionNote',
                metadataset: 'analog',
                component: 'p-select',
                vocabulary: 'original-copy',
                label: 'Reproduction note',
                value: ''
              },
              {
                id: 208,
                predicate: 'vra:technique',
                type: 'vra:Technique',
                metadataset: 'analog',
                component: 'p-select',
                vocabulary: 'getty-aat-photo',
                label: 'Technique',
                value: 'http://vocab.getty.edu/aat/300162056'
              },
              {
                id: 209,
                predicate: 'vra:technique',
                type: 'vra:Technique',
                metadataset: 'analog',
                component: 'p-text-field',
                multilingual: true,
                multiplicable: true,
                label: 'Technique',
                value: '',
                language: ''
              },
              {
                id: 210,
                predicate: 'vra:material',
                type: 'vra:Material',
                metadataset: 'analog',
                component: 'p-text-field',
                multilingual: true,
                multiplicable: true,
                label: 'Material description',
                value: '',
                language: ''
              },
              {
                id: 211,
                predicate: 'schma:height',
                metadataset: 'analog',
                component: 'p-dimension',
                label: 'Height',
                unit: 'CMT',
                value: ''
              },
              {
                id: 212,
                predicate: 'schma:width',
                metadataset: 'analog',
                component: 'p-dimension',
                label: 'Width',
                unit: 'CMT',
                value: ''
              },
              {
                id: 213,
                predicate: 'vra:hasInscription',
                metadataset: 'analog',
                component: 'p-text-field',
                multiline: true,
                multiplicable: true,
                multilingual: true,
                label: 'Inscription',
                value: '',
                language: ''
              },
              {
                id: 214,
                predicate: 'vra:hasInscription',
                metadataset: 'analog',
                component: 'p-select',
                vocabulary: 'https://phaidra.org/vocabularies/stamp/',
                label: 'Stamp',
                value: ''
              },
              {
                id: 215,
                predicate: 'dcterms:spatial',
                metadataset: 'analog',
                component: 'p-gbv-suggest-getty',
                voc: 'tgn',
                label: 'Place',
                value: ''
              },
              {
                id: 216,
                predicate: 'dcterms:spatial',
                metadataset: 'analog',
                component: 'p-text-field',
                multilingual: true,
                multiplicable: true,
                label: 'Place (native name)',
                value: '',
                language: ''
              }
            ]
          },
          {
            title: 'Depicted object',
            id: 'subject-represented',
            fields: [
              {
                id: 300,
                predicate: 'dce:title',
                metadataset: 'subject-represented',
                component: 'p-title',
                required: true,
                multiplicable: true,
                multilingual: true,
                ordergroup: 'title',
                label: 'Title',
                title: '',
                subtitle: '',
                language: ''
              },
              {
                id: 301,
                predicate: 'bf:note',
                metadataset: 'subject-represented',
                component: 'p-text-field',
                multiplicable: true,
                multilingual: true,
                multiline: true,
                label: 'Description',
                value: '',
                language: ''
              },
              {
                id: 302,
                predicate: 'bf:shelfMark',
                metadataset: 'subject-represented',
                component: 'p-text-field',
                multiplicable: true,
                label: 'Call number',
                value: ''
              },
              {
                id: 303,
                predicate: 'schema:temporalCoverage',
                metadataset: 'subject-represented',
                component: 'p-text-field',
                label: 'Temporal coverage',
                value: ''
              },
              {
                id: 304,
                predicate: 'dcterms:provenance',
                metadataset: 'subject-represented',
                component: 'p-text-field',
                multiline: true,
                multilingual: true,
                label: 'Provenance',
                value: '',
                language: ''
              },
              {
                id: 305,
                predicate: 'bf:physicalLocation',
                metadataset: 'subject-represented',
                component: 'p-text-field',
                label: 'Physical location',
                value: ''
              },
              {
                id: 306,
                predicate: 'role',
                type: 'schema:Person',
                metadataset: 'subject-represented',
                component: 'p-entity',
                multiplicable: true,
                ordered: true,
                ordergroup: 'general-entity',
                label: 'Contributions',
                firstname: '',
                lastname: '',
                role: '',
                date: ''
              },
              {
                id: 307,
                predicate: 'opaque:cco_accessionNumber',
                metadataset: 'subject-represented',
                component: 'p-text-field',
                label: 'Accession number',
                value: ''
              },
              {
                id: 308,
                predicate: 'vra:technique',
                type: 'vra:Technique',
                metadataset: 'subject-represented',
                component: 'p-select',
                vocabulary: 'getty-aat-photo',
                label: 'Technique',
                value: ''
              },
              {
                id: 309,
                predicate: 'vra:material',
                type: 'vra:Material',
                metadataset: 'subject-represented',
                component: 'p-text-field',
                multilingual: true,
                multiplicable: true,
                label: 'Material description',
                value: '',
                language: ''
              },
              {
                id: 310,
                predicate: 'schma:height',
                metadataset: 'analog',
                component: 'p-dimension',
                label: 'Height',
                unit: 'CMT',
                value: ''
              },
              {
                id: 311,
                predicate: 'schma:width',
                metadataset: 'analog',
                component: 'p-dimension',
                label: 'Width',
                unit: 'CMT',
                value: ''
              },
              {
                id: 312,
                predicate: 'schma:depth',
                metadataset: 'analog',
                component: 'p-dimension',
                label: 'Depth',
                unit: 'CMT',
                value: ''
              }
            ]
          },
          {
            title: 'Rights',
            id: 'rights',
            fields: [
              {
                id: 400,
                predicate: 'edm:rights',
                metadataset: 'digital',
                component: 'p-select',
                vocabulary: 'licenses',
                label: 'License',
                value: ''
              },
              {
                id: 401,
                predicate: 'dce:rights',
                metadataset: 'digital',
                component: 'p-text-field',
                multiline: true,
                multilingual: true,
                label: 'Rights statement',
                value: '',
                language: ''
              }
            ]
          },
          {
            title: 'File',
            id: 32,
            type: 'file',
            multiplicable: true,
            fields: [
              {
                id: 500,
                component: 'input-file',
                label: 'Datei',
                value: ''
              },
              {
                id: 501,
                predicate: 'dce:title',
                metadataset: 'digital',
                component: 'p-title',
                required: true,
                multiplicable: true,
                multilingual: true,
                ordergroup: 'title',
                label: 'Title',
                title: '',
                subtitle: '',
                language: ''
              },
              {
                id: 502,
                predicate: 'bf:note',
                metadataset: 'digital',
                component: 'p-text-field',
                multiplicable: true,
                multilingual: true,
                multiline: true,
                label: 'Description',
                value: '',
                language: ''
              },
              {
                id: 503,
                predicate: 'ebucore:filename',
                metadataset: 'digital',
                component: 'p-text-field',
                label: 'Filename',
                value: ''
              },
              {
                id: 504,
                predicate: 'ebucore:hasMimeType',
                metadataset: 'digital',
                component: 'p-select',
                vocabulary: 'mime-types',
                label: 'MIME type',
                value: 'image/tiff'
              },
              {
                id: 505,
                predicate: 'bf:note',
                type: 'phaidra:DigitizationNote',
                metadataset: 'digital',
                component: 'p-text-field',
                multilingual: true,
                multiline: true,
                label: 'Condition',
                value: '',
                language: ''
              },
              {
                id: 506,
                predicate: 'role',
                type: 'schema:Person',
                metadataset: 'digital',
                component: 'p-entity',
                disablerole: true,
                showdate: true,
                ordergroup: 'file-entity',
                label: 'Digitiser',
                firstname: '',
                lastname: '',
                role: 'digitiser',
                date: ''
              }
            ]
          }
        ]
      }
    }
  },
  methods: {
    submit: function () {
      var self = this
      this.generateJson()
      var formData = new FormData()
      formData.append('metadata', JSON.stringify(this.metadata))
      for (var i = 0; i < this.form.sections.length; i++) {
        var s = this.form.sections[i]
        if (s.type === 'file') {
          for (var j = 0; j < s.fields.length; j++) {
            if (s.fields[j].inputtype === 'file') {
              if (s.fields[j].value !== '') {
                formData.append('member_' + s.id, s.fields[j].value)
              }
            }
          }
        }
      }
      fetch(self.$store.state.settings.instance.api + '/container/create', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Authorization': 'Basic ' + base64.encode(self.$store.state.settings.instance.adminuser + ':' + self.$store.state.settings.instance.adminpass),
          'X-XSRF-TOKEN': this.$store.state.user.token
        },
        body: formData
      })
      .then(response => response.json())
      .then(function (json) {
        if (json.alerts && json.alerts.length > 0) {
          self.$store.commit('setAlerts', json.alerts)
        }
      })
      .catch(function (error) {
        self.$store.commit('setAlerts', [{ type: 'danger', msg: error }])
        console.error('Error:', error)
      })
    },
    generateJson: function () {
      this.jsonlds['container'] = {
        '@context': this.jsonldcontext
      }

      for (var i = 0; i < this.form.sections.length; i++) {
        var s = this.form.sections[i]
        var jsonldid = 'container'
        if (s.type === 'file') {
          jsonldid = 'member_' + s.id
          this.jsonlds[jsonldid] = {
            '@context': this.jsonldcontext
          }
        }
        if (s.id === 'secondary') {
          jsonldid = 'secondary'
          this.jsonlds[jsonldid] = {}
        }
        var vraWork = {
          '@type': 'vra:Work'
        }
        var addVraWork = false
        for (var j = 0; j < s.fields.length; j++) {
          var f = s.fields[j]

          switch (f.predicate) {

            case 'dce:title':
              if (f.title !== '') {
                var titledef = {
                  '@type': 'bf:Title',
                  'bf:mainTitle': {
                    '@value': f.title
                  }
                }
                if (f.language !== '') {
                  titledef['bf:mainTitle']['@language'] = f.language
                }
                if (f.subtitle !== '') {
                  titledef['bf:subtitle'] = {
                    '@value': f.subtitle
                  }
                  if (f.language !== '') {
                    titledef['bf:subtitle']['@language'] = f.language
                  }
                }
                if (!this.jsonlds[jsonldid]['dce:title']) {
                  this.jsonlds[jsonldid]['dce:title'] = []
                }
                this.jsonlds[jsonldid]['dce:title'].push(titledef)
              }
              break

            case 'funding':
              if ((f.projectName !== '') || (f.projectId !== '')) {
                var projectdef = {
                  '@type': 'foaf:Project'
                }
                if (f.projectName !== '') {
                  projectdef['rdfs:label'] = {
                    '@value': f.projectName
                  }
                }
                if (f.projectNameLanguage !== '') {
                  projectdef['rdfs:label']['@language'] = f.projectNameLanguage
                }
                if (f.projectId !== '') {
                  projectdef['skos:exactMatch'] = f.projectId
                }
                if (!this.jsonlds[jsonldid]['frapo:isOutputOf']) {
                  this.jsonlds[jsonldid]['frapo:isOutputOf'] = []
                }
                this.jsonlds[jsonldid]['frapo:isOutputOf'].push(projectdef)
              }
              if ((f.funderName !== '') || (f.funderId !== '')) {
                var funderdef = {
                  '@type': 'frapo:FundingAgency'
                }
                if (f.funderName !== '') {
                  funderdef['rdfs:label'] = {
                    '@value': f.funderName
                  }
                }
                if (f.funderNameLanguage !== '') {
                  funderdef['rdfs:label']['@language'] = f.funderNameLanguage
                }
                if (f.funderId !== '') {
                  funderdef['skos:exactMatch'] = f.funderId
                }
                if (!this.jsonlds[jsonldid]['frapo:hasFundingAgency']) {
                  this.jsonlds[jsonldid]['frapo:hasFundingAgency'] = []
                }
                this.jsonlds[jsonldid]['frapo:hasFundingAgency'].push(funderdef)
              }
              break

            case 'bf:note':
              if (f.value !== '') {
                var notedef = {
                  'rdfs:label': {
                    '@value': f.value
                  }
                }
                if (f.language && (f.language !== '')) {
                  notedef['rdfs:label']['@language'] = f.language
                }
                if (f.bfnotetype && (f.bfnotetype !== '')) {
                  notedef['bf:noteType'] = f.bfnotetype
                }
                if (!this.jsonlds[jsonldid]['bf:note']) {
                  this.jsonlds[jsonldid]['bf:note'] = []
                }
                this.jsonlds[jsonldid]['bf:note'].push(notedef)
              }
              break

            case 'dce:subject':
              if (f.value !== '') {
                var subdef = {
                  '@type': 'skos:Concept',
                  'skos:prefLabel': {
                    '@value': f.value
                  }
                }
                if (f.language && (f.language !== '')) {
                  subdef['skos:prefLabel']['@language'] = f.language
                }
                if (!this.jsonlds[jsonldid]['dce:subject']) {
                  this.jsonlds[jsonldid]['dce:subject'] = []
                }
                this.jsonlds[jsonldid]['dce:subject'].push(subdef)
              }
              break

            case 'dcterms:spatial':
              if (f.inputtype === 'text-field') {
                var spaconceptdef = {
                  '@type': 'skos:Concept',
                  'skos:prefLabel': {
                    '@value': f.value
                  }
                }
                if (f.language && (f.language !== '')) {
                  spaconceptdef['skos:prefLabel']['@language'] = f.language
                }
                if (!this.jsonlds[jsonldid]['dcterms:spatial']) {
                  this.jsonlds[jsonldid]['dcterms:spatial'] = []
                }
                this.jsonlds[jsonldid]['dcterms:spatial'].push(spaconceptdef)
              }
              if (f.inputtype === 'gbv-suggest-getty') {
                if (f.prefLabel && (f.prefLabel.length > 0)) {
                  var spadef = {
                    '@type': 'schema:Place'
                  }
                  if (f.value) {
                    spadef['skos:exactMatch'] = [f.value]
                  }
                  if (f.prefLabel) {
                    spadef['skos:prefLabel'] = f.prefLabel
                  }
                  if (f.path) {
                    spadef['rdfs:label'] = f.path
                  }
                  if (f.coordinates) {
                    spadef['schema:geo'] = {
                      '@type': 'schema:GeoCoordinates',
                      'schema:latitude': f.coordinates['schema:latitude'],
                      'schema:longitude': f.coordinates['schema:longitude']
                    }
                  }
                  if (!this.jsonlds[jsonldid]['dcterms:spatial']) {
                    this.jsonlds[jsonldid]['dcterms:spatial'] = []
                  }
                  this.jsonlds[jsonldid]['dcterms:spatial'].push(spadef)
                }
              }
              break

            case 'dce:rights':
              if (f.value !== '') {
                var rdef = {
                  '@value': f.value
                }
                if (f.language && (f.language !== '')) {
                  rdef['@language'] = f.language
                }
                if (!this.jsonlds[jsonldid]['dce:rights']) {
                  this.jsonlds[jsonldid]['dce:rights'] = []
                }
                this.jsonlds[jsonldid]['dce:rights'].push(rdef)
              }
              break

            case 'dce:format':
              if (f.value !== '') {
                if (!this.jsonlds[jsonldid]['dce:format']) {
                  this.jsonlds[jsonldid]['dce:format'] = []
                }
                this.jsonlds[jsonldid]['dce:format'].push(f.value)
              }
              break

            case 'opaque:digitalOrigin':
              if (f.value !== '') {
                var dodef = {
                  '@value': f.value
                }
                if (f.language && (f.language !== '')) {
                  dodef['@language'] = f.language
                }
                if (!this.jsonlds[jsonldid]['opaque:digitalOrigin']) {
                  this.jsonlds[jsonldid]['opaque:digitalOrigin'] = []
                }
                this.jsonlds[jsonldid]['opaque:digitalOrigin'].push(dodef)
              }
              break

            case 'schema:temporalCoverage':
              if (f.value !== '') {
                var tcdef = {
                  '@value': f.value
                }
                if (f.language && (f.language !== '')) {
                  tcdef['@language'] = f.language
                }
                if (!this.jsonlds[jsonldid]['schema:temporalCoverage']) {
                  this.jsonlds[jsonldid]['schema:temporalCoverage'] = []
                }
                this.jsonlds[jsonldid]['schema:temporalCoverage'].push(tcdef)
              }
              break

            case 'role':
              if (f.role && (f.role !== '') && (f.firstname !== '' || f.lastname !== '' || f.institution !== '')) {
                var roledef
                if (f.type === 'personal') {
                  roledef = {
                    '@type': 'schema:Person',
                    'schema:givenName': {
                      '@value': f.firstname
                    },
                    'schema:familyName': {
                      '@value': f.lastname
                    }
                  }
                }
                if (f.type === 'corporate') {
                  roledef = {
                    '@type': 'schema:Organization',
                    'schema:name': {
                      '@value': f.institution
                    }
                  }
                }
                if (f.date && (f.date !== '')) {
                  roledef['dcterms:date'] = f.date
                }
                if (!this.jsonlds[jsonldid]['role:' + f.role]) {
                  this.jsonlds[jsonldid]['role:' + f.role] = []
                }
                this.jsonlds[jsonldid]['role:' + f.role].push(roledef)
              }
              break

            case 'dcterms:provenance':
              if (f.value !== '') {
                var provdef = {
                  '@type': 'dcterms:ProvenanceStatement',
                  'rdfs:label': {
                    '@value': f.value,
                    '@language': f.language
                  }
                }
                if (f.language && (f.language !== '')) {
                  provdef['rdfs:label']['@language'] = f.language
                }
                if (!this.jsonlds[jsonldid]['dctems:provenance']) {
                  this.jsonlds[jsonldid]['dctems:provenance'] = []
                }
                this.jsonlds[jsonldid]['dctems:provenance'].push(provdef)
              }
              break

            case 'vra-measurements':
              if (f.height !== '' || f.width !== '') {
                if (f.technique) {
                  vraWork['vra:hasTechnique'] = f.technique
                }
                vraWork['vra:height'] = {
                  '@type': 'vra:QuantitativeValue',
                  'vra:unitCode': f.unit,
                  'vra:value': f.height
                }
                vraWork['vra:width'] = {
                  '@type': 'vra:QuantitativeValue',
                  'vra:unitCode': f.unit,
                  'vra:value': f.width
                }
                addVraWork = true
              }
              break

            case 'vra:hasInscription':
              if (f.value !== '') {
                vraWork['vra:hasInscription'] = {
                  '@type': 'vra:Inscription',
                  'vra:text': {
                    '@value': f.value
                  }
                }
                if (f.language && (f.language !== '')) {
                  vraWork['vra:hasInscription']['vra:text']['@language'] = f.language
                }
                addVraWork = true
              }
              break

            default:
              if (f.predicate && (f.predicate !== '')) {
                if (f.value && (f.value !== '')) {
                  if (!this.jsonlds[jsonldid][f.predicate]) {
                    this.jsonlds[jsonldid][f.predicate] = []
                  }
                  this.jsonlds[jsonldid][f.predicate].push(f.value)
                }
              }
          }
        }
      }
      if (addVraWork) {
        if (!this.jsonlds[jsonldid]['vra:imageOf']) {
          this.jsonlds[jsonldid]['vra:imageOf'] = []
        }
        this.jsonlds[jsonldid]['vra:imageOf'].push(vraWork)
      }
      this.metadata = { metadata: { 'json-ld': this.jsonlds } }
      this.$refs.prettyprint.$forceUpdate()
    },
    addField: function (arr, f) {
      var newField = arrays.duplicate(arr, f)
      if (newField) {
        newField.id = (new Date()).getTime()
        newField.value = ''
        newField.language = ''
      }
    },
    removeField: function (arr, f) {
      arrays.remove(arr, f)
    },
    sortFieldUp: function (arr, f) {
      var i = arr.indexOf(f)
      if (arr[i - 1]) {
        if (arr[i - 1].ordergroup === f.ordergroup) {
          arrays.moveUp(arr, f)
        }
      }
    },
    sortFieldDown: function (arr, f) {
      var i = arr.indexOf(f)
      if (arr[i + 1]) {
        if (arr[i + 1].ordergroup === f.ordergroup) {
          arrays.moveDown(arr, f)
        }
      }
    },
    addSection: function (s) {
      var ns = arrays.duplicate(this.form.sections, s)
      ns.id = (new Date()).getTime()
      for (var i = 0; i < ns.fields.length; i++) {
        var id = (new Date()).getTime()
        if (i > 0) {
          id = ns.fields[i - 1].id + 1
        }
        ns.fields[i].id = id
        ns.fields[i].value = ''
        ns.fields[i].language = ''
      }
    },
    removeSection: function (s) {
      arrays.remove(this.form.sections, s)
    },
    updatePlace: function (f, event) {
      f.prefLabel = event.prefLabel
      f.path = event.path
      f.coordinates = event.coordinates
    }
  },
  beforeRouteEnter: function (to, from, next) {
    next(vm => {
      vm.$store.dispatch('loadRoles')
    })
  }
}
</script>

<style>
.ksa-submit .v-label {
  color: rgba(0, 0, 0, 0.8) !important;
}
</style>

<style scoped>
.v-btn {
  margin: 0;
}
</style>
