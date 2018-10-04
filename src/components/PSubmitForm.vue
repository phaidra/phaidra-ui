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
                    v-on:input-language="f.language=$event['@id']"
                    v-on:add="addField(s.fields, f)"
                    v-on:remove="removeField(s.fields, f)"
                  ></p-text-field>
                </v-flex>

                <v-flex offset-xs1 v-else-if="f.component == 'p-text-field-suggest'" >
                  <p-text-field-suggest
                    v-bind.sync="f"
                    v-on:input="f.value=$event"
                    v-on:input-language="f.language=$event['@id']"
                    v-on:add="addField(s.fields, f)"
                    v-on:remove="removeField(s.fields, f)"
                  ></p-text-field-suggest>
                </v-flex>

                <v-flex offset-xs1 v-if="f.component == 'p-title'" >
                  <p-title            
                    v-bind.sync="f"
                    v-on:input-title="f.title=$event"
                    v-on:input-subtitle="f.subtitle=$event"
                    v-on:input-language="f.language=$event['@id']"
                    v-on:add="addField(s.fields, f)"
                    v-on:remove="removeField(s.fields, f)"
                    v-on:up="sortFieldUp(s.fields, f)"
                    v-on:down="sortFieldDown(s.fields, f)"
                  ></p-title>
                </v-flex>

                <v-flex offset-xs1 xs4 v-else-if="f.component == 'p-select'" >
                  <p-select 
                    v-bind.sync="f" 
                    v-on:input="selectInput(f, $event)"
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
                    v-on:input-identifier="f.identifier=$event"
                    v-on:input-role="roleInput(f, $event)"
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
                    v-on:input-unit="f.unitCode=$event['@id']"
                    v-on:add="addField(s.fields, f)"
                    v-on:remove="removeField(s.fields, f)"
                  ></p-dimension>        
                </v-flex>

                <v-flex offset-xs1 v-else-if="f.component == 'p-project'" >
                  <p-project
                    v-bind.sync="f" 
                    v-on:input-name="f.name=$event"
                    v-on:input-name-language="f.nameLanguage=$event['@id']"
                    v-on:input-description="f.description=$event"
                    v-on:input-description-language="f.descriptionLanguage=$event['@id']"
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
                    v-on:input-name-language="f.nameLanguage=$event['@id']"
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
import jsonLd from '@/utils/json-ld'
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
  name: 'p-submit-form',
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
      jsonlds: {},
      metadata: {},
      form: this.definition
    }
  },
  props: {
    definition: {
      type: Object,
      required: true
    }
  },
  methods: {
    submit: function () {
      var self = this
      this.generateJson()
      var httpFormData = new FormData()
      httpFormData.append('metadata', JSON.stringify(this.metadata))
      for (var i = 0; i < this.form.sections.length; i++) {
        var s = this.form.sections[i]
        if (s.type === 'member') {
          for (var j = 0; j < s.fields.length; j++) {
            if (s.fields[j].component === 'input-file') {
              if (s.fields[j].value !== '') {
                httpFormData.append('member_' + s.id, s.fields[j].value)
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
        body: httpFormData
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
      this.jsonlds = jsonLd.containerForm2json(this.form)
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
      f['skos:prefLabel'] = event['skos:prefLabel']
      f['rdfs:label'] = event['rdfs:label']
      f.coordinates = event.coordinates
    },
    selectInput: function (f, event) {
      f.value = event['@id']
      f['rdfs:label'] = event['rdfs:label']
    },
    roleInput: function (f, event) {
      f.role = event['@id']
      f['rdfs:label'] = event['rdfs:label']
    }
  },
  mounted: function () {
    this.$store.dispatch('loadRoles')
  }
}
</script>

<style scoped>
.v-btn {
  margin: 0;
}
</style>
