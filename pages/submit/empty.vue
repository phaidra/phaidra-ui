<template>
  <v-container fluid>
    <v-card>
      <v-card-text>
        <client-only>
        <p-i-form
          :form="form"
          :disablesave="true"
          :validate="validate"
          v-on:load-form="form = $event"
          v-on:object-created="objectCreated($event)"
          v-on:add-phaidrasubject-section="addPhaidrasubjectSection($event)"
        ></p-i-form>
        </client-only>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { context } from '../../mixins/context'

export default {
  mixins: [ context ],
  data () {
    return {
      form: { sections: [] }
    }
  },
  methods: {
    validate: function () {
      return true
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
    },
    objectCreated: function (event) {
      this.$router.push(this.localeLocation({ path: `detail/${event}`}))
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
    }
  },
  mounted: function () {
    this.createSimpleForm()
  }
}
</script>
