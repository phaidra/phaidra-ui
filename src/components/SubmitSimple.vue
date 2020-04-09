<template>
  <v-container>
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
      <v-col cols="12" md="8" offset-md="2">
        <p-i-form
          :form="form"
          :rights="rights"
          :enablerights="true"
          :addbutton="false"
          :validate="validate"
          v-on:load-form="form = $event"
          v-on:object-created="objectCreated($event)"
          v-on:form-input-p-select="handleSelect($event)"
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
import { vocabulary } from 'phaidra-vue-components/src/mixins/vocabulary'

export default {
  name: 'submit-simple',
  mixins: [ context, vocabulary ],
  data () {
    return {
      form: { sections: [] },
      rights: {},
      validationError: false,
      fieldsMissing: []
    }
  },
  methods: {
    validate: function () {
      this.validationError = false
      this.fieldsMissing = []
      let missingTitle = true
      let missingDescription = true
      let missingKeyword = true
      let missingRole = true
      let missingLicense = true
      let missingResourceType = true
      let missingObjectType = true
      let missingFile = true
      let resourceType = null
      for (let s of this.form.sections) {
        for (let f of s.fields) {
          if (f.predicate === 'dcterms:type') {
            resourceType = f.value
          }
        }
      }
      switch (resourceType) {
        case 'https://pid.phaidra.org/vocabulary/GXS7-ENXJ':
          // collection
          missingFile = false
          missingLicense = false
          break
        case 'https://pid.phaidra.org/vocabulary/T8GH-F4V8':
          // resource
          missingFile = false
          missingLicense = false
          break
      }

      for (let s of this.form.sections) {
        for (let f of s.fields) {
          if (f.component === 'p-title') {
            missingTitle = false
            f.titleErrorMessages = []
            if (f.title.length < 1) {
              f.titleErrorMessages.push(this.$t('Missing title'))
              this.validationError = true
            }
          }
          if (f.predicate === 'bf:note') {
            missingDescription = false
            f.errorMessages = []
            if (f.value.length < 1) {
              f.errorMessages.push(this.$t('Missing description'))
              this.validationError = true
            }
          }
          if (f.component === 'p-keyword') {
            missingKeyword = false
            f.errorMessages = []
            if (f.value.length < 1) {
              f.errorMessages.push(this.$t('Missing keywords'))
              this.validationError = true
            }
          }
          if (f.component === 'p-entity') {
            missingRole = false
            f.firstnameErrorMessages = []
            f.lastnameErrorMessages = []
            f.roleErrorMessages = []
            f.affiliationErrorMessages = []
            f.affiliationTextErrorMessages = []
            f.organizationErrorMessages = []
            f.organizationTextErrorMessages = []
            if (f.role.length < 1) {
              f.roleErrorMessages.push(this.$t('Missing role'))
              this.validationError = true
            }
            if (f.type === 'schema:Person') {
              if (f.firstname.length < 1) {
                f.firstnameErrorMessages.push(this.$t('Missing firstname'))
                this.validationError = true
              }
              if (f.lastname.length < 1) {
                f.lastnameErrorMessages.push(this.$t('Missing lastname'))
                this.validationError = true
              }
            }
            if (f.type === 'schema:Organization') {
              if (f.organization.length < 1) {
                f.organizationErrorMessages.push(this.$t('Missing organization'))
                this.validationError = true
              }
            }
          }
          if (f.component === 'p-select') {
            f.errorMessages = []
            if (f.predicate === 'edm:rights') {
              missingLicense = false
              if (f.value.length < 1) {
                f.errorMessages.push(this.$t('Please select'))
                this.validationError = true
              }
            }
            if (f.predicate === 'dcterms:type') {
              missingResourceType = false
              if (f.value.length < 1) {
                f.errorMessages.push(this.$t('Please select'))
                this.validationError = true
              }
            }
            if (f.predicate === 'edm:hasType') {
              missingObjectType = false
              if (f.value.length < 1) {
                f.errorMessages.push(this.$t('Please select'))
                this.validationError = true
              }
            }
          }
          if (f.component === 'p-file') {
            missingFile = false
            f.fileErrorMessages = []
            f.mimetypeErrorMessages = []
            if (!f.file) {
              f.fileErrorMessages.push(this.$t('Please select'))
              this.validationError = true
            }
            if (f.mimetype.length < 1) {
              f.mimetypeErrorMessages.push(this.$t('Please select'))
              this.validationError = true
            }
          }
        }
      }

      if (missingTitle) {
        this.fieldsMissing.push(this.$t('Title'))
      }
      if (missingDescription) {
        this.fieldsMissing.push(this.$t('Description'))
      }
      if (missingKeyword) {
        this.fieldsMissing.push(this.$t('Keyword'))
      }
      if (missingRole) {
        this.fieldsMissing.push(this.$t('Role'))
      }
      if (missingLicense) {
        this.fieldsMissing.push(this.$t('License'))
      }
      if (missingResourceType) {
        this.fieldsMissing.push(this.$t('Resource type'))
      }
      if (missingObjectType) {
        this.fieldsMissing.push(this.$t('Object type'))
      }
      if (missingFile) {
        this.fieldsMissing.push(this.$t('File'))
      }

      if (this.validationError) {
        this.$vuetify.goTo(0)
      }
      return !this.validationError
    },
    handleSelect: function (field) {
      if (field.predicate === 'dcterms:type') {
        switch (field.value) {
          case 'https://pid.phaidra.org/vocabulary/GXS7-ENXJ':
            // collection => remove file and license field and resourcelink section
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
                if (f.predicate === 'edm:rights') {
                  arrays.remove(s.fields, f)
                  break
                }
              }
            }
            break
          case 'https://pid.phaidra.org/vocabulary/T8GH-F4V8':
            // resource => remove license field and add resourcelink section
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
            break
          default:
            // add file field im missing and remove resourcelink section
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
            break
        }
      }
    },
    objectCreated: function (event) {
      this.$router.push({ name: 'detail', params: { pid: event } })
      this.$vuetify.goTo(0)
    },
    createContainerForm: function (self, index) {
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

      let rt = fields.getField('resource-type')
      rt.disabled = false
      rt.vocabulary = 'resourcetypenocontainer'
      self.form.sections[0].fields.push(rt)

      self.form.sections[0].fields.push(fields.getField('object-type'))

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
      vm.createContainerForm(vm)
    })
  },
  beforeRouteUpdate: function (to, from, next) {
    this.createContainerForm(this)
    next()
  }
}
</script>
