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
            <v-row v-for="field in requiredFields" :key="field" class="py-4 align-center" :class="{ 'border-bottom': field !== requiredFields[requiredFields.length - 1] }">
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

              <!-- CSV Select -->
              <v-col cols="4">
                <v-select
                  v-model="fieldMappings[field]"
                  :items="getAvailableCSVColumns(field)"
                  outlined
                  dense
                  clearable
                  :label="'Select CSV column'"
                  @change="updateMapping(field, 'csv-column', $event)"
                  hide-details
                  class="flex-grow-0 mr-8"
                  style="width: 200px"
                  :disabled="selectedRadioButton[field] !== 'csv-column'"
                  :class="{ 'grey-input': selectedRadioButton[field] !== 'csv-column' }"
                ></v-select>
              </v-col>

              <!-- Radio Buttons -->
              <v-col cols="2" :class="{ 'highlight-column': !selectedRadioButton[field] }">
                <v-radio-group
                  v-model="selectedRadioButton[field]"
                  hide-details
                  dense
                  class="mt-0 source-select"
                  @change="handleSourceChange(field, $event)"
                >
                  <v-radio
                    value="csv-column"
                    class="mt-0"
                    label="CSV"
                    dense
                  ></v-radio>
                  <v-radio
                    value="phaidra-field"
                    label="Phaidra"
                    dense
                  ></v-radio>
                </v-radio-group>
              </v-col>

              <!-- Phaidra Component -->
              <v-col cols="4">
                <div class="d-flex align-center">
                  <component
                    :is="getPhaidraComponent(field)"
                    v-bind="getPhaidraProps(field)"
                    class="flex-grow-1"
                    :disabled="selectedRadioButton[field] !== 'phaidra-field'"
                    :class="{ 'grey-input': selectedRadioButton[field] !== 'phaidra-field' }"
                  ></component>
                </div>
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
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import BulkUploadSteps from '~/components/BulkUploadSteps.vue'
import { phaidraFieldMappings } from '~/config/bulk-upload/phaidra-field-mappings'

export default {
  name: 'MetaDataConfig',

  components: {
    BulkUploadSteps
  },

  data() {
    return {
      fieldMappings: {},
      selectedRadioButton: {},
      selectedPhaidraElement: {},
      phaidraValues: {},
      phaidraFieldMappings: phaidraFieldMappings
    }
  },

  computed: {
    ...mapState('bulk-upload', ['columns', 'steps', 'requiredFields']),
    ...mapGetters('bulk-upload', ['getFieldMapping', 'getAllFieldMappings']),

    allFieldsMapped() {
      return this.requiredFields.every(field => {
        const mapping = this.getFieldMapping(field)
        return mapping && mapping.source && mapping.value
      })
    },

    // Get available CSV columns, excluding the already selected ones to prevent duplicates
    getAvailableCSVColumns() {
      return (currentField) => {
        // Get all currently selected values except for the current field
        const allMappings = this.getAllFieldMappings
        const selectedValues = Object.entries(allMappings)
          .filter(([field]) => field !== currentField)
          .filter(([_, mapping]) => mapping?.source === 'csv-column')
          .map(([_, mapping]) => mapping.value)
        
        // Return only columns that aren't selected in other fields, sorted alphabetically
        return this.columns
          .filter(col => !selectedValues.includes(col))
          .sort((a, b) => a.localeCompare(b))
      }
    },

    fieldIsMapped() {
      return (field) => {
        return this.getFieldMapping(field) && this.getFieldMapping(field).source && this.getFieldMapping(field).value
      }
    }
  },

  methods: {
    ...mapMutations('bulk-upload', ['setFieldMapping', 'setCurrentStep', 'completeStep']),

    getPhaidraComponent(field) {
      // Get the first (and only) Phaidra element configuration for this field
      const elementConfig = this.phaidraFieldMappings[field]?.[0]
      if (!elementConfig) return 'v-text-field'
      
      return elementConfig.component || 'v-text-field'
    },

    getPhaidraProps(field) {
      // Get the first (and only) Phaidra element configuration for this field
      const elementConfig = this.phaidraFieldMappings[field]?.[0]
      if (!elementConfig) return {}
      
      const value = this.phaidraValues[field]
      // Convert object values to strings for the component props
      const displayValue = value ? (typeof value === 'object' ? value.value || '' : value) : ''
      
      return elementConfig.getProps(
        displayValue,
        (val) => this.updatePhaidraMapping(field, val),
        {
          handleRoleInput: (val) => this.handleRoleInput(field, val),
          handleFirstnameInput: (val) => this.handleFirstnameInput(field, val),
          handleLastnameInput: (val) => this.handleLastnameInput(field, val)
        }
      )
    },

    updateMapping(field, source, value) {
      if (value === null) {
        // When cleared, delete the mapping
        this.setFieldMapping({ requiredField: field, source: null, value: null })
      } else {
        this.setFieldMapping({ requiredField: field, source: source, value })
      }
    },

    // aka radio button change
    handleSourceChange(field, source) {
      // First reset the current mapping
      this.updateMapping(field, null, null)
      
      if (source === 'phaidra-field') {
        const phaidraConfig = this.phaidraFieldMappings[field]?.[0]
        if (phaidraConfig) {
          this.selectedPhaidraElement[field] = phaidraConfig.value
          const fieldObject = phaidraConfig.field()
          this.phaidraValues[field] = fieldObject
          this.updateMapping(field, source, fieldObject)
        }
      } else if (source === 'csv-column') {
        this.updateMapping(field, source, this.fieldMappings[field])
      }
    },

    handleRoleInput(field, value) {
      const currentValue = this.phaidraValues[field] || {}
      this.updatePhaidraMapping(field, { ...currentValue, role: value })
    },

    handleFirstnameInput(field, value) {
      const currentValue = this.phaidraValues[field] || {}
      this.updatePhaidraMapping(field, { ...currentValue, firstname: value })
    },

    handleLastnameInput(field, value) {
      const currentValue = this.phaidraValues[field] || {}
      this.updatePhaidraMapping(field, { ...currentValue, lastname: value })
    },

    handleTypeChange(field, value) {
      const currentValue = this.phaidraValues[field] || {}
      this.updatePhaidraMapping(field, { ...currentValue, type: value })
    },

    updatePhaidraMapping(field, value) {
      if (value) {
        this.phaidraValues[field] = value
        this.updateMapping(field, 'phaidra-field', value)
      } else {
        this.$delete(this.phaidraValues, field)
        this.updateMapping(field, null, null)
      }
    },

    proceed() {
      this.completeStep(2)
      this.setCurrentStep(3)
      this.$router.push(this.steps[3].route)
    },

    clearPhaidraValue(field) {
      this.$delete(this.phaidraValues, field)
      this.updateMapping(field, null, null)
    }
  },

  created() {
    // Initialize mappings from store and try automatic matching
    this.requiredFields.forEach(field => {
      const mapping = this.getFieldMapping(field)
      
      // Initialize mapping type to null if not set
      if (!this.selectedRadioButton[field]) {
        this.$set(this.selectedRadioButton, field, null)
      }

      if (mapping) {
        if (mapping.source === 'phaidra-field') {
          // Handle existing Phaidra mapping
          this.$set(this.selectedRadioButton, field, 'phaidra-field')
          const phaidraConfig = this.phaidraFieldMappings[field]?.[0]
          if (phaidraConfig) {
            this.selectedPhaidraElement[field] = phaidraConfig.value
            this.phaidraValues[field] = mapping.value
          }
        } else if (mapping.source === 'csv-column') {
          // Handle existing CSV mapping
          this.$set(this.selectedRadioButton, field, 'csv-column')
          const columnExists = this.columns.includes(mapping.value)
          if (columnExists) {
            this.fieldMappings[field] = mapping.value
          }
        }
      } else {
        // Try to find automatic match if no mapping exists
        const matchingColumn = this.columns.find(
          col => col.toLowerCase() === field.toLowerCase()
        )
        if (matchingColumn) {
          this.$set(this.selectedRadioButton, field, 'csv-column')
          this.fieldMappings[field] = matchingColumn
          this.updateMapping(field, 'csv-column', matchingColumn)
        }
      }
    })
  }
}
</script>

<style scoped>
.meta-data-config {
  max-width: 1200px;
  margin: 0 auto;
}

.grey-input {
  opacity: 0.6;
}

.grey-input :deep(.v-input__slot) {
  background-color: #f5f5f5 !important;
}

.source-select :deep(.v-input--radio-group__input) {
  margin: 0;
}

.highlight-column {
  background-color: #fff5e6;
  border-radius: 4px;
  position: relative;
}
</style>