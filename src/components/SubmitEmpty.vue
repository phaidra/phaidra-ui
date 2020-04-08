<template>
  <v-container>
    <v-card>
      <v-card-text>
        <p-i-form
          :form="form"
          :disablesave="true"
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
import { context } from '../mixins/context'

export default {
  name: 'submit-empty',
  mixins: [ context ],
  data () {
    return {
      form: { sections: [] }
    }
  },
  methods: {
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
      rt.disabled = false
      this.form.sections[0].fields.push(rt)
    }
  },
  mounted: function () {
    this.createSimpleForm()
  }
}
</script>
