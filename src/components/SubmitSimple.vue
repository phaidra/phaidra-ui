<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="8" offset-md="2">
        <p-i-form
          :form="form"
          :rights="rights"
          :enablerights="true"
          :addbutton="false"
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
      rights: {}
    }
  },
  methods: {
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
    resetForm: function (cm) {
      this.createContainerForm()
      this.setLangGerman()
    },
    setLangGerman: function () {
      for (let s of this.form.sections) {
        for (let f of s.fields) {
          if (f.language) {
            f.language = 'deu'
          }
          if (f.nameLanguage) {
            f.nameLanguage = 'deu'
          }
          if (f.descriptionLanguage) {
            f.descriptionLanguage = 'deu'
          }
        }
      }
    },
    createContainerForm: function (index) {
      this.form = {
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
      this.form.sections[0].fields.push(rt)

      this.form.sections[0].fields.push(fields.getField('object-type'))

      this.form.sections[0].fields.push(fields.getField('title'))

      this.form.sections[0].fields.push(fields.getField('description'))

      let lang = fields.getField('language')
      lang.value = 'deu'
      this.form.sections[0].fields.push(lang)

      this.form.sections[0].fields.push(fields.getField('keyword'))

      let role = fields.getField('role')
      role.ordergroup = 'role'
      this.form.sections[0].fields.push(role)

      this.form.sections[0].fields.push(fields.getField('association'))

      let lic = fields.getField('license')
      lic.showValueDefinition = true
      this.form.sections[0].fields.push(lic)

      this.form.sections[0].fields.push(fields.getField('file'))
    }
  },
  mounted: function () {
    this.createContainerForm()
    this.setLangGerman()
  }
}
</script>
