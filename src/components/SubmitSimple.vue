<template>
  <v-container fluid>
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
    <v-row>
      <v-col cols="12" md="10" offset-md="1">
        <p-i-form
          :form="form"
          :rights="rights"
          :enablerights="true"
          :enablerelationships="true"
          :templating="false"
          :importing="false"
          :addbutton="false"
          :help="true"
          :debug="false"
          :feedback="true"
          :feedback-user="this.user"
          :feedback-context="'Simple submit'"
          :guidelines-url="'https://static.phaidra-sandbox.univie.ac.at/guidelines/3.5.5Guidelinespicture_borndigital_'"
          :validate="validate"
          v-on:load-form="form = $event"
          v-on:object-created="objectCreated($event)"
          v-on:form-input-resource-type="handleInputResourceType($event)"
          v-on:input-rights="rights = $event"
        ></p-i-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import arrays from 'phaidra-vue-components/src/utils/arrays'
import fields from 'phaidra-vue-components/src/utils/fields'
import { context } from '../mixins/context'
import { formvalidation } from '../mixins/formvalidation'
import { vocabulary } from 'phaidra-vue-components/src/mixins/vocabulary'

export default {
  name: 'submit-simple',
  mixins: [ context, vocabulary, formvalidation ],
  data () {
    return {
      form: { sections: [] },
      rights: {}
    }
  },
  methods: {
    handleInputResourceType: function (rt) {
      switch (rt) {
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
            let rtv
            for (let s of this.form.sections) {
              for (let f of s.fields) {
                if (f.predicate === 'dcterms:type') {
                  rtv = f.value
                }
              }
            }
            otf.resourceType = rtv
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
            let rtv2
            for (let s of this.form.sections) {
              for (let f of s.fields) {
                if (f.predicate === 'dcterms:type') {
                  rtv2 = f.value
                }
              }
            }
            otf2.resourceType = rtv2
            this.form.sections[0].fields.splice(1, 0, otf2)
          }
          break
      }
    },
    objectCreated: function (event) {
      this.$router.push({ name: 'detail', params: { pid: event } })
      this.$vuetify.goTo(0)
    },
    createForm: function (self, index) {
      self.validationError = false
      self.fieldsMissing = []

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
  },
  beforeRouteEnter: function (to, from, next) {
    next(vm => {
      vm.createForm(vm)
    })
  },
  beforeRouteUpdate: function (to, from, next) {
    this.createForm(this)
    next()
  }
}
</script>
