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

                <v-flex offset-xs1 v-if="f.inputtype == 'text-field'" >
                  <p-text-field             
                    v-bind.sync="f"
                    v-on:input="f.value=$event"
                    v-on:input-language="f.language=$event"
                    v-on:add="addField(s.fields, f)"
                    v-on:remove="removeField(s.fields, f)"
                  ></p-text-field>
                </v-flex>

                <v-flex offset-xs1 v-else-if="f.inputtype == 'text-field-suggest'" >
                  <p-text-field-suggest
                    v-bind.sync="f"
                    v-on:input="f.value=$event"
                    v-on:input-language="f.language=$event"
                    v-on:add="addField(s.fields, f)"
                    v-on:remove="removeField(s.fields, f)"
                  ></p-text-field-suggest>
                </v-flex>

                <v-flex offset-xs1 v-if="f.inputtype == 'title'" >
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

                <v-flex offset-xs1 xs4 v-else-if="f.inputtype == 'select'" >
                  <p-select 
                    v-bind.sync="f" 
                    v-on:input="f.value=$event"
                    v-on:add="addField(s.fields, f)"
                    v-on:remove="removeField(s.fields, f)"
                  ></p-select>        
                </v-flex>

                <v-flex offset-xs1 v-else-if="f.inputtype == 'entity'" >
                  <p-entity
                    v-bind.sync="f"
                    v-on:input-firstname="f.firstname=$event"
                    v-on:input-lastname="f.lastname=$event"
                    v-on:input-role="f.role=$event"
                    v-on:input-date="f.date=$event"
                    v-on:add="addField(s.fields, f)"
                    v-on:remove="removeField(s.fields, f)"
                    v-on:up="sortFieldUp(s.fields, f)"
                    v-on:down="sortFieldDown(s.fields, f)"
                  ></p-entity>
                </v-flex>

                <v-flex offset-xs1 v-else-if="f.inputtype == 'gbv-suggest-getty'" >
                  <p-gbv-suggest-getty
                    v-bind.sync="f" 
                    v-on:input="f.value=$event"
                    v-on:add="addField(s.fields, f)"
                    v-on:remove="removeField(s.fields, f)"
                  ></p-gbv-suggest-getty>        
                </v-flex>

                <v-flex offset-xs1 v-else-if="f.inputtype == 'dimensions'" >
                  <p-dimensions
                    v-bind.sync="f" 
                    v-on:input-source="f.source=$event"
                    v-on:input-unit="f.unit=$event"
                    v-on:input-length="f.length=$event"
                    v-on:input-height="f.height=$event"
                    v-on:input-width="f.width=$event"
                    v-on:input-circumference="f.circumference=$event"
                    v-on:add="addField(s.fields, f)"
                    v-on:remove="removeField(s.fields, f)"
                  ></p-dimensions>        
                </v-flex>

                <v-flex offset-xs1 v-else-if="f.inputtype == 'file'" >
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
import PDimensions from '@/components/input-fields/PDimensions'

export default {
  name: 'submit-ksa-photo',
  components: {
    PTextField,
    PTextFieldSuggest,
    PTitle,
    PEntity,
    PSelect,
    PGbvSuggestGetty,
    PDimensions,
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
        vra: 'http://purl.org/vra/'
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
                id: 0,
                predicate: 'dcterms:type',
                value: 'http://purl.org/coar/resource_type/c_ecc8',
                ordergroup: 'title',
                multiplicable: true,
                multilingual: true
              },
              {
                id: 1,
                predicate: 'dce:title',
                label: 'Title',
                title: '',
                subtitle: '',
                language: '',
                inputtype: 'title',
                required: true,
                ordergroup: 'title',
                multiplicable: true,
                multilingual: true
              },
              {
                id: 3,
                predicate: 'bf:note',
                label: 'Description',
                value: '',
                inputtype: 'text-field',
                multiline: true,
                multiplicable: true,
                multilingual: true,
                language: ''
              },
              {
                id: 4,
                predicate: 'bf:note',
                bfnotetype: 'ethnographic',
                label: 'Sociocult. category',
                value: '',
                inputtype: 'text-field-suggest',
                suggester: 'titlesuggester',
                multiplicable: true
              },
              {
                id: 5,
                label: 'Language',
                predicate: 'dcterms:language',
                value: '',
                inputtype: 'select',
                vocabulary: 'http://id.loc.gov/vocabulary/iso639-2',
                multiplicable: true,
                required: true
              },
              {
                id: 6,
                label: 'Contributions',
                predicate: 'role',
                firstname: '',
                lastname: '',
                role: '',
                date: '',
                inputtype: 'entity',
                multiplicable: true,
                ordered: true,
                ordergroup: 'entity'
              },
              {
                id: 7,
                predicate: 'bf:note',
                bfnotetype: 'notice',
                label: 'Note',
                value: '',
                inputtype: 'text-field',
                multiline: true,
                multilingual: true
              },
              {
                id: 8,
                predicate: 'dce:subject',
                label: 'Keyword',
                value: '',
                language: '',
                inputtype: 'text-field-suggest',
                suggester: 'titlesuggester',
                multiplicable: true,
                multilingual: true
              },
              {
                id: 9,
                predicate: 'bf:note',
                bfnotetype: 'signature',
                label: 'Signature',
                value: '',
                inputtype: 'text-field',
                multiplicable: true
              }
            ]
          },
          {
            title: 'Provenance',
            id: 'provenance',
            fields: [
              {
                id: 10,
                label: 'Owner',
                predicate: 'role',
                firstname: '',
                lastname: '',
                role: 'own',
                date: '',
                disablerole: true,
                showdate: false,
                inputtype: 'entity',
                ordergroup: 'entity-urheberin'
              },
              {
                id: 11,
                predicate: 'schema:temporalCoverage',
                label: 'Zeitpunkt, Zeitraum',
                value: '',
                inputtype: 'text-field'
              },
              {
                id: 12,
                predicate: 'dcterms:provenance',
                label: 'Provenance',
                value: '',
                inputtype: 'text-field',
                multiline: true,
                multilingual: true,
                language: ''
              },
              {
                id: 13,
                predicate: 'bf:physicalLocation',
                label: 'Standort',
                value: '',
                inputtype: 'text-field'
              },
              {
                id: 14,
                predicate: 'bf:note',
                bfnotetype: 'logid',
                label: 'Aktenvermerk/Eingangsbuch',
                value: '',
                inputtype: 'text-field'
              }
            ]
          },
          {
            title: 'Contextual',
            id: 'contextual',
            fields: [
              {
                id: 27,
                label: 'Condition',
                predicate: 'bf:note',
                bfnotetype: 'condition',
                value: '',
                inputtype: 'text-field'
              },
              {
                id: 21,
                label: 'Original/Copy',
                predicate: 'bf:note',
                bfnotetype: 'original-copy',
                value: '',
                inputtype: 'select',
                vocabulary: 'original-copy'
              },
              {
                id: 19,
                predicate: 'vra-measurements',
                label: 'Dimensions',
                source: 'http://vocab.getty.edu/aat/300162056',
                unit: 'CMT',
                height: '',
                width: '',
                inputtype: 'dimensions',
                multiplicable: true
              },
              {
                id: 23,
                predicate: 'vra:hasInscription',
                label: 'Inscription',
                value: '',
                inputtype: 'text-field',
                multiline: true,
                multilingual: true,
                language: ''
              },
              {
                id: 24,
                label: 'Stamp',
                predicate: 'bf:note',
                bfnotetype: 'stamp',
                value: '',
                inputtype: 'select',
                vocabulary: 'stamp'
              },
              {
                id: 15,
                predicate: 'dce:coverage',
                label: 'Ort',
                value: '',
                inputtype: 'gbv-suggest-getty',
                voc: 'tgn'
              }
            ]
          },
          {
            title: 'Technical Data',
            id: 'technical',
            fields: [
              {
                id: 28,
                predicate: 'opaque:digitalOrigin',
                label: 'Digitization',
                value: 'reformatted digital',
                inputtype: 'select',
                vocabulary: 'digital-origin',
                multilingual: true
              },
              {
                id: 288,
                label: 'Digitization note',
                predicate: 'bf:note',
                bfnotetype: 'digitization',
                value: '',
                inputtype: 'text-field',
                multilingual: true
              },
              {
                id: 29,
                label: 'Digitiser',
                predicate: 'role',
                firstname: '',
                lastname: '',
                role: 'digitiser',
                date: '',
                disablerole: true,
                showdate: true,
                inputtype: 'entity',
                ordergroup: 'entity-digitiser'
              }
            ]
          },
          {
            title: 'Rights',
            id: 'rights',
            fields: [
              {
                id: 30,
                label: 'License',
                predicate: 'edm:rights',
                value: '',
                inputtype: 'select',
                vocabulary: 'licenses'
              },
              {
                id: 31,
                predicate: 'dce:rights',
                label: 'Rights statement',
                value: '',
                inputtype: 'text-field',
                multiline: true,
                multilingual: true,
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
                id: 33,
                label: 'Datei',
                value: '',
                inputtype: 'file'
              },
              {
                id: 34,
                predicate: 'dce:title',
                label: 'Title',
                title: '',
                subtitle: '',
                language: '',
                inputtype: 'title',
                required: true,
                ordergroup: 'title',
                multiplicable: true,
                multilingual: true
              },
              {
                id: 36,
                predicate: 'bf:note',
                label: 'Description',
                value: '',
                inputtype: 'text-field',
                multiline: true,
                multiplicable: true,
                multilingual: true,
                language: ''
              },
              {
                id: 37,
                predicate: 'bf:note',
                bfnotetype: 'signature',
                label: 'Signature',
                value: '',
                inputtype: 'text-field',
                multiplicable: true
              },
              {
                id: 38,
                predicate: 'bf:note',
                bfnotetype: 'filename',
                label: 'Filename',
                value: '',
                inputtype: 'text-field',
                multiplicable: true
              },
              {
                id: 39,
                label: 'Format',
                predicate: 'dce:format',
                value: 'image/tiff',
                inputtype: 'select',
                vocabulary: 'mime-types'
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

      var vraWork = {
        '@type': 'vra:Work'
      }
      var addVraWork = false

      for (var i = 0; i < this.form.sections.length; i++) {
        var s = this.form.sections[i]
        var jsonldid = 'container'
        if (s.type === 'file') {
          jsonldid = 'member_' + s.id
          this.jsonlds[jsonldid] = {
            '@context': this.jsonldcontext
          }
        }
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
                  '@value': f.value
                }
                if (f.language && (f.language !== '')) {
                  subdef['@language'] = f.language
                }
                if (!this.jsonlds[jsonldid]['dce:subject']) {
                  this.jsonlds[jsonldid]['dce:subject'] = []
                }
                this.jsonlds[jsonldid]['dce:subject'].push(subdef)
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

            case 'role':
              if (f.role && (f.role !== '') && (f.firstname !== '' || f.lastname !== '')) {
                var roledef = {
                  '@type': 'schema:Person',
                  'schema:givenName': {
                    '@value': f.firstname
                  },
                  'schema:familyName': {
                    '@value': f.lastname
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
                vraWork['vra:hasTechnique'] = f.technique
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
                  vraWork['vra:text']['@language'] = f.language
                }
                addVraWork = true
              }
              break

            default:
              if (f.predicate && (f.predicate !== '')) {
                if (f.value && (f.value !== '')) {
                  this.jsonlds[jsonldid][f.predicate] = f.value
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
