<template>
  <v-container fluid class="ksa-submit">
    <v-card>
      <v-card-text>
        <p-i-form
          :form="form"
          :rights="rights"
          :enablerights="true"
          :validate="validate"
          v-on:load-form="form = $event"
          v-on:object-created="objectCreated($event)"
          v-on:add-phaidrasubject-section="addPhaidrasubjectSection($event)"
          v-on:form-input-p-file="handleMimeSelect($event)"
          v-on:input-rights="rights = $event"
        ></p-i-form>
      </v-card-text>
    </v-card>

  </v-container>

</template>

<script>
import fields from 'phaidra-vue-components/src/utils/fields'
import { context } from '../mixins/context'

export default {
  name: 'submit-fb-psychologie',
  mixins: [ context ],
  computed: {
    vocabularies: function () {
      return this.$store.state.vocabulary.vocabularies
    }
  },
  data () {
    return {
      contentmodel: 'https://pid.phaidra.org/vocabulary/44TN-P1S0',
      form: { sections: [] },
      rights: {}
    }
  },
  watch: {
    contentmodel: function (val) {
      for (var i = 0; i < this.form.sections.length; i++) {
        for (var j = 0; j < this.form.sections[i].fields.length; j++) {
          if (this.form.sections[i].fields[j].predicate === 'dcterms:type') {
            this.form.sections[i].fields[j].value = this.contentmodel
            return
          }
        }
      }
    }
  },
  methods: {
    validate: function () {
      return true
    },
    objectCreated: function (event) {
      this.$router.push({ name: 'detail', params: { pid: event } })
      this.$vuetify.goTo(0)
    },
    resetForm: function (cm) {
      this.createSimpleForm()
      this.setLangGerman()
    },
    setLangGerman: function () {
      for (let s of this.form.sections) {
        for (let f of s.fields) {
          if (f.language === 'eng') {
            f.language = 'deu'
          }
          if (f.nameLanguage === 'eng') {
            f.nameLanguage = 'deu'
          }
          if (f.descriptionLanguage === 'eng') {
            f.descriptionLanguage = 'deu'
          }
        }
      }
    },
    getResourceTypeFromMimeType: function (mime) {
      switch (mime) {
        case 'image/jpeg':
        case 'image/tiff':
        case 'image/gif':
        case 'image/png':
        case 'image/x-ms-bmp':
          // picture
          return 'https://pid.phaidra.org/vocabulary/44TN-P1S0'

        case 'audio/wav':
        case 'audio/mpeg':
        case 'audio/flac':
        case 'audio/ogg':
          // audio
          return 'https://pid.phaidra.org/vocabulary/8YB5-1M0J'

        case 'application/pdf':
          // document
          return 'https://pid.phaidra.org/vocabulary/69ZZ-2KGX'

        case 'video/mpeg':
        case 'video/avi':
        case 'video/mp4':
        case 'video/quicktime':
        case 'video/x-matroska':
          // video
          return 'https://pid.phaidra.org/vocabulary/B0Y6-GYT8'

        // eg application/x-iso9660-image
        default:
          // data
          return 'https://pid.phaidra.org/vocabulary/7AVS-Y482'
      }
    },
    handleMimeSelect: function (field) {
      if (field.predicate === 'ebucore:filename') {
        for (let s of this.form.sections) {
          if (s.fields) {
            let isParentSection = false
            for (let f of s.fields) {
              if ((f.predicate === 'ebucore:filename') && (f.id === field.id)) {
                isParentSection = true
              }
            }
            if (isParentSection) {
              for (let f of s.fields) {
                if (f.predicate === 'dcterms:type') {
                  f.value = this.getResourceTypeFromMimeType(field.mimetype)
                  f['skos:prefLabel'] = []
                  for (let rt of this.vocabularies.resourcetype.terms) {
                    if (rt['@id'] === f.value) {
                      Object.entries(rt['skos:prefLabel']).forEach(([key, value]) => {
                        f['skos:prefLabel'].push({ '@value': value, '@language': key })
                      })
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    createSimpleForm: function (index) {
      this.form = {
        sections: [
          {
            title: 'General metadata',
            type: 'digitalobject',
            id: 1,
            fields: []
          },
          {
            title: 'Digitized object',
            type: 'phaidra:Subject',
            id: 2,
            fields: []
          },
          {
            title: 'File',
            id: 4,
            type: '',
            multiplicable: false,
            fields: []
          }
        ]
      }
      var rt = fields.getField('resource-type')
      rt.value = this.contentmodel
      this.form.sections[0].fields.push(rt)
      this.form.sections[0].fields.push(fields.getField('title'))
      let digirole = fields.getField('role')
      digirole.role = 'role:digitiser'
      this.form.sections[0].fields.push(digirole)
      this.form.sections[0].fields.push(fields.getField('date-edtf'))
      this.form.sections[0].fields.push(fields.getField('keyword'))
      this.form.sections[0].fields.push(fields.getField('bk-subject'))
      this.form.sections[0].fields.push(fields.getField('gnd-subject'))
      this.form.sections[0].fields.push(fields.getField('description'))
      let cit = fields.getField('citation')
      cit.type = 'cito:cites'
      this.form.sections[0].fields.push(cit)
      var lang = fields.getField('language')
      lang.value = 'deu'
      this.form.sections[0].fields.push(lang)
      this.form.sections[0].fields.push(fields.getField('note'))

      this.form.sections[1].fields.push(fields.getField('physical-location'))
      this.form.sections[1].fields.push(fields.getField('shelf-mark'))
      this.form.sections[1].fields.push(fields.getField('inscription'))
      this.form.sections[1].fields.push(fields.getField('temporal-coverage'))
      this.form.sections[1].fields.push(fields.getField('height'))
      this.form.sections[1].fields.push(fields.getField('width'))
      this.form.sections[1].fields.push(fields.getField('condition-note'))
      this.form.sections[1].fields.push(fields.getField('technique-vocab'))
      this.form.sections[1].fields.push(fields.getField('technique-text'))
      this.form.sections[1].fields.push(fields.getField('material-vocab'))
      this.form.sections[1].fields.push(fields.getField('material-text'))

      let file = fields.getField('file')
      file.mimetype = 'image/tiff'
      this.form.sections[2].fields.push(file)
      this.form.sections[2].fields.push(fields.getField('license'))
      this.form.sections[2].fields.push(fields.getField('rights'))
    },
    addPhaidrasubjectSection: function (afterSection) {
      let s = {
        title: 'SUBJECT_SECTION',
        type: 'phaidra:Subject',
        id: this.form.sections.length + 1,
        removable: true,
        multiplicable: true,
        fields: []
      }
      this.form.sections.splice(this.form.sections.indexOf(afterSection) + 1, 0, s)
    }
  },
  mounted: async function () {
    this.createSimpleForm()
    this.setLangGerman()
  }
}
</script>
