<template>
  <v-container grid-list-lg class="form-background" fluid>
    <v-layout row wrap>
      <v-flex xs12 class="text-xs-right display-2 submit-header mb-1">KSA Submit - Photo</v-flex>
    </v-layout>
 
      <v-layout v-for="(s) in this.form.sections" :key="s.id" column wrap>

        <v-layout row wrap>
          <v-flex xs12>
            <h3 class="display-2 submit-header pa-4 mt-4 border-top">{{ $t(s.title) }}</h3>
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

        </v-layout>
      </v-layout>
   
  </v-container>
 
</template>

<script>
import arrays from '@/utils/arrays'
import PTextField from '@/components/input-fields/PTextField'
import PTextFieldSuggest from '@/components/input-fields/PTextFieldSuggest'
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
    PEntity,
    PSelect,
    PLatLong,
    PDimensions
  },
  data () {
    return {
      form: {
        sections: [
          {
            title: 'General',
            id: 'general',
            fields: [
              {
                id: 1,
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
                id: 2,
                predicate: 'dcterms:title',
                label: 'Subtitle',
                value: '',
                inputtype: 'text-field',
                multiplicable: true,
                multilingual: true,
                language: ''
              },
              {
                id: 3,
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
                id: 4,
                predicate: 'dcterms:etnographicterm',
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
                predicate: 'rolle',
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
                predicate: 'anmerkung',
                label: 'Note',
                value: '',
                inputtype: 'text-field',
                multiline: true,
                multilingual: true
              },
              {
                id: 8,
                predicate: 'dcterms:subject',
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
                predicate: 'dcterms:etnographicterm',
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
                showrole: false,
                showdate: false,
                inputtype: 'entity',
                ordergroup: 'entity-urheberin'
              },
              {
                id: 11,
                predicate: 'dcterms:title',
                label: 'Zeitpunkt, Zeitraum',
                value: '',
                inputtype: 'text-field'
              },
              {
                id: 12,
                predicate: 'dcterms:description',
                label: 'Provenience',
                value: '',
                inputtype: 'text-field',
                multiline: true,
                multilingual: true,
                language: ''
              },
              {
                id: 13,
                predicate: 'dcterms:etnographicterm',
                label: 'Standort',
                value: '',
                inputtype: 'text-field'
              },
              {
                id: 14,
                predicate: 'dcterms:etnographicterm',
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
                showrole: false,
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
                predicate: 'dcterms:language',
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
          }
        ]
      }
    }
  },
  methods: {
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
/*
.form-background {
  background-color: #f3f3f3;
}
*/
</style>
