<template>
  <v-stepper v-if="form.sections.length > 0" v-model="step">
    <v-stepper-header>
      <v-stepper-step :complete="step > 1" step="1">{{ $t('Start') }}</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step :complete="touCheckbox" step="2">{{ $t('Terms of use') }}</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step :complete="step > 3" step="3">{{ $t('Import') }}</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step :complete="step > 4" step="4">{{ $t('Mandatory fields') }}</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step :complete="step > 5" step="5">{{ $t('Optional fields') }}</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step :complete="step > 6" step="6">{{ $t('Submit') }}</v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>

      <v-stepper-content step="1">
        <v-container>
          <v-row no-gutters>
            <h3 class="title font-weight-light primary--text mb-4">{{ $t('Submitting a publication') }}</h3>
          </v-row>
          <v-row no-gutters>
            <i18n path="SUBMIT_START_1" tag="p">
              <a :href="'/info/policy'" target="_blank">{{ $t('guidelines') }}</a>
            </i18n>
          </v-row>
          <v-row no-gutters justify="center">
            <v-col>
              <v-alert outlined  type="error" color="primary" >
                <h3 class="title font-weight-light mb-4 ml-4">{{ $t('Important notice') }}</h3>
                <ul class="black--text ml-4">
                  <li>
                    <i18n path="SUBMIT_START_2" tag="p">
                      <strong>{{ $t('if you hold the necessary rights') }}</strong>
                    </i18n>
                  </li>
                  <li>
                    <i18n path="SUBMIT_START_3" tag="p">
                      <strong>{{ $t('a larger number of publications') }}</strong>
                      <a :href="'/info/contact'" target="_blank">{{ $t('contact us') }}</a>
                    </i18n>
                  </li>
                </ul>
              </v-alert>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <p>{{ $t('SUBMIT_START_4') }}</p>
          </v-row>
          <v-row no-gutters>
            <i18n path="SUBMIT_START_5" tag="p">
              <a href="mailto:support.uscholar@univie.ac.at">support.uscholar@univie.ac.at</a>
            </i18n>
          </v-row>
          <v-row no-gutters>
            <i18n path="SUBMIT_START_6" tag="p">
              <a :href="'/info/about'" target="_blank">{{ $t('contact us') }}</a>
              <a href="mailto:support.uscholar@univie.ac.at">support.uscholar@univie.ac.at</a>
            </i18n>
          </v-row>
          <v-divider class="mt-5 mb-7"></v-divider>
          <v-row no-gutters justify="center">
            <v-btn color="primary" @click="step = 2">{{ $t('Start') }}</v-btn>
          </v-row>
        </v-container>
      </v-stepper-content>

      <v-stepper-content step="2">
        <v-container>
          <v-row no-gutters>
            <h3 class="title font-weight-light primary--text mb-4">{{ $t('Terms of use') }}</h3>
          </v-row>
          <v-row no-gutters>
            <p>{{ $t('SUBMIT_TOU_1') }}</p>
          </v-row>
          <v-row no-gutters>
            <p>{{ $t('SUBMIT_TOU_2') }}</p>
          </v-row>
          <v-row no-gutters>
            <p>{{ $t('SUBMIT_TOU_3') }}</p>
          </v-row>
          <v-row no-gutters>
            <v-checkbox v-model="touCheckbox" color="primary" :error-messages="touCheckboxErrors">
              <template v-slot:label>
                <i18n path="SUBMIT_TOU_4" tag="span" class="black--text">
                  <a @click.stop href="https://phaidra.univie.ac.at/terms_of_use/show_terms_of_use" target="_blank">Phaidra</a>
                </i18n>
              </template>
            </v-checkbox>
          </v-row>
          <v-row no-gutters>
            <a class="mt-4" href="https://uscholar.univie.ac.at/static/doc/InstitutionalRepository-TermsOfUse-German.pdf" target="_blank">{{ $t('Terms of use (PDF)') }}</a>
          </v-row>
          <v-divider class="mt-5 mb-7"></v-divider>
          <v-row no-gutters justify="space-between">
            <v-btn dark color="grey" @click="step = 1">{{ $t('Back') }}</v-btn>
            <v-btn color="primary" @click="checkTou()">{{ $t('Continue') }}</v-btn>
          </v-row>
        </v-container>
      </v-stepper-content>

      <v-stepper-content step="3">
        <v-container>
          <v-row no-gutters>
            <h3 class="title font-weight-light primary--text mb-4">{{ $t('Metadata-Import via DOI') }}</h3>
          </v-row>
          <v-row no-gutters>
            <p>{{ $t('Many electronically published journals assign persistent names, so called DOIs (Digital Object Identifiers), to their articles.') }}</p>
          </v-row>
          <v-row no-gutters>
            <p>{{ $t('If you enter your article\'s DOI here, its metadata can be loaded automatically.') }}</p>
          </v-row>
          <v-row no-gutters>
            <v-col cols="4">
              <v-text-field :error-messages="doiImportErrors" filled v-model="doiImportInput" label="DOI" :placeholder="$t('please enter')"/>
            </v-col>
            <v-col cols="1" class="ml-4 mt-2">
              <v-btn :loading="loading" :disabled="loading" color="primary" @click="importDOI()">{{ $t('Import') }}</v-btn>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <code>{{ doiImportData }}</code>
          </v-row>
          <v-row no-gutters>
            <p-d-jsonld v-if="importedMetadata" :jsonld="importedMetadata"></p-d-jsonld>
          </v-row>
          <v-row no-gutters>
            <h3 class="title font-weight-light primary--text mb-4">{{ $t('Metadata-Import from a template') }}</h3>
          </v-row>
          <v-row no-gutters>
            <p>{{ $t('Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.') }}</p>
          </v-row>
          <v-row no-gutters>
            <v-col cols="12">
              <p-templates ref="templates" v-on:load-template="loadTemplate($event)"></p-templates>
            </v-col>
          </v-row>
          <v-divider class="mt-5 mb-7"></v-divider>
          <v-row no-gutters justify="space-between">
            <v-btn dark color="grey" @click="step = 2">{{ $t('Back') }}</v-btn>
            <v-btn color="primary" @click="step = 4">{{ $t('Continue') }}</v-btn>
          </v-row>
        </v-container>
      </v-stepper-content>

      <v-stepper-content v-for="(s) in form.sections" :key="'tabitem'+s.id" :step="s.id">
        <v-container>
          <v-row justify="center">
            <v-col cols="10">
              <template v-for="(f, i) in s.fields">
                <v-row no-gutters :key="f.id">
                  <template v-if="f.component === 'p-text-field'">
                    <p-i-text-field
                      v-bind.sync="f"
                      v-on:input="f.value=$event"
                      v-on:input-language="setSelected(f, 'language', $event)"
                      v-on:add="addField(s.fields, f)"
                      v-on:remove="removeField(s.fields, f)"
                    ></p-i-text-field>
                  </template>

                  <template v-else-if="f.component === 'p-keyword'">
                    <p-i-keyword
                      v-bind.sync="f"
                      v-on:input="f.value=$event"
                      v-on:input-language="setSelected(f, 'language', $event)"
                      v-on:add="addField(s.fields, f)"
                      v-on:remove="removeField(s.fields, f)"
                    ></p-i-keyword>
                  </template>

                  <template v-if="f.component === 'p-title'">
                    <p-i-title
                      v-bind.sync="f"
                      v-on:input-title="f.title=$event"
                      v-on:input-subtitle="f.subtitle=$event"
                      v-on:input-language="setSelected(f, 'language', $event)"
                      v-on:add="addField(s.fields, f)"
                      v-on:remove="removeField(s.fields, f)"
                      v-on:up="sortFieldUp(s.fields, f)"
                      v-on:down="sortFieldDown(s.fields, f)"
                    ></p-i-title>
                  </template>

                  <template v-else-if="f.component === 'p-select'">
                    <p-i-select
                      v-show="f.predicate !== 'dcterms:type'"
                      v-bind.sync="f"
                      v-on:input="selectInput(f, $event)"
                      v-on:add="addField(s.fields, f)"
                      v-on:remove="removeField(s.fields, f)"
                    ></p-i-select>
                  </template>

                  <template v-else-if="f.component === 'p-date-edtf'">
                    <p-i-date-edtf
                      v-bind.sync="f"
                      v-on:input-date="f.value=$event"
                      v-on:input-date-type="setSelected(f, 'type', $event)"
                      v-on:add="addField(s.fields, f)"
                      v-on:remove="removeField(s.fields, f)"
                    ></p-i-date-edtf>
                  </template>

                  <template v-else-if="f.component === 'p-series'">
                    <p-i-series
                      v-bind.sync="f"
                      v-on:input-title="f.title=$event"
                      v-on:input-title-language="setSelected(f, 'titleLanguage', $event)"
                      v-on:input-volume="f.volume=$event"
                      v-on:input-issue="f.issue=$event"
                      v-on:input-issued="f.issued=$event"
                      v-on:input-issn="f.issn=$event"
                      v-on:input-identifier="f.identifier=$event"
                      v-on:add="addField(s.fields, f)"
                      v-on:remove="removeField(s.fields, f)"
                    ></p-i-series>
                  </template>

                  <template v-else-if="f.component === 'p-citation'">
                    <p-i-citation
                      v-bind.sync="f"
                      v-on:input-citation-type="setSelected(f, 'type', $event)"
                      v-on:input-citation="f.citation=$event"
                      v-on:input-citation-language="setSelected(f, 'citationLanguage', $event)"
                      v-on:input-identifier="f.identifier=$event"
                      v-on:add="addField(s.fields, f)"
                      v-on:remove="removeField(s.fields, f)"
                    ></p-i-citation>
                  </template>

                  <template v-else-if="f.component === 'p-bf-publication'">
                    <p-i-bf-publication
                      v-bind.sync="f"
                      v-on:input-publisher-name="f.publisherName=$event"
                      v-on:input-publishing-place="f.publishingPlace=$event"
                      v-on:input-publishing-date="f.publishingDate=$event"
                      v-on:add="addField(s.fields, f)"
                      v-on:remove="removeField(s.fields, f)"
                    ></p-i-bf-publication>
                  </template>

                  <template v-else-if="f.component === 'p-entity-extended'">
                    <p-i-entity-extended
                      v-bind.sync="f"
                      v-on:change-type="changeEntityType(f, $event)"
                      v-on:input-firstname="f.firstname = $event"
                      v-on:input-lastname="f.lastname = $event"
                      v-on:input-name="f.name = $event"
                      v-on:input-identifier="f.identifierText = $event"
                      v-on:change-affiliation-type="changeEntityAffiliationType(f, $event)"
                      v-on:input-affiliation-select="affiliationSelectInput(f, $event)"
                      v-on:input-affiliation-other="f.affiliationText = $event"
                      v-on:change-organization-type="changeEntityOrganizationType(f, $event)"
                      v-on:input-organization-select="organizationSelectInput(f, $event)"
                      v-on:input-organization-other="f.organizationText = $event"
                      v-on:input-role="roleInput(f, $event)"
                      v-on:add="addField(s.fields, f)"
                      v-on:remove="removeField(s.fields, f)"
                      v-on:up="sortFieldUp(s.fields, f)"
                      v-on:down="sortFieldDown(s.fields, f)"
                    ></p-i-entity-extended>
                  </template>

                  <template v-else-if="f.component === 'p-subject-gnd'">
                    <p-i-subject-gnd
                      v-bind.sync="f"
                      v-on:input="f.value=$event"
                      v-on:resolve="updateSubject(f, $event)"
                      v-on:add="addField(s.fields, f)"
                      v-on:remove="removeField(s.fields, f)"
                    ></p-i-subject-gnd>
                  </template>

                  <template v-else-if="f.component === 'p-literal'">
                    <p-i-literal
                      v-bind.sync="f"
                      v-on:input-value="f.value=$event"
                      v-on:add="addField(s.fields, f)"
                      v-on:remove="removeField(s.fields, f)"
                    ></p-i-literal>
                  </template>

                  <template v-else-if="f.component === 'p-project'">
                    <p-i-project
                      v-bind.sync="f"
                      v-on:input-name="f.name=$event"
                      v-on:input-name-language="setSelected(f, 'nameLanguage', $event)"
                      v-on:input-description="f.description=$event"
                      v-on:input-description-language="setSelected(f, 'descriptionLanguage', $event)"
                      v-on:input-identifier="f.identifier=$event"
                      v-on:input-homepage="f.homepage=$event"
                      v-on:add="addField(s.fields, f)"
                      v-on:remove="removeField(s.fields, f)"
                    ></p-i-project>
                  </template>

                  <template v-else-if="f.component === 'p-funder'">
                    <p-i-funder
                      v-bind.sync="f"
                      v-on:input-name="f.name=$event"
                      v-on:input-name-language="setSelected(f, 'nameLanguage', $event)"
                      v-on:input-identifier="f.identifier=$event"
                      v-on:add="addField(s.fields, f)"
                      v-on:remove="removeField(s.fields, f)"
                    ></p-i-funder>
                  </template>

                  <template v-else-if="f.component === 'p-file'">
                    <v-col cols="12">
                      <v-row no-gutters>
                        <p-i-file
                          v-bind.sync="f"
                          v-on:input-file="setFilename(f, $event)"
                          v-on:input-mimetype="setSelected(f, 'mimetype', $event)"
                          v-on:add="addField(s.fields, f)"
                          v-on:remove="removeField(s.fields, f)"
                        ></p-i-file>
                      </v-row>
                      <v-row no-gutters v-if="s.fields[i+1].component !== 'p-file'">
                        <v-btn @click="addField(s.fields, f)" color="grey" dark class="ml-8 mb-8"><v-icon left dark>mdi-plus-box</v-icon>Add another format</v-btn>
                      </v-row>
                    </v-col>
                  </template>

                </v-row>

              </template>
              <v-divider class="mt-5 mb-7"></v-divider>
              <v-row no-gutters justify="space-between">
                <v-btn dark color="grey" @click="step = (s.id - 1)">{{ $t('Back') }}</v-btn>
                <v-btn color="primary" @click="step = (s.id + 1)">{{ $t('Continue') }}</v-btn>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-stepper-content>

      <v-stepper-content step="6">
        <v-container>
          <p-d-jsonld :jsonld="jsonld"></p-d-jsonld>
          <v-divider class="mt-5 mb-7"></v-divider>
          <v-row no-gutters>
            <v-btn dark color="grey" @click="step = 5">{{ $t('Back') }}</v-btn>
            <v-spacer></v-spacer>
            <v-dialog v-model="templateDialog" width="500">
              <template v-slot:activator="{ on }">
                <v-btn class="mr-3" v-on="on" dark raised :loading="loading" :disabled="loading" color="grey">{{ $t('Save as template') }}</v-btn>
              </template>
              <v-card>
                <v-card-title class="title font-weight-light grey lighten-2" primary-title>{{ $t('Save as template') }}</v-card-title>
                <v-card-text>
                  <v-text-field class="mt-4" hide-details filled single-line v-model="templateName" :label="$t('Template name')" ></v-text-field>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn :loading="loading" :disabled="loading" color="grey" dark @click="templateDialog= false">{{ $t('Cancel') }}</v-btn>
                  <v-btn :loading="loading" :disabled="loading" color="primary" @click="saveAsTemplate()">{{ $t('Save') }}</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-btn raised color="primary" :loading="loading" :disabled="loading" @click="submit()">{{ $t('Submit') }}</v-btn>
          </v-row>
        </v-container>
      </v-stepper-content>

    </v-stepper-items>

  </v-stepper>

</template>

<script>
import arrays from 'phaidra-vue-components/src/utils/arrays'
import jsonLd from 'phaidra-vue-components/src/utils/json-ld'
import fields from 'phaidra-vue-components/src/utils/fields'
import { context } from '@/mixins/context'
import { config } from '@/mixins/config'

export default {
  name: 'submit-ir',
  mixins: [ context, config ],
  computed: {
    importedMetadata: function () {
      if (this.doiImportData) {
        return this.doiImportData
      } else {
        return null
      }
    },
    doiToImport: function () {
      if (this.doiImportInput) {
        return this.doiImportInput
      } else {
        return null
      }
    },
    jsonld: function () {
      return this.getJsonld()
    }
  },
  data () {
    return {
      form: {
        sections: []
      },
      step: 4,
      loadedMetadata: [],
      loading: false,
      templateDialog: '',
      templateName: '',
      touCheckbox: false,
      touCheckboxErrors: [],
      doiImportInput: null,
      doiImportData: null,
      doiImportErrors: []
    }
  },
  methods: {
    importDOI: async function () {
      this.loading = true
      this.doiImportErrors = []
      if (this.doiImportInput) {
        try {
          let response = await fetch('https://' + this.appconfig.apis.doi.baseurl + '/' + this.doiToImport, {
            method: 'GET',
            mode: 'cors',
            headers: {
              'Accept': this.appconfig.apis.doi.accept
            }
          })
          this.doiImportData = await response.json()
        } catch (error) {
          this.doiImportErrors.push(error)
        } finally {
          this.loading = false
        }
      }
    },
    checkTou: function () {
      if (this.touCheckbox) {
        this.step = 3
      } else {
        this.touCheckboxErrors.push(this.$t('You have to accept the terms of use.'))
      }
    },
    getMetadata: function () {
      return { metadata: { 'json-ld': this.getJsonld() } }
    },
    getJsonld: function () {
      return jsonLd.form2json(this.form)
    },
    loadTemplates: function () {
      if (this.$refs.templates) {
        this.$refs.templates.loadTemplates()
      }
    },
    loadTemplate: function (form) {
      this.$emit('load-form', form)
      this.activetab = 0
    },
    saveAsTemplate: function () {
      var self = this
      var httpFormData = new FormData()
      this.loading = true
      httpFormData.append('name', this.templatename)
      httpFormData.append('form', JSON.stringify(this.form))
      var url = self.$store.state.instanceconfig.api + '/jsonld/template/add'
      var promise = fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'X-XSRF-TOKEN': this.$store.state.user.token
        },
        body: httpFormData
      })
        .then(function (response) { return response.json() })
        .then(function (json) {
          if (json.alerts && json.alerts.length > 0) {
            self.$store.commit('setAlerts', json.alerts)
          }
          self.loading = false
          self.templatedialog = false
        })
        .catch(function (error) {
          console.log(error)
        })
      return promise
    },
    submit: function () {
      var self = this
      this.loading = true
      var httpFormData = new FormData()
      for (let i = 0; i < this.form.sections.length; i++) {
        let s = this.form.sections[i]
        if (s.fields) {
          for (let j = 0; j < s.fields.length; j++) {
            if (s.fields[j].component === 'input-file') {
              if (s.fields[j].file !== '') {
                httpFormData.append('file', s.fields[j].file)
              }
            }
          }
        }
      }

      httpFormData.append('metadata', JSON.stringify(self.getMetadata()))

      fetch(self.$store.state.instanceconfig.api + '/document/create', {
        method: 'POST',
        mode: 'cors',
        headers: {
          // 'Authorization': 'Basic ' + base64.encode(self.$store.state.instanceconfig.adminuser + ':' + self.$store.state.instanceconfig.adminpass),
          'X-XSRF-TOKEN': this.$store.state.user.token
        },
        body: httpFormData
      })
        .then(response => response.json())
        .then(function (json) {
          if (json.alerts && json.alerts.length > 0) {
            self.$store.commit('setAlerts', json.alerts)
          }
          self.loading = false
          if (json.status === 200) {
            if (json.pid) {
              self.$emit('object-created', json.pid)
            }
          }
          self.$vuetify.goTo(0)
        })
        .catch(function (error) {
          self.$store.commit('setAlerts', [{ type: 'danger', msg: error }])
          self.loading = false
          self.$vuetify.goTo(0)
        })
    },
    addField: function (arr, f) {
      var newField = arrays.duplicate(arr, f)
      if (newField) {
        newField.id = (new Date()).getTime()
        newField.removable = true
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
    sortMemberUp: function (s) {
      var i = this.form.sections.indexOf(s)
      if (this.form.sections[i - 1]) {
        if (this.form.sections[i - 1].type === 'member') {
          arrays.moveUp(this.form.sections, s)
        }
      }
    },
    sortMemberDown: function (s) {
      var i = this.form.sections.indexOf(s)
      if (this.form.sections[i + 1]) {
        if (this.form.sections[i + 1].type === 'member') {
          arrays.moveDown(this.form.sections, s)
        }
      }
    },
    changeEntityType: function (f, event) {
      f.type = event
    },
    changeEntityAffiliationType: function (f, event) {
      f.affiliationType = event
    },
    changeEntityOrganizationType: function (f, event) {
      f.organizationType = event
    },
    affiliationSelectInput: function (f, event) {
      if (event) {
        f.affiliation = event['@id']
        f.affiliationSelectedName = []
        var preflabels = event['skos:prefLabel']
        Object.entries(preflabels).forEach(([key, value]) => {
          f.affiliationSelectedName.push({ '@value': value, '@language': key })
        })
      }
    },
    organizationSelectInput: function (f, event) {
      if (event) {
        f.organization = event['@id']
        f.organizationSelectedName = []
        var preflabels = event['skos:prefLabel']
        Object.entries(preflabels).forEach(([key, value]) => {
          f.organizationSelectedName.push({ '@value': value, '@language': key })
        })
      }
    },
    setSelected: function (f, property, event) {
      if (event) {
        f[property] = event['@id']
      }
      this.$emit('form-input-' + f.component, f)
    },
    updateSubject: function (f, event) {
      f['skos:prefLabel'] = event['skos:prefLabel']
      if (f['skos:prefLabel']) {
        if (f['skos:prefLabel'].length > 0) {
          // needed to init the search input if loading from template
          // will be synced with component's initquery prop
          f.initquery = f['skos:prefLabel'][0]['@value']
        }
      }
      f['rdfs:label'] = event['rdfs:label']
      this.$emit('form-input-' + f.component, f)
    },
    selectInput: function (f, event) {
      if (event) {
        f.value = event['@id']
        if (event['@type']) {
          f.type = event['@type']
        }
        var preflabels = event['skos:prefLabel']
        f['skos:prefLabel'] = []
        Object.entries(preflabels).forEach(([key, value]) => {
          f['skos:prefLabel'].push({ '@value': value, '@language': key })
        })
        var rdfslabels = event['rdfs:label']
        if (rdfslabels) {
          f['rdfs:label'] = []
          Object.entries(rdfslabels).forEach(([key, value]) => {
            f['rdfs:label'].push({ '@value': value, '@language': key })
          })
        }
        f['skos:notation'] = event['skos:notation']
      } else {
        f.value = ''
        f['skos:prefLabel'] = []
      }
      this.$emit('form-input-' + f.component, f)
    },
    roleInput: function (f, event) {
      f.role = event['@id']
      this.$emit('form-input-' + f.component, f)
    },
    setFilename: function (f, event) {
      f.value = event.name
      f.file = event
      this.$emit('form-input-' + f.component, f)
    }
  },
  mounted: function () {
    this.$store.dispatch('loadLanguages')

    let smf = []

    let rt = fields.getField('resource-type')
    rt.value = 'https://pid.phaidra.org/vocabulary/69ZZ-2KGX'
    smf.push(rt)

    let f = fields.getField('file')
    f.multiplicable = true
    f.mimetype = 'application/pdf'
    smf.push(f)

    smf.push(fields.getField('title'))

    let role = fields.getField('role-extended')
    role.role = 'role:aut'
    role.ordergroup = 'roles'
    smf.push(role)

    let edtf = fields.getField('date-edtf')
    edtf.picker = true
    edtf.type = 'dcterms:issued'
    // edtf.hideType = true
    // edtf.dateLabel = this.$t('Date issued')
    smf.push(edtf)

    smf.push(fields.getField('language'))

    this.form.sections.push(
      {
        title: this.$t('Mandatory fields'),
        type: 'digitalobject',
        id: 4,
        fields: smf
      }
    )

    let sof = []

    sof.push(fields.getField('description'))

    sof.push(fields.getField('project'))

    sof.push(fields.getField('funder'))

    this.form.sections.push(
      {
        title: this.$t('Optional fields'),
        type: 'digitalobject',
        id: 5,
        fields: sof
      }
    )
  }
}
</script>

<style scoped>
.v-btn {
  margin: 0;
}

.prewrap {
  white-space: pre-wrap;
}
</style>
