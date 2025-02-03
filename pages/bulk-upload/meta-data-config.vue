<template>
  <v-container class="meta-data-config">
    <BulkUploadSteps />
    
    <!-- Only render content when initialized -->
    <template v-if="isInitialized">
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
              <!-- Header Row -->
              <v-row class="border-bottom">
                <v-col cols="2">
                </v-col>
                <v-col cols="4">
                  <h4>Source from your CSV</h4>
                  <div class="caption text-grey">every entry gets its value from its corresponding CSV row</div>
                </v-col>
                <v-col cols="2" class="text-center">
                  <p>OR</p>
                </v-col>
                <v-col cols="4">
                  <h4>Source a Default Value from Phaidra</h4>
                  <div class="caption text-grey">ALL rows get the selected default value</div>
                </v-col>
              </v-row>

              <!-- Mapping Rows -->
              <v-row v-for="field in requiredFields" :key="field" class="py-4 align-center" :class="{ 'border-bottom': field !== requiredFields[requiredFields.length - 1], 'flash-blue': field === flashingField }">
                <!-- Field Name -->
                <v-col cols="2" class="d-flex align-center">
                  <span class="text-capitalize text-subtitle-1">{{ field }}</span>
                  <v-icon
                    v-if="fieldIsMapped(field)"
                    color="success"
                    small
                    class="ml-2"
                  >
                    mdi-check-circle
                  </v-icon>
                </v-col>

                <v-col cols="4">
                  <CSVColumnSelector
                    v-if="getAllowedSources(field).includes('csv-column')"
                    :field="field"
                    :columns="columns"
                    :value="fieldMappings[field]"
                    :disabled="selectedRadioButton[field] !== 'csv-column' && getAllowedSources(field).includes('phaidra-field')"
                    :all-mappings="getAllFieldMappings"
                    @input="val => updateMapping(field, 'csv-column', val)"
                  />
                </v-col>

                <v-col cols="2">
                  <SourceSelector
                    :field="field"
                    :allowed-sources="getAllowedSources(field)"
                    :value="selectedRadioButton[field]"
                    @input="val => handleSourceChange(field, val)"
                  />
                </v-col>

                <v-col cols="4">
                  <PhaidraFieldSelector
                    v-if="getAllowedSources(field).includes('phaidra-field')"
                    :field="field"
                    :value="phaidraDisplayValues[field]"
                    :disabled="selectedRadioButton[field] !== 'phaidra-field' && getAllowedSources(field).includes('csv-column')"
                    @input="val => updateMapping(field, 'phaidra-field', val)"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Navigation Buttons -->
      <v-row justify="space-between" class="mt-4">
        <v-col cols="auto">
          <v-btn
            text
            :to="steps[1].route"
          >
            <v-icon left>mdi-arrow-left</v-icon>
            Back
          </v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn
            color="primary"
            @click="proceed"
            :disabled="!allFieldsMapped"
            :to="steps[3].route"
          >
            Next
            <v-icon right>mdi-arrow-right</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import BulkUploadSteps from '~/components/BulkUploadSteps.vue'

import { fieldSettings } from '~/config/bulk-upload/field-settings'
import CSVColumnSelector from '~/components/bulk-upload/CSVColumnSelector.vue'
import SourceSelector from '~/components/bulk-upload/SourceSelector.vue'
import PhaidraFieldSelector from '~/components/bulk-upload/PhaidraFieldSelector.vue'

export default {
  name: 'MetaDataConfig',

  components: {
    BulkUploadSteps,
    CSVColumnSelector,
    SourceSelector,
    PhaidraFieldSelector
  },

  data() {
    return {
      fieldMappings: {},
      selectedRadioButton: {},
      selectedPhaidraElement: {},
      phaidraDisplayValues: {},
      isInitialized: false,
      flashingField: null
    }
  },

  computed: {
    ...mapState('bulk-upload', ['columns', 'steps', 'requiredFields']),
    ...mapGetters('bulk-upload', ['getFieldMapping', 'getAllFieldMappings']),

    allFieldsMapped() {
      return this.requiredFields.every(field => this.fieldIsMapped(field))
    },

    fieldIsMapped() {
      const valueKeys = {
        'csv-column': 'csvValue',
        'phaidra-field': 'phaidraValue'
      }

      return (field) => {
        const mapping = this.getFieldMapping(field)
        return mapping && mapping.source && mapping[valueKeys[mapping.source]]
      }
    },

    getAllowedSources() {
      return (field) => {
        return fieldSettings[field]?.allowedSources || ['csv-column', 'phaidra-field']
      }
    }
  },

  methods: {
    ...mapMutations('bulk-upload', ['setFieldMapping', 'setCurrentStep', 'completeStep']),

    updateMapping(field, source, value) {
      // Add flash animation to specific row
      this.flashingField = field;
      setTimeout(() => {
        this.flashingField = null;
      }, 250);

      if (!source) {
        this.setFieldMapping({ requiredField: field, source: null })
      } else {
        const mapping = {
          requiredField: field,
          source
        }

        // Store additional data based on source type
        if (source === 'csv-column') {
          mapping.csvValue = value
        } else if (source === 'phaidra-field') {
          mapping.phaidraValue = "test"
          mapping.phaidraField = value
        }

        this.setFieldMapping(mapping)
      }
    },

    handleSourceChange(field, source) {
      // Update the selectedRadioButton state
      this.$set(this.selectedRadioButton, field, source)
      
      if (source === 'phaidra-field') {
        const phaidraConfig = fieldSettings[field]?.phaidraComponentMapping?.[0]
        if (phaidraConfig) {
          this.selectedPhaidraElement[field] = phaidraConfig.value
          const fieldObject = phaidraConfig.field()
          this.updateMapping(field, source, fieldObject)
        }
      } else if (source === 'csv-column') {
        const previousMapping = this.getFieldMapping(field)
        const csvValue = previousMapping?.csvValue || this.fieldMappings[field]
        if (csvValue) {
          this.updateMapping(field, source, csvValue)
        }
      }
    },

    proceed() {
      this.completeStep(2)
      this.setCurrentStep(3)
      this.$router.push(this.steps[3].route)
    }
  },

  async created() {
    // Wait for store initialization on client side
    if (process.client && this.$store.$initBulkUpload) {
      await this.$store.$initBulkUpload()
    }

    // Initialize mappings from store and try automatic matching
    this.requiredFields.forEach(field => {
      const mapping = this.getFieldMapping(field)
      const allowedSources = this.getAllowedSources(field)
      
      // Initialize mapping type to null if not set
      if (!this.selectedRadioButton[field]) {
        this.$set(this.selectedRadioButton, field, null)
      }

      if (mapping) {
        if (mapping.source === 'phaidra-field') {
          // Handle existing Phaidra mapping
          this.$set(this.selectedRadioButton, field, 'phaidra-field')
          const phaidraConfig = fieldSettings[field]?.phaidraComponentMapping?.[0]
          if (phaidraConfig) {
            this.selectedPhaidraElement[field] = phaidraConfig.value
            this.phaidraDisplayValues[field] = mapping.value
          }
        } else if (mapping.source === 'csv-column') {
          // Handle existing CSV mapping
          this.$set(this.selectedRadioButton, field, 'csv-column')
          const columnExists = this.columns.includes(mapping.csvValue)
          if (columnExists) {
            this.fieldMappings[field] = mapping.csvValue
          }
        }
      } else {
        // Try to find automatic match if no mapping exists and CSV is allowed
        if (allowedSources.includes('csv-column')) {
          const matchingColumn = this.columns.find(
            col => col.toLowerCase() === field.toLowerCase()
          )
          if (matchingColumn) {
            this.$set(this.selectedRadioButton, field, 'csv-column')
            this.fieldMappings[field] = matchingColumn
            this.updateMapping(field, 'csv-column', matchingColumn)
          }
        }
      }
    })

    // Mark as initialized after all setup is complete
    this.isInitialized = true
  }
}
</script>

<style scoped>
.meta-data-config {
  max-width: 1200px;
  margin: 0 auto;
}

.flash-blue {
  background-color: #e6f7ff;
}
</style>