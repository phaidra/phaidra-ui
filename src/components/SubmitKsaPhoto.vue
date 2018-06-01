<template>
  <v-container grid-list-lg class="form-background" fluid>
    <v-layout row wrap>
      <v-flex xs12 class="text-xs-right display-2 submit-header mb-1">KSA Submit - Photo</v-flex>
    </v-layout>
    <v-layout column>
      <v-layout row wrap>
        <v-flex xs12>
          <h3 class="display-2 submit-header pa-3 border-top">General</h3>
        </v-flex>
      </v-layout>
      <v-layout v-for="(f) in this.form.fields" :key="f.id" row wrap>

        <v-flex offset-xs1 v-if="f.inputtype == 'text-field'" >
          <p-text-field             
            v-bind.sync="f"
            v-on:input="f.value=$event"
            v-on:input-language="f.language=$event"
            v-on:add="addField(f)"
            v-on:remove="removeField(f)"
          ></p-text-field>
        </v-flex>

        <v-flex offset-xs1 xs4 v-else-if="f.inputtype == 'select'" >
          <p-select 
            v-bind.sync="f" 
            v-on:input="f.value=$event"
            v-on:add="addField(f)"
            v-on:remove="removeField(f)"
          ></p-select>        
        </v-flex>

        <v-flex offset-xs1 v-else-if="f.inputtype == 'text-field-chips'" >
          <v-select
            v-bind.sync="f" 
            chips 
            tags 
            clearable 
          ></v-select>
        </v-flex>

        <v-flex offset-xs1 v-else-if="f.inputtype == 'entity'" >
          <p-entity
            v-bind.sync="f"
            v-on:input-firstname="f.firstname=$event"
            v-on:input-lastname="f.lastname=$event"
            v-on:input-role="f.role=$event"
            v-on:input-date="f.date=$event"
            v-on:add="addField(f)"
            v-on:remove="removeField(f)"
            v-on:up="sortFieldUp(f)"
            v-on:down="sortFieldDown(f)"
          ></p-entity>
        </v-flex>
      </v-layout>
    </v-layout>
  </v-container>
 
</template>

<script>
import arrays from '@/utils/arrays'
import PTextField from '@/components/input-fields/PTextField'
import PEntity from '@/components/input-fields/PEntity'
import PSelect from '@/components/input-fields/PSelect'

export default {
  /*
attributes: [
              {
                id: 'field1_lang',
                predicate: '@',
                label: 'Language',
                inputtype: 'select',
                required: true,
                rules: [ select => select.length > 0 || 'Required' ],
                value: '',
                vocabulary: 'http://id.loc.gov/vocabulary/iso639-2'
              }
            ]
  */
  name: 'submit-ksa-photo',
  components: {
    PTextField,
    PEntity,
    PSelect
  },
  data () {
    return {
      form: {
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
            multiplicable: true
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
            multiline: true
          },
          {
            id: 8,
            predicate: 'dcterms:subject',
            label: 'Keywords',
            value: '',
            inputtype: 'text-field-chips'
          },
          {
            id: 9,
            predicate: 'dcterms:etnographicterm',
            label: 'Signature',
            value: '',
            inputtype: 'text-field'
          }
        ]
      }
    }
  },
  methods: {
    addField: function (f) {
      var newField = arrays.duplicate(this.form.fields, f)
      if (newField) {
        newField.id = (new Date()).getTime()
        newField.value = ''
        newField.language = ''
      }
    },
    removeField: function (f) {
      arrays.remove(this.form.fields, f)
    },
    sortFieldUp: function (f) {
      var i = this.form.fields.indexOf(f)
      if (this.form.fields[i - 1]) {
        if (this.form.fields[i - 1].ordergroup === f.ordergroup) {
          arrays.moveUp(this.form.fields, f)
        }
      }
    },
    sortFieldDown: function (f) {
      var i = this.form.fields.indexOf(f)
      if (this.form.fields[i + 1]) {
        if (this.form.fields[i + 1].ordergroup === f.ordergroup) {
          arrays.moveDown(this.form.fields, f)
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
