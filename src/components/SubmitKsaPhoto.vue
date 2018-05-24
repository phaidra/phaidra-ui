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

        <v-flex xs6 offset-xs1 >
          <p-text-field v-if="f.inputtype == 'text-field'" v-model="f.value" :label="f.label" :required="f.required" :rules="f.rules"></p-text-field>
                      
          <p-select v-else-if="f.inputtype == 'select'" v-model="f.value" :items="f.items" :label="f.label" :required="f.required" :rules="f.rules"></p-select>
        </v-flex>
        
        <v-flex xs2 v-for="(a) in f.attributes" :key="a.id">
          <p-select v-if="a.inputtype == 'select'" v-model="a.value" :label="a.label"></p-select>                      
        </v-flex>

      </v-layout>
    </v-layout>
  </v-container>
 
</template>

<script>
import PTextField from '@/components/input-fields/PTextField'
import PSelect from '@/components/input-fields/PSelect'

export default {
  name: 'submit-ksa-photo',
  components: {
    PTextField,
    PSelect
  },
  data () {
    return {
      form: {
        fields: [
          {
            id: 'field1',
            predicate: 'dcterms:title',
            label: 'Title',
            value: '',
            inputtype: 'text-field',
            required: true,
            rules: [ v => !!v || 'Required' ],
            attributes: [
              {
                id: 'field1_lang',
                predicate: '@',
                label: 'Language',
                inputtype: 'select',
                required: true,
                rules: [ select => select.length > 0 || 'Required' ],
                value: '',
                vocabulary: ''
              }
            ]
          },
          {
            id: 'field2',
            label: 'Language',
            predicate: 'dcterms:language',
            value: '',
            inputtype: 'select',
            vocabulary: 'languages'
          }
        ]
      }
    }
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
