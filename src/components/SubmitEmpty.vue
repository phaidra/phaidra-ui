<template>
  <v-container grid-list-lg>
    <v-flex>
      <v-breadcrumbs :items="breadcrumbs" divider="/"></v-breadcrumbs>
    </v-flex>
    <v-card>
      <v-toolbar flat>
        <v-toolbar-title>Submit</v-toolbar-title>
        <v-divider class="mx-3" inset vertical></v-divider>
        <v-select
          :items="contentmodels"
          v-model="contentmodel"
          label="Object type"
          single-line
        ></v-select>
      </v-toolbar>
      <v-card-text>
        <p-i-form
          :form="form"
          v-on:load-form="form = $event"
          v-on:object-created="objectCreated($event)"
          v-on:add-phaidrasubject-section="addPhaidrasubjectSection($event)"
        ></p-i-form>
      </v-card-text>
    </v-card>

  </v-container>

</template>

<script>
import fields from 'phaidra-vue-components/src/utils/fields'

export default {
  name: 'submit-empty',
  computed: {
    breadcrumbs: function () {
      let bc = [
        {
          text: this.$t('Submit'),
          to: { name: 'submit', path: '/' }
        },
        {
          text: this.$t('Submit - test'),
          disabled: true,
          to: { name: 'submit-empty', path: 'submit/empty' }
        }
      ]
      return bc
    },
    vocabularies: function () {
      return this.$store.state.vocabulary.vocabularies
    }
  },
  data () {
    return {
      contentmodel: 'https://pid.phaidra.org/vocabulary/44TN-P1S0',
      contentmodels: [
        {
          text: 'Data',
          value: 'https://pid.phaidra.org/vocabulary/7AVS-Y482'
        },
        {
          text: 'Picture',
          value: 'https://pid.phaidra.org/vocabulary/44TN-P1S0'
        },
        {
          text: 'Audio',
          value: 'https://pid.phaidra.org/vocabulary/8YB5-1M0J'
        },
        {
          text: 'Video',
          value: 'https://pid.phaidra.org/vocabulary/B0Y6-GYT8'
        },
        {
          text: 'Document',
          value: 'https://pid.phaidra.org/vocabulary/69ZZ-2KGX'
        }
      ],
      form: { sections: [] }
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

        // should currently not happen, nothing else is in the selectbox
        default:
          // data
          return 'https://pid.phaidra.org/vocabulary/7AVS-Y482'
      }
    },
    addPhaidrasubjectSection: function (afterSection) {
      let s = {
        title: 'Subject',
        type: 'phaidra:Subject',
        id: this.form.sections.length + 1,
        removable: true,
        multiplicable: true,
        fields: []
      }
      this.form.sections.splice(this.form.sections.indexOf(afterSection) + 1, 0, s)
    },
    objectCreated: function (event) {
      this.$store.commit('setAlerts', [{ type: 'success', msg: 'Object ' + event + ' created' }])
      this.$router.push({ name: 'detail', params: { pid: event } })
      this.$vuetify.goTo(0)
    },
    createSimpleForm: function (index) {
      this.form = {
        sections: [
          {
            title: 'Digital object',
            type: 'digitalobject',
            id: 1,
            fields: []
          }
        ]
      }

      var rt = fields.getField('resource-type')
      rt.value = this.contentmodel
      this.form.sections[0].fields.push(rt)
    }
  },
  mounted: function () {
    this.createSimpleForm()
  }
}
</script>
