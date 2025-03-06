<template>
  <v-container class="preview">
    <BulkUploadSteps />
    <v-row>
      <v-col>
        <h1 class="text-h4">Step 3: Data Preview</h1>
      </v-col>
    </v-row>

    <template v-if="isInitialized">
      <v-row>
        <v-col>
          <v-card outlined>
            <v-card-title>Preview (scroll right to view all columns)</v-card-title>
            <v-card-text class="table-container">
              <v-simple-table fixed-header>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <template v-for="field in allFields">
                        <!-- Handle multi-fields -->
                        <template v-if="fieldSettings[field].fieldType === 'multi-field'">
                          <th 
                            v-for="(subFieldConfig, subField) in fieldSettings[field].multiFieldConfig.fields"
                            :key="field + '-' + subField"
                            class="text-left"
                          >
                            <div class="d-flex align-center">
                              {{ field }}: {{ subField }}{{ subFieldConfig.required ? '*' : '' }}
                              <v-tooltip bottom dark>
                                <template v-slot:activator="{ on, attrs }">
                                  <v-icon 
                                    x-small 
                                    class="ml-1"
                                    :class="{ 'grey--text': !getSubFieldMapping(field, subField) }"
                                    v-bind="attrs"
                                    v-on="on"
                                  >
                                    mdi-information
                                  </v-icon>
                                </template>
                                {{ getSourceInfo(field, subField) || 'Not sourced (optional)' }}
                              </v-tooltip>
                            </div>
                          </th>
                        </template>
                        <!-- Handle single fields -->
                        <th 
                          v-else
                          :key="field"
                          class="text-left"
                        >
                          <div class="d-flex align-center">
                            {{ field }}{{ fieldSettings[field].required ? '*' : '' }}
                            <v-tooltip bottom dark>
                              <template v-slot:activator="{ on, attrs }">
                                <v-icon 
                                  x-small 
                                  class="ml-1"
                                  :class="{ 'grey--text': !getAllFieldMappings[field] }"
                                  v-bind="attrs"
                                  v-on="on"
                                >
                                  mdi-information
                                </v-icon>
                              </template>
                              {{ getSourceInfo(field) || 'Not sourced (optional)' }}
                            </v-tooltip>
                          </div>
                        </th>
                      </template>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, index) in previewData" :key="index">
                      <template v-for="field in allFields">
                        <!-- Handle multi-fields -->
                        <template v-if="fieldSettings[field].fieldType === 'multi-field'">
                          <td 
                            v-for="(subFieldConfig, subField) in fieldSettings[field].multiFieldConfig.fields"
                            :key="field + '-' + subField"
                            :class="{ 'grey--text': !getSubFieldMapping(field, subField) }"
                          >
                            {{ row[field]?.[subField] || '-' }}
                          </td>
                        </template>
                        <!-- Handle single fields -->
                        <td 
                          v-else
                          :key="field"
                          :class="{ 'grey--text': !getAllFieldMappings[field] }"
                        >
                          {{ row[field] || '-' }}
                        </td>
                      </template>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Navigation -->
      <v-row justify="space-between" class="mt-4">
        <v-col cols="auto">
          <v-btn
            text
            :to="steps[2].route"
          >
            <v-icon left>mdi-arrow-left</v-icon>
            Back
          </v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn
            color="primary"
            @click="proceed"
            :to="steps[4].route"
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

export default {
  name: 'Preview',
  components: {
    BulkUploadSteps
  },
  middleware: 'bulk-upload',

  data() {
    return {
      fieldSettings,
      previewData: [],
      isInitialized: false
    }
  },

  computed: {
    ...mapState('bulk-upload', ['steps', 'csvContent']),
    ...mapGetters('bulk-upload', ['getAllFieldMappings', 'allFields'])
  },

  async created() {
    // Wait for store initialization on client side
    if (process.client && this.$store.$initBulkUpload) {
      await this.$store.$initBulkUpload()
    }
    
    await this.processPreviewData()
    this.isInitialized = true
  },

  methods: {
    ...mapMutations('bulk-upload', ['completeStep', 'setCurrentStep']),

    getSubFieldMapping(field, subField) {
      const mapping = this.getAllFieldMappings[field]
      if (!mapping) return null

      const valueKeys = {
        'csv-column': 'csvValue',
        'phaidra-field': 'phaidraValue'
      }
      
      // For single fields
      if (!subField) {
        return mapping[valueKeys[mapping.source]] || null
      }
      
      // For multi-fields
      if (fieldSettings[field]?.fieldType === 'multi-field') {
        if (!mapping.subFields) return null
        return mapping.subFields[subField]?.[valueKeys[mapping.source]] || null
      }
      
      return null
    },

    async processPreviewData() {
      if (!this.csvContent) return

      const rows = this.csvContent.split('\n')
      const headers = rows[0].split(';').map(h => h.trim().replace(/["']/g, ''))

      const previewRows = rows.map(row => {
        const values = row.split(';').map(v => v.trim().replace(/["']/g, ''))
        const rowData = {}
        
        // Process all fields from fieldSettings
        this.allFields.forEach(field => {
          const mapping = this.getAllFieldMappings[field]
          if (!mapping) {
            rowData[field] = ''
          } else if (mapping.source === 'phaidra-field') {
            if (field === "License") {
              rowData[field] = mapping.phaidraValue?.["@id"] || ''
            }
            else if (field === "Type") {
              rowData[field] = mapping.phaidraValue?.["skos:prefLabel"]?.["eng"] || ''
            }
            else if (fieldSettings[field]?.fieldType === 'multi-field') {
              rowData[field] = {}
              Object.keys(fieldSettings[field].multiFieldConfig.fields).forEach(subField => {
                if (!mapping.subFields) {
                  rowData[field][subField] = ''
                } else if (subField === "Role") {
                  rowData[field][subField] = mapping.subFields[subField]?.phaidraValue?.["skos:prefLabel"]?.["eng"] || ''
                }
                else {
                  rowData[field][subField] = mapping.subFields[subField]?.phaidraValue || ''
                }
              })
            }
            else {
              rowData[field] = mapping.phaidraValue || ''
            }
          } else if (mapping.source === 'csv-column') {
            if (fieldSettings[field]?.fieldType === 'multi-field') {
              rowData[field] = {}
              Object.keys(fieldSettings[field].multiFieldConfig.fields).forEach(subField => {
                if (!mapping.subFields) {
                  rowData[field][subField] = ''
                } else {
                  const subMapping = mapping.subFields[subField]
                  if (subMapping?.csvValue) {
                    const columnIndex = headers.indexOf(subMapping.csvValue)
                    rowData[field][subField] = columnIndex >= 0 ? values[columnIndex] : ''
                  } else {
                    rowData[field][subField] = ''
                  }
                }
              })
            } else {
              const columnIndex = headers.indexOf(mapping.csvValue)
              rowData[field] = columnIndex >= 0 ? values[columnIndex] : ''
            }
          }
        })
        
        return rowData
      })

      this.previewData = previewRows
    },

    getSourceInfo(field, subField = null) {
      const mapping = this.getAllFieldMappings[field]
      if (!mapping) return null
      
      if (mapping.source === 'phaidra-field') {
        return 'Default value sourced from Phaidra'
      }
      else if (mapping.source === 'csv-column') {
        if (fieldSettings[field]?.fieldType === 'multi-field' && subField) {
          if (!mapping.subFields) return null
          const subMapping = mapping.subFields[subField]
          return subMapping?.csvValue ? `Sourced from CSV column: ${subMapping.csvValue}` : null
        }
        else {
          return mapping.csvValue ? `Sourced from CSV column: ${mapping.csvValue}` : null
        }
      }
      return null
    },

    proceed() {
      this.completeStep(3)
      this.setCurrentStep(4)
      this.$router.push(this.steps[4].route)
    }
  }
}
</script>

<style scoped>
.preview {
  max-width: 1200px;
  margin: 0 auto;
}

.table-container {
  max-height: 452px;
  overflow-y: auto;
}
</style>