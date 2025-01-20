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
              <v-col cols="2">
                <h4>Source from your CSV</h4>
                <div class="caption text-grey">every entry gets its value from your csv file</div>
              </v-col>
              <v-col cols="1" class="text-center">
                OR
              </v-col>
              <v-col cols="6">
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
                  v-if="getFieldMapping(field)"
                  color="success"
                  small
                  class="ml-2"
                >
                  mdi-check-circle
                </v-icon>
              </v-col>

              <!-- CSV Source -->
              <v-col cols="2">
                <v-select
                  v-model="fieldMappings[field]"
                  :items="getAvailableColumns(field)"
                  outlined
                  dense
                  clearable
                  :label="'Select CSV column'"
                  @change="updateMapping(field, $event)"
                  hide-details
                  :disabled="!!selectedPhaidraElement[field]"
                  :class="{ 'grey-input': !!selectedPhaidraElement[field] }"
                ></v-select>
              </v-col>

              <v-col cols="1" class="text-center">
                OR
              </v-col>

              <!-- Phaidra Elements -->
              <v-col cols="2">
                <v-select
                  v-if="fieldPhaidraElements[field]"
                  v-model="selectedPhaidraElement[field]"
                  :items="fieldPhaidraElements[field]"
                  outlined
                  dense
                  clearable
                  :label="'Select Phaidra element'"
                  @change="handlePhaidraElementChange(field, $event)"
                  hide-details
                  :disabled="!!fieldMappings[field]"
                  :class="{ 'grey-input': !!fieldMappings[field] }"
                ></v-select>
              </v-col>
              <v-col cols="4">
                <div class="d-flex align-center">
                  <component
                    v-if="selectedPhaidraElement[field]"
                    :is="getPhaidraComponent(field)"
                    v-bind="getPhaidraProps(field)"
                    :class="{ 'grey-input': !!fieldMappings[field], 'flex-grow-1': true }"
                  ></component>
                  <v-select
                    v-else
                    disabled
                    outlined
                    dense
                    :label="'Select value'"
                    hide-details
                    :class="{ 'grey-input': true, 'flex-grow-1': true }"
                  ></v-select>
                  <v-btn
                    v-if="selectedPhaidraElement[field] && phaidraValues[field]"
                    icon
                    small
                    class="ml-2"
                    @click="clearPhaidraValue(field)"
                    :disabled="!!fieldMappings[field]"
                  >
                    <v-icon small>mdi-close</v-icon>
                  </v-btn>
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
import { context } from "../../mixins/context"
import { config } from "../../mixins/config"
import { vocabulary } from "phaidra-vue-components/src/mixins/vocabulary";
import fieldslib from "phaidra-vue-components/src/utils/fields"
import jsonld from "phaidra-vue-components/src/utils/json-ld"
import SelectLanguage from 'phaidra-vue-components/src/components/select/SelectLanguage'

export default {
  name: 'MetaDataConfig',

  components: {
    SelectLanguage,
    BulkUploadSteps,
  },

  mixins: [context, config, vocabulary],

  data() {
    return {
      fieldMappings: {},
      mappingType: {},
      selectedPhaidraElement: {},
      phaidraValues: {},
      mappingTypes: [
        { text: 'CSV Column', value: 'csv' },
        { text: 'Phaidra UI Element', value: 'phaidra' }
      ],
      // Define available Phaidra elements for each field
      fieldPhaidraElements: {
        'Title': [
          { text: 'Title', value: 'title', field: () => {
            const field = fieldslib.getField("title")
            field.multilingual = false
            return field
          }}
        ],
        'Role': [
          { text: 'Author', value: 'role:aut', field: () => {
            const field = fieldslib.getField("role")
            field.ordergroup = "role"
            field.roleVocabulary = "submitrolepredicate"
            field.identifierType = "ids:orcid"
            field.showDefinitions = true
            field.showIdentifier = true
            field.multilingual = false
            return field
          }}
        ],
        'Description': [
          { text: 'Description', value: 'description', field: () => {
            const field = fieldslib.getField("description")
            field.multilingual = false
            return field
          }}
        ],
        'Keywords': [
          { text: 'Keywords', value: 'keyword', field: () => {
            const field = fieldslib.getField("keyword")
            field.disableSuggest = true
            field.multilingual = false
            return field
          }}
        ],
        'Type': [
          { text: 'Object Type', value: 'object-type', field: () => {
            const field = fieldslib.getField("object-type-checkboxes")
            field.showLabel = true
            field.multilingual = false
            return field
          }}
        ],
        'Persistent identifier': [
          { text: 'Identifier', value: 'identifier', field: () => {
            const field = fieldslib.getField("alternate-identifier")
            field.multilingual = false
            return field
          }}
        ],
        'License': [
          { text: 'License', value: 'license', field: () => {
            const field = fieldslib.getField("license")
            field.showValueDefinition = true
            field.vocabulary = "alllicenses"
            field.multilingual = false
            return field
          }}
        ]
      }
    }
  },

  computed: {
    ...mapState('bulk-upload', ['columns', 'steps', 'requiredFields']),
    ...mapGetters('bulk-upload', ['getFieldMapping']),

    allFieldsMapped() {
      return this.requiredFields.every(field => {
        if (this.mappingType[field] === 'csv') {
          return this.fieldMappings[field]
        } else if (this.mappingType[field] === 'phaidra') {
          return this.phaidraValues[field]
        }
        return false
      })
    },

    // Get available columns for a specific field
    getAvailableColumns() {
      return (currentField) => {
        // Get all currently selected values except for the current field
        const selectedValues = Object.entries(this.fieldMappings)
          .filter(([field]) => field !== currentField)
          .map(([_, value]) => value)
        
        // Return only columns that aren't selected in other fields, sorted alphabetically
        return this.columns
          .filter(col => !selectedValues.includes(col))
          .sort((a, b) => a.localeCompare(b))
      }
    }
  },

  methods: {
    ...mapMutations('bulk-upload', ['setFieldMapping', 'setCurrentStep', 'completeStep']),

    getPhaidraComponent(field) {
      const elementConfig = this.fieldPhaidraElements[field].find(e => e.value === this.selectedPhaidraElement[field])
      if (!elementConfig) return null
      
      const fieldConfig = elementConfig.field()
      // Map field types to their corresponding Phaidra input components
      const componentMap = {
        'title': 'PITitle',
        'role': 'PIRole',
        'description': 'PIDescription',
        'keyword': 'PIKeyword',
        'object-type-checkboxes': 'PIObjectType',
        'language': 'PILanguage',
        'license': 'PISelect',
        'alternate-identifier': 'PIIdentifier'
      }
      
      return componentMap[fieldConfig.component] || componentMap[elementConfig.value] || 'v-text-field'
    },

    getPhaidraProps(field) {
      const elementConfig = this.fieldPhaidraElements[field].find(e => e.value === this.selectedPhaidraElement[field])
      if (!elementConfig) return {}
      
      const fieldConfig = elementConfig.field()
      // Common props for all components
      const props = {
        value: this.phaidraValues[field],
        label: fieldConfig.label || field,
        field: fieldConfig,
        outlined: true,
        dense: true,
        'hide-details': true,
        input: (val) => this.updatePhaidraMapping(field, val)
      }

      // Add specific props based on field type
      switch (elementConfig.value) {
        case 'role':
          return {
            ...props,
            roleVocabulary: fieldConfig.roleVocabulary,
            identifierType: fieldConfig.identifierType,
            showIdentifier: fieldConfig.showIdentifier,
            showDefinitions: fieldConfig.showDefinitions
          }
        case 'license':
          return {
            ...props,
            showValueDefinition: true,
            vocabulary: 'alllicenses',
            predicate: 'edm:rights',
            field: {
              ...fieldConfig,
              vocabulary: 'alllicenses',
              showValueDefinition: true,
              predicate: 'edm:rights'
            }
          }
        case 'keyword':
          return {
            ...props,
            disableSuggest: fieldConfig.disableSuggest
          }
        case 'object-type-checkboxes':
          return {
            ...props,
            resourceType: fieldConfig.resourceType,
            showLabel: fieldConfig.showLabel
          }
        default:
          return props
      }
    },

    updateMapping(field, value) {
      if (value === null) {
        // When cleared, delete the mapping from both local state and store
        this.$delete(this.fieldMappings, field)
        this.setFieldMapping({ requiredField: field, csvColumn: null })
      } else {
        this.setFieldMapping({ requiredField: field, csvColumn: value })
      }
    },

    handleMappingTypeChange(field) {
      // Clear existing mappings when switching types
      this.$delete(this.fieldMappings, field)
      this.$delete(this.phaidraValues, field)
      this.$delete(this.selectedPhaidraElement, field)
      this.setFieldMapping({ requiredField: field, csvColumn: null })
    },

    handlePhaidraElementChange(field, value) {
      // Clear existing value when changing Phaidra element
      this.$delete(this.phaidraValues, field)
      this.setFieldMapping({ requiredField: field, csvColumn: null })
      
      // If the element selection was cleared (value is null), clear the element selection too
      if (!value) {
        this.$delete(this.selectedPhaidraElement, field)
      }
    },

    updatePhaidraMapping(field, value) {
      if (value) {
        this.phaidraValues[field] = value
        // Get the field configuration
        const elementConfig = this.fieldPhaidraElements[field].find(e => e.value === this.selectedPhaidraElement[field])
        const fieldConfig = elementConfig.field()
        
        // Store the mapping with field-specific configuration
        this.setFieldMapping({ 
          requiredField: field, 
          csvColumn: `phaidra:${fieldConfig.predicate || this.selectedPhaidraElement[field]}:${value}` 
        })
      } else {
        this.$delete(this.phaidraValues, field)
        this.setFieldMapping({ requiredField: field, csvColumn: null })
      }
    },

    proceed() {
      this.completeStep(2)
      this.setCurrentStep(3)
      this.$router.push(this.steps[3].route)
    },

    clearPhaidraValue(field) {
      this.$delete(this.phaidraValues, field)
      this.setFieldMapping({ requiredField: field, csvColumn: null })
    }
  },

  created() {
    // Initialize mappings from store and try automatic matching
    this.requiredFields.forEach(field => {
      const mapping = this.getFieldMapping(field)
      if (mapping) {
        if (mapping.startsWith('phaidra:')) {
          // Handle Phaidra mapping
          const [_, element, value] = mapping.split(':')
          this.mappingType[field] = 'phaidra'
          this.selectedPhaidraElement[field] = element
          this.phaidraValues[field] = value
        } else {
          // Handle CSV mapping
          this.mappingType[field] = 'csv'
          this.fieldMappings[field] = mapping
        }
      } else {
        // Try to find automatic match if no mapping exists
        const matchingColumn = this.columns.find(
          col => col.toLowerCase() === field.toLowerCase()
        )
        if (matchingColumn) {
          this.fieldMappings[field] = matchingColumn
          this.setFieldMapping({ requiredField: field, csvColumn: matchingColumn })
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
</style>