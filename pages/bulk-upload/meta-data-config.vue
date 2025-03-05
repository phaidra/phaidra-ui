<template>
  <v-container class="meta-data-config">
    <BulkUploadSteps />
    
    <template v-if="isInitialized">
      <v-row>
        <v-col>
          <h1 class="text-h4">Step 2: Map CSV Fields</h1>
          <p class="text-subtitle-1 mt-2">
            Map your CSV columns to the required fields. Fields with matching names are automatically mapped.
          </p>
        </v-col>
      </v-row>

      <v-row class="mt-4">
        <v-col cols="12">
          <v-card outlined>
            <v-card-text>
              <!-- Header Row -->
              <v-row class="border-bottom">
                <v-col cols="2" class="d-flex align-center">
                  <h4>* required</h4>
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
              <template v-for="field in allFields">
                <!-- Single Field Layout -->
                <v-row v-if="fieldSettings[field]?.fieldType === 'single-field'" class="py-4 align-center" :class="{ 'border-bottom': field !== allFields[allFields.length - 1], 'flash-blue': field === flashingField }" :key="field">
                  <!-- Field Name -->
                  <v-col cols="2" class="d-flex align-center">
                    <span class="text-capitalize text-subtitle-1">{{ field }}{{ fieldSettings[field]?.required ? ' *' : '' }}</span>
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
                      :value="getFieldMapping(field)?.csvValue"
                      :disabled="getFieldMapping(field)?.source !== 'csv-column' && getAllowedSources(field).includes('phaidra-field')"
                      :all-mappings="getAllFieldMappings"
                      @input="val => updateMapping(field, 'csv-column', val)"
                    />
                  </v-col>

                  <v-col cols="2">
                    <SourceSelector
                      :field="field"
                      :allowed-sources="getAllowedSources(field)"
                      :value="getFieldMapping(field)?.source"
                      @input="val => updateSource(field, val)"
                    />
                  </v-col>

                  <v-col cols="4">
                    <PhaidraFieldSelector
                      v-if="getAllowedSources(field).includes('phaidra-field')"
                      :field="field"
                      :value="getFieldMapping(field)?.phaidraValue"
                      :disabled="getFieldMapping(field)?.source !== 'phaidra-field' && getAllowedSources(field).includes('csv-column')"
                      @input="val => updateMapping(field, 'phaidra-field', val)"
                    />
                  </v-col>
                </v-row>
                <!-- Multi Field Layout -->
                <template v-else-if="fieldSettings[field]?.fieldType === 'multi-field'">
                  <v-row v-if="fieldSettings[field]?.fieldType === 'multi-field'" class="py-4 align-center" :class="{ 'border-bottom': field !== allFields[allFields.length - 1], 'flash-blue': field === flashingField }" :key="field">
                    <v-col cols="2" class="d-flex align-center">
                      <span class="text-capitalize text-subtitle-1">{{ field }}{{ fieldSettings[field]?.required ? ' *' : '' }}</span>
                      <v-icon
                        v-if="fieldIsMapped(field)"
                        color="success"
                        small
                        class="ml-2"
                      >
                        mdi-check-circle
                      </v-icon>
                    </v-col>
                    <v-col cols="2">
                      <SourceSelector
                        :field="field"
                        :allowed-sources="getAllowedSources(field)"
                        :value="getFieldMapping(field)?.source"
                        @input="val => updateSource(field, val)"
                    />
                    </v-col>
                    <v-col v-if="getAllowedSources(field).includes('phaidra-field') && getFieldMapping(field)?.source === 'phaidra-field'" cols="8">
                      <PhaidraFieldSelector
                        v-if="getAllowedSources(field).includes('phaidra-field')"
                        :field="field"
                        :value="getFieldMapping(field)"
                        :disabled="getFieldMapping(field)?.source !== 'phaidra-field' && getAllowedSources(field).includes('csv-column')"
                        @input="val => updateMapping(field, 'phaidra-field', val)"
                      />
                    </v-col>
                    <v-col v-if="getAllowedSources(field).includes('csv-column') && getFieldMapping(field)?.source === 'csv-column'" cols="8">
                      <div class="d-flex flex-wrap justify-center" style="row-gap: 1em;">
                        <div v-for="(fieldConfig, subField) in fieldSettings[field].multiFieldConfig.fields" :key="subField" class="mx-2">
                          <label class="d-block mb-1"><b>{{ subField }}{{ fieldConfig.required ? ' *' : '' }}</b></label>
                          <CSVColumnSelector
                            :field="subField"
                            :columns="columns"
                            :all-mappings="getAllFieldMappings"
                            :value="getFieldMapping(field)?.subFields?.[subField]?.csvValue"
                            @input="val => updateMapping(field, 'csv-column', val, subField)"
                          />
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </template>
              </template>
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
      isInitialized: false,
      flashingField: null,
      fieldSettings
    }
  },

  computed: {
    ...mapState('bulk-upload', ['columns', 'steps']),
    ...mapGetters('bulk-upload', ['getFieldMapping', 'getAllFieldMappings', 'requiredFields', 'singleFields', 'multiFields', 'allFields']),

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
        if (!mapping || !mapping.source) return false

        if (this.fieldSettings[field]?.fieldType === 'multi-field') {
          // For multi-fields, check if all required subfields are mapped
          const subFields = Object.entries(this.fieldSettings[field].multiFieldConfig.fields)
            .filter(([_, config]) => config.required)
            .map(([name]) => name)
          return subFields.every(subField => 
            mapping.subFields?.[subField]?.[valueKeys[mapping.source]]
          )
        }

        // For single fields, simply check if the value is set
        return mapping[valueKeys[mapping.source]] !== null && mapping[valueKeys[mapping.source]] !== undefined
      }
    },

    getAllowedSources() {
      return (field) => {
        return fieldSettings[field]?.allowedSources || []
      }
    }
  },

  methods: {
    ...mapMutations('bulk-upload', ['setFieldMapping', 'setCurrentStep', 'completeStep']),

    updateSource(field, source) {
      // Add flash animation to specific row for dev purposes
      this.flashingField = field;
      setTimeout(() => {
        this.flashingField = null;
      }, 250);

      const mapping = {
        field: field,
        source
      }
      mapping.source = source
      this.setFieldMapping(mapping)
    },

    updateValue(field, source, value, subField = null) {
      // Add flash animation to specific row for dev purposes
      this.flashingField = field;
      setTimeout(() => {
        this.flashingField = null;
      }, 250);

      const mapping = {
        field: field,
        source,
        subField: value?.subField || subField
      }

      if (source === 'csv-column') {
        mapping.csvValue = value
      } else if (source === 'phaidra-field') {
        // If value is null or value.value is null, set phaidraValue to null
        mapping.phaidraValue = value?.value === null ? null : (value?.value || value)
      }

      this.setFieldMapping(mapping)
    },

    updateMapping(field, source, value, subField = null) {
      if (!source) {
        this.updateSource(field, null)
      } else {
        this.updateSource(field, source)
        this.updateValue(field, source, value, subField)
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

    this.singleFields.forEach(field => {
      const mapping = this.getFieldMapping(field)
      const allowedSources = this.getAllowedSources(field)
      
      // Try automatic matching for CSV columns if no mapping exists
      if (!mapping) {
        if (allowedSources.includes('csv-column')) {
          const matchingColumn = this.columns.find(
            col => col.toLowerCase() === field.toLowerCase()
          )
          if (matchingColumn) {
            this.updateMapping(field, 'csv-column', matchingColumn)
          }
        }
      }
    })

    this.multiFields.forEach(field => {
      const fieldConfig = this.fieldSettings[field].multiFieldConfig
      Object.keys(fieldConfig.fields).forEach(subField => {
        const mapping = this.getFieldMapping(field, subField)
        const allowedSources = this.getAllowedSources(field)

        if (!mapping) {
          if (allowedSources.includes('csv-column')) {
            const matchingColumn = this.columns.find(
              col => col.toLowerCase() === subField.toLowerCase()
            )
            if (matchingColumn) {
              this.updateMapping(field, 'csv-column', matchingColumn, subField)
            }
          }
        }
      })
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