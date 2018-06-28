<template>
  <v-container grid-list-lg class="form-background" fluid>
    <v-layout row wrap>
      <v-flex xs12 class="text-xs-right display-2 submit-header mb-1">KSA Submit - Photo</v-flex>
    </v-layout>
 
    <v-tabs v-model="activetab" slider-color="primary" >
      <v-tab ripple >Form</v-tab>
      <v-tab ripple @click="generateJson()">Debug</v-tab>
      <v-tab-item>

        <v-layout v-for="(s) in this.form.sections" :key="s.id" column wrap>

          <v-layout row wrap class=" pa-4 mt-4 border-top">
            <v-flex xs4>
              <h3 class="display-2 submit-header">{{ $t(s.title) }}</h3>
            </v-flex>
            <v-flex xs6></v-flex>
            <v-flex xs2>
              <v-btn flat icon slot="activator" v-on:click.native="addSection(s)">
                <icon v-if="s.multiplicable" name="material-content-add" width="24px" height="24px"></icon>
              </v-btn>
              <v-btn flat icon slot="activator" v-on:click.native="removeSection(s)">
                <icon v-if="s.multiplicable" name="material-content-remove" width="24px" height="24px"></icon>
              </v-btn>
            </v-flex>        
          </v-layout>

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
        </v-layout>

        <v-layout row wrap>
          <v-flex offset-xs10>
            <v-btn raised >Submit</v-btn>
          </v-flex>
        </v-layout>
      </v-tab-item>
      <v-tab-item class="ma-4">
        <vue-json-pretty :data="jsonld" ref="prettyprint"></vue-json-pretty>
      </v-tab-item>
    </v-tabs>

  </v-container>
 
</template>

<script>
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
        skos: 'http://www.w3.org/2004/02/skos/core#',
        role: 'https://phaidra.org/vocabulary/roles',
        foaf: 'http://xmlns.com/foaf/spec/#',
        edm: 'http://www.europeana.eu/schemas/edm/'
      },
      jsonld: {},
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
                inputtype: 'text-field',
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
            title: 'Provenience',
            id: 'provenience',
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
                label: 'Provenience',
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
                id: 15,
                predicate: 'dce:coverage',
                label: 'Ort',
                value: '',
                inputtype: 'gbv-suggest-getty',
                voc: 'tgn'
              },
              {
                id: 19,
                predicate: 'dcterms:subject',
                label: 'Dimensions',
                source: '',
                unit: '',
                length: '',
                height: '',
                width: '',
                circumference: '',
                inputtype: 'dimensions',
                multiplicable: true
              },
              {
                id: 20,
                label: 'Format',
                predicate: 'dcterms:language',
                value: '',
                inputtype: 'select',
                vocabulary: 'http://id.loc.gov/vocabulary/iso639-2'
              },
              {
                id: 21,
                label: 'Original/Copy',
                predicate: 'dcterms:language',
                value: '',
                inputtype: 'select',
                vocabulary: 'http://id.loc.gov/vocabulary/iso639-2'
              },
              {
                id: 22,
                label: 'Condition',
                predicate: 'dcterms:language',
                value: '',
                inputtype: 'select',
                vocabulary: 'http://id.loc.gov/vocabulary/iso639-2'
              },
              {
                id: 23,
                predicate: 'dcterms:description',
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
                predicate: 'dcterms:language',
                value: '',
                inputtype: 'select',
                vocabulary: 'http://id.loc.gov/vocabulary/iso639-2'
              }
            ]
          },
          {
            title: 'Technical Data',
            id: 'technical',
            fields: [
              {
                id: 25,
                label: 'Technical information',
                predicate: 'dcterms:language',
                value: '',
                inputtype: 'select',
                vocabulary: 'http://id.loc.gov/vocabulary/iso639-2'
              },
              {
                id: 26,
                predicate: 'dcterms:etnographicterm',
                label: 'Technical description',
                value: '',
                inputtype: 'text-field'
              },
              {
                id: 27,
                predicate: 'dcterms:etnographicterm',
                label: 'Material',
                value: '',
                inputtype: 'text-field'
              },
              {
                id: 28,
                predicate: 'dcterms:etnographicterm',
                label: 'Digitalisierungsinformation',
                value: '',
                inputtype: 'text-field'
              },
              {
                id: 29,
                label: 'Digitaliser',
                predicate: 'role',
                firstname: '',
                lastname: '',
                role: 'digitiser',
                date: '',
                disablerole: true,
                showdate: false,
                inputtype: 'entity',
                ordergroup: 'entity-digitaliser'
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
                vocabulary: 'http://id.loc.gov/vocabulary/iso639-2'
              },
              {
                id: 31,
                predicate: 'dcterms:description',
                label: 'Rechte/Schutz',
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
                predicate: 'dcterms:title',
                label: 'Title',
                value: '',
                inputtype: 'text-field',
                required: true,
                ordergroup: 'title',
                multiplicable: true,
                multilingual: true,
                language: ''
              },
              {
                id: 35,
                predicate: 'dcterms:title',
                label: 'Subtitle',
                value: '',
                inputtype: 'text-field',
                multiplicable: true,
                multilingual: true,
                language: ''
              },
              {
                id: 36,
                predicate: 'dcterms:description',
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
                predicate: 'dcterms:etnographicterm',
                label: 'Signature',
                value: '',
                inputtype: 'text-field',
                multiplicable: true
              },
              {
                id: 38,
                predicate: 'dcterms:etnographicterm',
                label: 'File name',
                value: '',
                inputtype: 'text-field',
                multiplicable: true
              },
              {
                id: 39,
                label: 'Format',
                predicate: 'dcterms:language',
                value: '',
                inputtype: 'select',
                vocabulary: 'http://id.loc.gov/vocabulary/iso639-2'
              }
            ]
          }
        ]
      }
    }
  },
  methods: {
    generateJson: function () {
      this.jsonld = {
        '@context': this.jsonldcontext
      }
      for (var i = 0; i < this.form.sections.length; i++) {
        var s = this.form.sections[i]
        for (var j = 0; j < s.fields.length; j++) {
          var f = s.fields[j]
          var def

          switch (f.predicate) {

            case 'dce:title':
              def = {
                '@type': 'bf:Title',
                'bf:mainTitle': {
                  '@value': f.title,
                  '@language': f.language
                }
              }
              if (f.subtitle !== '') {
                def['bf:subtitle'] = {
                  '@value': f.subtitle,
                  '@language': f.language
                }
              }
              if (!this.jsonld['dce.title']) {
                this.jsonld['dce.title'] = []
              }
              this.jsonld['dce.title'].push(def)
              break

            case 'bf:note':
              if (f.value !== '') {
                def = {
                  '@type': 'bf:Note',
                  'rdfs:label': f.value
                }
                if (f.language && (f.language !== '')) {
                  def['rdfs:label'] = {
                    '@value': f.value,
                    '@language': f.language
                  }
                }
                if (f.bfnotetype && (f.bfnotetype !== '')) {
                  def['bf:noteType'] = f.bfnotetype
                }
                if (!this.jsonld['bf:note']) {
                  this.jsonld['bf:note'] = []
                }
                this.jsonld['bf:note'].push(def)
              }
              break

            case 'dce:subject':
              if (f.value !== '') {
                if (!this.jsonld['dce:subject']) {
                  this.jsonld['dce:subject'] = []
                }
                this.jsonld['dce:subject'].push({
                  '@value': f.value,
                  '@language': f.language
                })
              }
              break

            case 'role':
              if (f.role && (f.role !== '')) {
                def = {
                  '@type': 'foaf:Person',
                  'foaf:firstName': f.firstname,
                  'foaf:surname': f.lastname
                }
                if (f.date && (f.date !== '')) {
                  def['dcterms:date'] = f.date
                }
                if (!this.jsonld['role:' + f.role]) {
                  this.jsonld['role:' + f.role] = []
                }
                this.jsonld['role:' + f.role].push(def)
              }
              break

            case 'dcterms:provenance':
              if (f.value !== '') {
                def = {
                  '@type': 'dcterms:ProvenanceStatement',
                  'rdfs:label': f.value
                }
                if (f.language && (f.language !== '')) {
                  def['rdfs:label'] = {
                    '@value': f.value,
                    '@language': f.language
                  }
                }
                if (!this.jsonld['dctems:provenance']) {
                  this.jsonld['dctems:provenance'] = []
                }
                this.jsonld['dctems:provenance'].push(def)
              }
              break

            default:
              if (f.predicate && (f.predicate !== '')) {
                if (f.value && (f.value !== '')) {
                  this.jsonld[f.predicate] = f.value
                }
              }
          }
        }
      }
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
      for (var i = 0; i < ns.fields.length; i++) {
        ns.fields[i].id = (new Date()).getTime()
        ns.fields[i].value = ''
        ns.fields[i].language = ''
      }
    },
    removeSection: function (s) {
      arrays.remove(this.form.sections, s)
    },
    submit: function () {
      var data = new FormData()

      for (var i = 0; i < this.form.sections.length; i++) {
        var s = this.form.sections[i]
        for (var j = 0; j < s.fields.length; j++) {
          var f = s.fields[j]
          if (f.type === 'file') {
            data.append(s.id + '_file', f.value)
          }
        }
      }

      data.append('metadata', this.form)

      fetch(self.$store.state.settings.instance.api + '/submit', {
        method: 'POST',
        body: data
      })
    }
  },
  beforeRouteEnter: function (to, from, next) {
    next(vm => {
      vm.$store.dispatch('loadLangStatic')
      vm.$store.dispatch('loadIso6392Static')
      vm.$store.dispatch('loadRolesStatic')
    })
  }
}
</script>

<style scoped>
.btn {
  margin: 0;
}
</style>
