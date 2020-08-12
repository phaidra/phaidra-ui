<template>
  <v-col>
    <v-alert v-if="(relation === 'hassuccessor') && objectInfo && (objectInfo.relationships.ispartof.length > 0)" type="info">
      <div>{{ relatedpid + ' ' + $t('is part of collections:') }}</div>
      <div v-for="(col, i) in objectInfo.relationships.ispartof" :key="'cola'+i">{{ col.pid + ' (owner:' + col.owner + '): ' + col.dc_title[0] }}</div>
      <div>{{ $t('Should the collection membership in collections you own be transferred to new version?') }} <v-switch v-model="transferMembership" :label="transferMembership ? $t('Yes') : $t('No')"></v-switch></div>
    </v-alert>
    <v-card>
      <v-card-title class="title font-weight-light grey white--text">
        <span class="mr-1">{{ $t('Submit of') }}</span>
        <span v-if="relation === 'references'">{{ $t('an object referencing') }}</span>
        <span v-if="relation === 'isbacksideof'">{{ $t('the back side of') }}</span>
        <span v-if="relation === 'isthumbnailfor'">{{ $t('a thumbnail for') }}</span>
        <span v-if="relation === 'hassuccessor'">{{ $t('a new version of') }}</span>
        <span v-if="relation === 'isalternativeformatof'">{{ $t('an alternative format of') }}</span>
        <span v-if="relation === 'isalternativeversionof'">{{ $t('an alternative version of') }}</span>
        <span v-if="relation === 'hascollectionmember'">{{ $t('a new member of collection') }}</span>
        <span v-if="relation === 'hasmember'">{{ $t('new member of container') }}</span>
        <span class="ml-1">{{ relatedpid }}</span>
      </v-card-title>
      <v-card-text v-if="!transferringMembership">
        <v-alert :value="validationError" dismissible type="error" transition="slide-y-transition">
          <span>{{ $t('Please fill in the required fields') }}</span>
          <template v-if="fieldsMissing.length > 0">
            <br/>
            <span>{{ $t('Some required fields are missing') }}:</span>
            <ul>
              <li v-for="(f, i) in fieldsMissing" :key="'mfld'+i">{{ f }}</li>
            </ul>
          </template>
        </v-alert>
        <p-i-form
          :form="form"
          :rights="rights"
          :relationships="relationships"
          :foreignRelationships="foreignRelationships"
          :enablerights="true"
          :enablerelationships="false"
          :templating="true"
          :importing="false"
          :addbutton="true"
          :help="true"
          :debug="true"
          :feedback="true"
          :feedback-user="this.user"
          :feedback-context="'Related object submit'"
          :validate="validate"
          v-on:load-form="form = $event"
          v-on:object-created="objectCreated($event)"
          v-on:form-input-resource-type="handleInputResourceType($event)"
          v-on:input-rights="rights = $event"
          v-on:input-relationships="relationships = $event"
        ></p-i-form>
      </v-card-text>
      <v-card-text v-else>
        <v-row class="mx-4">
          <v-col cols="12">
            <v-row no-gutters>
              <v-progress-linear indeterminate color="primary"></v-progress-linear>
            </v-row>
            <v-row no-gutters class="primary--text mt-1">
              <span>{{ $t('Transferring relationships...') }}</span><span class="ml-2" v-if="transferMembershipAction">{{ transferMembershipAction }}</span>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script>
import fields from 'phaidra-vue-components/src/utils/fields'
import arrays from 'phaidra-vue-components/src/utils/arrays'
import jsonLd from 'phaidra-vue-components/src/utils/json-ld'
import { vocabulary } from 'phaidra-vue-components/src/mixins/vocabulary'
import { formvalidation } from '../mixins/formvalidation'
import { context } from '../mixins/context'
import { config } from '../mixins/config'

export default {
  name: 'submit-related',
  mixins: [ context, config, vocabulary, formvalidation ],
  computed: {
    relatedpid: function () {
      return this.$store.state.route.params.relatedpid
    },
    relation: function () {
      return this.$store.state.route.params.relation
    },
    objectInfo: function () {
      return this.$store.state.objectInfo
    }
  },
  data () {
    return {
      form: {
        sections: [
          {
            title: '',
            id: 1,
            type: 'digitalobject',
            fields: []
          }
        ]
      },
      rights: {},
      relationships: {},
      foreignRelationships: {},
      transferMembership: false,
      transferringMembership: false,
      transferMembershipAction: ''
    }
  },
  methods: {
    handleInputResourceType: function (rt) {
      switch (rt['@id']) {
        case 'https://pid.phaidra.org/vocabulary/GXS7-ENXJ':
          // collection => remove file, license and object type field and resourcelink section
          for (let s of this.form.sections) {
            if (s.type === 'resourcelink') {
              arrays.remove(this.form.sections, s)
              break
            }
          }
          for (let s of this.form.sections) {
            for (let f of s.fields) {
              if (f.component === 'p-file') {
                arrays.remove(s.fields, f)
                break
              }
            }
          }
          for (let s of this.form.sections) {
            for (let f of s.fields) {
              if (f.predicate === 'edm:hasType') {
                arrays.remove(s.fields, f)
                break
              }
            }
          }
          for (let s of this.form.sections) {
            for (let f of s.fields) {
              if (f.predicate === 'edm:rights') {
                arrays.remove(s.fields, f)
                break
              }
            }
          }
          break
        case 'https://pid.phaidra.org/vocabulary/T8GH-F4V8':
          // resource => remove license field and add resourcelink section and object type if missing
          for (let s of this.form.sections) {
            for (let f of s.fields) {
              if (f.component === 'p-file') {
                arrays.remove(s.fields, f)
                break
              }
            }
          }
          for (let s of this.form.sections) {
            for (let f of s.fields) {
              if (f.predicate === 'edm:rights') {
                arrays.remove(s.fields, f)
                break
              }
            }
          }
          this.form.sections.push(
            {
              title: 'Resource link',
              type: 'resourcelink',
              disablemenu: true,
              id: 2,
              fields: []
            }
          )
          let hasObjectType = false
          for (let s of this.form.sections) {
            for (let f of s.fields) {
              if (f.predicate === 'edm:hasType') {
                hasObjectType = true
                if (f.hasOwnProperty('selectedTerms')) {
                  f.selectedTerms = []
                } else {
                  f.value = null
                }
              }
            }
          }
          if (!hasObjectType) {
            let otf = fields.getField('object-type-checkboxes')
            let rt
            for (let s of this.form.sections) {
              for (let f of s.fields) {
                if (f.predicate === 'dcterms:type') {
                  rt = f.value
                }
              }
            }
            otf.resourceType = rt
            this.form.sections[0].fields.splice(1, 0, otf)
          }
          break
        default:
          // add file and object type field if missing and remove resourcelink section
          for (let s of this.form.sections) {
            if (s.type === 'resourcelink') {
              arrays.remove(this.form.sections, s)
              break
            }
          }
          let haslicense = false
          for (let s of this.form.sections) {
            for (let f of s.fields) {
              if (f.predicate === 'edm:rights') {
                haslicense = true
              }
            }
          }
          if (!haslicense) {
            this.form.sections[0].fields.push(fields.getField('license'))
          }
          let hasfile = false
          for (let s of this.form.sections) {
            for (let f of s.fields) {
              if (f.component === 'p-file') {
                hasfile = true
              }
            }
          }
          if (!hasfile) {
            this.form.sections[0].fields.push(fields.getField('file'))
          }
          let hasObjectType2 = false
          for (let s of this.form.sections) {
            for (let f of s.fields) {
              if (f.predicate === 'edm:hasType') {
                hasObjectType2 = true
                if (f.hasOwnProperty('selectedTerms')) {
                  f.selectedTerms = []
                } else {
                  f.value = null
                }
              }
            }
          }
          if (!hasObjectType2) {
            let otf2 = fields.getField('object-type-checkboxes')
            let rt2
            for (let s of this.form.sections) {
              for (let f of s.fields) {
                if (f.predicate === 'dcterms:type') {
                  rt2 = f.value
                }
              }
            }
            otf2.resourceType = rt2
            this.form.sections[0].fields.splice(1, 0, otf2)
          }
          break
      }
    },
    objectCreated: async function (event) {
      let newpid = event
      if ((this.relation === 'hassuccessor') && this.transferMembership) {
        this.transferringMembership = true
        let removeMembers = { 'metadata': { 'members': [ { 'pid': this.relatedpid } ] } }
        let addMembers = { 'metadata': { 'members': [ { 'pid': newpid } ] } }
        for (let col of this.objectInfo.relationships.ispartof) {
          if (col.owner === this.$store.state.user.username) {
            this.transferMembershipAction = this.$t('REMOVE_COLLECTION_MEMBER', { oldpid: this.relatedpid, collection: col.pid })
            try {
              let httpFormData = new FormData()
              httpFormData.append('metadata', JSON.stringify(removeMembers))
              let response = await this.$http.request({
                method: 'POST',
                url: this.instanceconfig.api + '/collection/' + col.pid + '/members/remove',
                headers: {
                  'Content-Type': 'multipart/form-data',
                  'X-XSRF-TOKEN': this.$store.state.user.token
                },
                data: httpFormData
              })
              if (response.status !== 200) {
                if (response.data.alerts && response.data.alerts.length > 0) {
                  this.$store.commit('setAlerts', response.data.alerts)
                }
              }
            } catch (error) {
              console.log(error)
              this.$store.commit('setAlerts', [{ type: 'danger', msg: error }])
            }
            this.transferMembershipAction = this.$t('ADD_COLLECTION_MEMBER', { newpid: newpid, collection: col.pid })
            try {
              let httpFormData = new FormData()
              httpFormData.append('metadata', JSON.stringify(addMembers))
              let response = await this.$http.request({
                method: 'POST',
                url: this.instanceconfig.api + '/collection/' + col.pid + '/members/add',
                headers: {
                  'Content-Type': 'multipart/form-data',
                  'X-XSRF-TOKEN': this.$store.state.user.token
                },
                data: httpFormData
              })
              if (response.status !== 200) {
                if (response.data.alerts && response.data.alerts.length > 0) {
                  this.$store.commit('setAlerts', response.data.alerts)
                }
              }
            } catch (error) {
              console.log(error)
              this.$store.commit('setAlerts', [{ type: 'danger', msg: error }])
            }
          }
        }
      }
      this.$router.push({ name: 'detail', params: { pid: newpid } })
      this.$vuetify.goTo(0)
    },
    importFromRelatedObject: async function (self) {
      self.loading = true
      try {
        let response = await self.$http.request({
          method: 'GET',
          url: self.$store.state.instanceconfig.api + '/object/' + self.relatedpid + '/metadata'
        })
        if (response.data.metadata.hasOwnProperty('JSON-LD')) {
          self.form = jsonLd.json2form(response.data.metadata['JSON-LD'])
          for (let s of self.form.sections) {
            let isFileSection = false
            for (let f of s.fields) {
              if (f.predicate === 'ebucore:filename') {
                isFileSection = true
                break
              }
            }
            if (isFileSection) {
              let newFields = []
              for (let f of s.fields) {
                if ((f.predicate !== 'ebucore:filename') && (f.predicate !== 'ebucore:hasMimeType')) {
                  newFields.push(f)
                }
              }
              s.fields = newFields
              newFields.push(fields.getField('file'))
            }
          }
          return true
        } else {
          if (response.data.alerts && response.data.alerts.length > 0) {
            self.$store.commit('setAlerts', response.data.alerts)
          }
          return false
        }
      } catch (error) {
        console.error(error)
      } finally {
        self.loading = false
      }
    },
    createForm: async function (self) {
      self.transferMembership = false
      self.transferringMembership = false
      self.transferMembershipAction = ''
      self.validationError = false
      self.fieldsMissing = []
      self.form = {
        sections: [
          {
            title: '',
            id: 1,
            type: 'digitalobject',
            fields: []
          }
        ]
      }
      self.rights = {}
      self.relationships = {}
      self.foreignRelationships = {}

      if ((self.relation === 'hassuccessor') || (self.relation === 'hascollectionmember') || (self.relation === 'hasmember')) {
        self.foreignRelationships[self.relation] = [ self.relatedpid ]
      } else {
        self.relationships[self.relation] = [ self.relatedpid ]
      }

      let imported = false
      if ((self.relation === 'hassuccessor') || (self.relation === 'isalternativeformatof') || (self.relation === 'isalternativeversionof')) {
        imported = await self.importFromRelatedObject(self)
      }
      if (!imported) {
        self.form = {
          sections: [
            {
              title: null,
              type: 'digitalobject',
              id: 1,
              fields: []
            }
          ]
        }

        let defaultResourceType = 'https://pid.phaidra.org/vocabulary/44TN-P1S0'

        let rt = fields.getField('resource-type-buttongroup')
        rt.vocabulary = 'resourcetypenocontainer'
        rt.value = defaultResourceType
        self.form.sections[0].fields.push(rt)

        let ot = fields.getField('object-type-checkboxes')
        ot.resourceType = defaultResourceType
        self.form.sections[0].fields.push(ot)

        self.form.sections[0].fields.push(fields.getField('title'))

        self.form.sections[0].fields.push(fields.getField('description'))

        let lang = fields.getField('language')
        lang.value = 'deu'
        self.form.sections[0].fields.push(lang)

        self.form.sections[0].fields.push(fields.getField('keyword'))

        let role = fields.getField('role')
        role.ordergroup = 'role'
        self.form.sections[0].fields.push(role)

        self.form.sections[0].fields.push(fields.getField('association'))

        let lic = fields.getField('license')
        lic.showValueDefinition = true
        self.form.sections[0].fields.push(lic)

        self.form.sections[0].fields.push(fields.getField('file'))
      }
    }
  },
  beforeRouteEnter: async function (to, from, next) {
    next(async function (vm) {
      vm.$store.commit('setLoading', true)
      await vm.createForm(vm)
      if (vm.relation === 'hassuccessor') {
        await vm.$store.dispatch('fetchObjectInfo', vm.relatedpid)
      }
      vm.$store.commit('setLoading', false)
    })
  },
  beforeRouteUpdate: async function (to, from, next) {
    this.$store.commit('setLoading', true)
    await this.createForm(this)
    if (this.relation === 'hassuccessor') {
      await this.$store.dispatch('fetchObjectInfo', this.relatedpid)
    }
    this.$store.commit('setLoading', false)
  }
}
</script>
