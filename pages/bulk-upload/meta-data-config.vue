<template>
  <v-container class="meta-data-config">
    <BulkUploadSteps />
    <v-row>
      <v-col>
        <h1 class="text-h4">Step 2: Map CSV Fields</h1>
        <p class="text-subtitle-1 mt-2">
          Map your CSV columns to the required fields. Fields with matching names are automatically mapped.
        </p>
      </v-col>
    </v-row>

    <!-- Mapping Section -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card outlined>
          <v-card-text>
            <v-row v-for="field in requiredFields" :key="field" class="mb-4">
              <v-col cols="12" sm="4" class="d-flex align-center">
                <strong>{{ field }}</strong>
                <v-icon
                  v-if="getFieldMapping(field)"
                  color="success"
                  small
                  class="ml-2"
                >
                  mdi-check-circle
                </v-icon>
              </v-col>
              <v-col cols="12" sm="8">
                <v-select
                  v-model="fieldMappings[field]"
                  :items="columns"
                  outlined
                  dense
                  clearable
                  :label="'Select CSV column for ' + field"
                  @change="updateMapping(field, $event)"
                ></v-select>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Navigation Buttons -->
    <v-row class="mt-6">
      <v-col class="d-flex">
        <v-btn
          text
          :to="steps[1].route"
        >
          <v-icon left>mdi-arrow-left</v-icon>
          Back
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          :disabled="!allFieldsMapped"
          @click="proceed"
        >
          Continue
          <v-icon right>mdi-arrow-right</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'MetaDataConfig',

  data() {
    return {
      fieldMappings: {}
    }
  },

  computed: {
    ...mapState('bulk-upload', ['columns', 'steps', 'requiredFields']),
    ...mapGetters('bulk-upload', ['getFieldMapping']),

    allFieldsMapped() {
      return this.requiredFields.every(field => this.fieldMappings[field])
    }
  },

  methods: {
    ...mapMutations('bulk-upload', ['setFieldMapping', 'setCurrentStep', 'completeStep']),

    updateMapping(field, value) {
      if (value === null) {
        // When cleared, delete the mapping from both local state and store
        this.$delete(this.fieldMappings, field)
        this.setFieldMapping({ requiredField: field, csvColumn: null })
      } else {
        this.setFieldMapping({ requiredField: field, csvColumn: value })
      }
    },

    proceed() {
      this.completeStep(2)
      this.setCurrentStep(3)
      this.$router.push(this.steps[3].route)
    }
  },

  created() {
    // Initialize mappings from store
    this.requiredFields.forEach(field => {
      const mapping = this.getFieldMapping(field)
      if (mapping) {
        this.fieldMappings[field] = mapping
      } else {
        // Try to find automatic match
        const matchingColumn = this.columns.find(
          col => col.toLowerCase() === field.toLowerCase()
        )
        if (matchingColumn) {
          this.updateMapping(field, matchingColumn)
          this.fieldMappings[field] = matchingColumn
        }
      }
    })
  }
}
</script>

<style scoped>
.meta-data-config {
  max-width: 900px;
}
</style>