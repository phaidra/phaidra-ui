<template>
  <v-col>
    <v-card>
      <v-card-title class="title font-weight-light grey white--text">
        <span class="mr-1">{{ $t('Upload of') }}</span>
        <span v-if="relation === 'http://purl.org/dc/terms/references'">{{ $t('an object referencing') }}</span>
        <span v-if="relation === 'http://phaidra.org/XML/V1.0/relations#isBackSideOf'">{{ $t('the back side of') }}</span>
        <span v-if="relation === 'http://phaidra.org/XML/V1.0/relations#isThumbnailFor'">{{ $t('a thumbnail for') }}</span>
        <span v-if="relation === 'http://phaidra.univie.ac.at/XML/V1.0/relations#hasSuccessor'">{{ $t('a new version of') }}</span>
        <span v-if="relation === 'http://phaidra.org/XML/V1.0/relations#isAlternativeFormatOf'">{{ $t('an alternative format of') }}</span>
        <span v-if="relation === 'http://phaidra.org/XML/V1.0/relations#isAlternativeVersionOf'">{{ $t('an alternative version of') }}</span>
        <span v-if="relation === 'info:fedora/fedora-system:def/relations-external#hasCollectionMember'">{{ $t('a new member of collection') }}</span>
        <span v-if="relation === 'http://pcdm.org/models#hasMember'">{{ $t('new member of container') }}</span>
        <span class="ml-1">{{ relatedpid }}</span>
      </v-card-title>
      <v-card-text>
        <p-i-form
          :form="form"
          :rights="rights"
          :relationships="relationships"
          :enablerights="true"
          :enablerelationships="false"
          :templating="true"
          :importing="false"
          :addbutton="true"
          :help="true"
          :debug="false"
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

export default {
  name: 'add-member',
  mixins: [ context, vocabulary, formvalidation ],
  computed: {
    relatedpid: function () {
      return this.$store.state.route.params.relatedpid
    },
    relation: function () {
      return this.$store.state.route.params.relation
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
      relationships: []
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
                f.selectedTerms = []
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
                f.selectedTerms = []
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
    objectCreated: function (event) {
      this.memberpid = event
      this.$store.commit('setAlerts', [{ type: 'success', msg: this.$t('Upload successful') + ' ' + event }])
      // add membership relation
      // var self = this
      // var httpFormData = new FormData()
      // this.loading = true
      // httpFormData.append('predicate', 'http://pcdm.org/models#hasMember')
      // httpFormData.append('object', 'info:fedora/' + self.memberpid)
      // var url = self.$store.state.settings.instance.api + '/object/' + self.parentpid + '/relationship/add'
      // var promise = fetch(url, {
      //   method: 'POST',
      //   mode: 'cors',
      //   headers: {
      //     'X-XSRF-TOKEN': self.$store.state.user.token
      //   },
      //   body: httpFormData
      // })
      //   .then(function (response) { return response.json() })
      //   .then(function (json) {
      //     if (self.isthumbnail) {
      //       httpFormData = new FormData()
      //       httpFormData.append('predicate', 'http://phaidra.org/XML/V1.0/relations#isThumbnailFor')
      //       httpFormData.append('object', 'info:fedora/' + self.parentpid)
      //       url = self.$store.state.settings.instance.api + '/object/' + self.memberpid + '/relationship/add'
      //       var promise2 = fetch(url, {
      //         method: 'POST',
      //         mode: 'cors',
      //         headers: {
      //           'X-XSRF-TOKEN': self.$store.state.user.token
      //         },
      //         body: httpFormData
      //       })
      //         .then(function (response) { return response.json() })
      //         .then(function (json) {
      //           self.loading = false
      //           self.$router.push({ name: 'detail', params: { pid: self.parentpid } })
      //         })
      //         .catch(function (error) {
      //           console.log(error)
      //         })
      //       return promise2
      //     } else {
      //       self.loading = false
      //       self.$router.push({ name: 'detail', params: { pid: self.parentpid } })
      //     }
      //   })
      //   .catch(function (error) {
      //     console.log(error)
      //   })
      // return promise
    },
    importFromRelatedObject: async function () {
      this.loading = true
      try {
        let response = await this.$http.request({
          method: 'GET',
          url: this.$store.state.instanceconfig.api + '/object/' + this.relatedpid + '/jsonld'
        })
        if (response.data.hasOwnProperty('JSON-LD')) {
          this.form = jsonLd.json2form(response.data['JSON-LD'])
          for (let s of this.form.sections) {
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
        } else {
          if (response.data.alerts && response.data.alerts.length > 0) {
            this.$store.commit('setAlerts', response.data.alerts)
          }
        }
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    createForm: function (self) {
      self.validationError = false
      self.fieldsMissing = []

      if (
        (this.relation === 'http://phaidra.univie.ac.at/XML/V1.0/relations#hasSuccessor') ||
        (this.relation === 'info:fedora/fedora-system:def/relations-external#hasCollectionMember') ||
        (this.relation === 'http://pcdm.org/models#hasMember')) {
        self.relationships.push(
          {
            s: 'info:fedora/' + this.relatedpid,
            p: this.relation,
            o: 'self'
          }
        )
      } else {
        self.relationships.push(
          {
            s: 'self',
            p: this.relation,
            o: 'info:fedora/' + this.relatedpid
          }
        )
      }

      if (
        (this.relation === 'http://phaidra.univie.ac.at/XML/V1.0/relations#hasSuccessor') ||
        (this.relation === 'http://phaidra.org/XML/V1.0/relations#isAlternativeFormatOf') ||
        (this.relation === 'http://phaidra.org/XML/V1.0/relations#isAlternativeVersionOf')) {
        this.importFromRelatedObject()
      } else {
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
  beforeRouteEnter: function (to, from, next) {
    next(vm => {
      vm.createForm(vm)
    })
  },
  beforeRouteUpdate: function (to, from, next) {
    this.createForm(this)
  }
}
</script>
