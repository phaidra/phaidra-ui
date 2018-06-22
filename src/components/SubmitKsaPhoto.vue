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

            <v-flex offset-xs1 xs4 v-else-if="f.inputtype == 'select-suggest'" >
              <p-select-suggest
                v-bind.sync="f" 
                v-on:input="f.value=$event"
                v-on:add="addField(s.fields, f)"
                v-on:remove="removeField(s.fields, f)"
              ></p-select-suggest>        
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

            <v-flex offset-xs1 v-else-if="f.inputtype == 'lat-long'" >
              <p-lat-long 
                v-bind.sync="f" 
                v-on:input="f.value=$event"
                v-on:add="addField(s.fields, f)"
                v-on:remove="removeField(s.fields, f)"
              ></p-lat-long>        
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
        <vue-json-pretty :data="jsonld"></vue-json-pretty>
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
import PSelectSuggest from '@/components/input-fields/PSelectSuggest'
import PEntity from '@/components/input-fields/PEntity'
import PSelect from '@/components/input-fields/PSelect'
import PLatLong from '@/components/input-fields/PLatLong'
import PDimensions from '@/components/input-fields/PDimensions'

export default {
  name: 'submit-ksa-photo',
  components: {
    PTextField,
    PTextFieldSuggest,
    PSelectSuggest,
    PTitle,
    PEntity,
    PSelect,
    PLatLong,
    PDimensions,
    VueJsonPretty
  },
  data () {
    return {
      activetab: null,
      jsonld: {
        '@context': {
          bf: 'http://id.loc.gov/ontologies/bibframe/',
          dce: 'http://purl.org/dc/elements/1.1/',
          rdfs: 'https://www.w3.org/TR/rdf-schema/',
          dcterms: 'http://purl.org/dc/terms/',
          skos: 'http://www.w3.org/2004/02/skos/core#',
          relators: 'http://id.loc.gov/vocabulary/relators',
          foaf: 'http://xmlns.com/foaf/spec/#',
          edm: 'http://www.europeana.eu/schemas/edm/'
        }
      },
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
                predicate: 'opaque:ethnographic',
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
                predicate: 'relators',
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
                predicate: 'rolle',
                firstname: '',
                lastname: '',
                role: 'urheberin',
                date: '',
                disablerole: true,
                showdate: false,
                inputtype: 'entity',
                ordergroup: 'entity-urheberin'
              },
              {
                id: 11,
                predicate: 'dce:subject',
                label: 'Zeitpunkt, Zeitraum',
                value: '',
                inputtype: 'text-field'
              },
              {
                id: 12,
                predicate: 'bf:note',
                label: 'Provenience',
                value: '',
                inputtype: 'text-field',
                multiline: true,
                multilingual: true,
                language: ''
              },
              {
                id: 13,
                predicate: 'dce:coverage',
                label: 'Standort',
                value: '',
                inputtype: 'text-field'
              },
              {
                id: 14,
                predicate: 'bf:note',
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
                predicate: 'dcterms:etnographicterm',
                label: 'Koordinaten',
                value: '',
                inputtype: 'lat-long'
              },
              {
                id: 16,
                predicate: 'dcterms:etnographicterm',
                label: 'Ort, Region',
                value: '',
                inputtype: 'text-field'
              },
              {
                id: 17,
                predicate: 'dcterms:subject',
                label: 'State',
                value: '',
                language: '',
                inputtype: 'select-suggest',
                suggester: 'titlesuggester'
              },
              {
                id: 18,
                predicate: 'dcterms:subject',
                label: 'Region',
                value: '',
                language: '',
                inputtype: 'select-suggest',
                suggester: 'titlesuggester'
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
                predicate: 'rolle',
                firstname: '',
                lastname: '',
                role: 'digitaliser',
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
      for (var i = 0; i < this.form.sections.length; i++) {
        var s = this.form.sections[i]
        for (var j = 0; j < s.fields.length; j++) {
          var f = s.fields[j]
          var def
          if (f.predicate === 'dce:title') {
            def = {
              '@type': 'bf:Title',
              'rdfs:label': f.title,
              '@language': f.language
            }
            if (f.subtitle !== '') {
              def['rdfs:label'] = f.title + ' : ' + f.subtitle
              def['bf:mainTitle'] = f.title
              def['bf:subtitle'] = f.subtitle
            }
            if (!this.jsonld['dce.title']) {
              this.jsonld['dce.title'] = []
            }
            this.jsonld['dce.title'].push(def)
          }
          if (f.predicate === 'bf:note') {
            def = {
              '@type': 'bf:Note',
              'rdfs:label': f.value
            }
            if (f.language && (f.language !== '')) {
              def['@language'] = f.language
            }
            if (f.bfnotetype && (f.bfnotetype !== '')) {
              def['bf:noteType'] = f.bfnotetype
            }
            if (!this.jsonld['bf:note']) {
              this.jsonld['bf:note'] = []
            }
            this.jsonld['bf:note'].push(def)
          }
          if (f.predicate === 'relators') {
            def = {
              '@type': 'foaf:Person',
              'foaf:firstName': f.firstname,
              'foaf:surname': f.lastname
            }
            if (f.date && (f.date !== '')) {
              def['dcterms:date'] = f.date
            }
            if (!this.jsonld['relators:' + f.role]) {
              this.jsonld['relators:' + f.role] = []
            }
            this.jsonld['relators:' + f.role].push(def)
          }
          if (f.predicate === 'edm:rights') {
            this.jsonld['edm:rights'] = f.value
          }
          if (f.predicate === 'dcterms:type') {
            this.jsonld['dcterms:type'] = f.value
          }
        }
      }
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
      vm.$store.dispatch('loadLanguagesStatic').then(() => {
        next()
      })
    })
  }
}
</script>

<style scoped>
.btn {
  margin: 0;
}
</style>
