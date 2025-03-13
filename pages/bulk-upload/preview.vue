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
            <v-card-text class="table-container">
              <v-simple-table fixed-header>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <template v-for="field in allFields">
                        <template v-if="isMultiField(field)">
                          <PreviewTableHeader
                            v-for="(subFieldConfig, subField) in getSubFields(field)"
                            :key="field + '-' + subField"
                            :field="field"
                            :sub-field="subField"
                            :is-required="subFieldConfig.required"
                            :is-mapped="!!getSubFieldValue(field, subField)"
                            :source-info="getSourceInfo(field, subField)"
                          />
                        </template>
                        <PreviewTableHeader
                          v-else
                          :key="field"
                          :field="field"
                          :is-required="fieldSettings[field].required"
                          :is-mapped="!!getAllFieldMappings[field]"
                          :source-info="getSourceInfo(field)"
                        />
                      </template>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, index) in previewData" :key="index">
                      <template v-for="field in allFields">
                        <template v-if="isMultiField(field)">
                          <PreviewTableCell
                            v-for="(subFieldConfig, subField) in getSubFields(field)"
                            :key="field + '-' + subField"
                            :field="field"
                            :sub-field="subField"
                            :row-data="row"
                            :is-mapped="!!getSubFieldValue(field, subField)"
                          />
                        </template>
                        <PreviewTableCell
                          v-else
                          :key="field"
                          :field="field"
                          :row-data="row"
                          :is-mapped="!!getAllFieldMappings[field]"
                        />
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
import PreviewTableHeader from '~/components/bulk-upload/PreviewTableHeader.vue'
import PreviewTableCell from '~/components/bulk-upload/PreviewTableCell.vue'
import { fieldSettings } from '~/config/bulk-upload/field-settings'

export default {
  name: 'Preview',
  
  components: {
    BulkUploadSteps,
    PreviewTableHeader,
    PreviewTableCell
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

    isMultiField(field) {
      return fieldSettings[field]?.fieldType === 'multi-field'
    },

    getSubFields(field) {
      return fieldSettings[field]?.multiFieldConfig?.fields || {}
    },

    getSubFieldValue(field, subField) {
      const mapping = this.getAllFieldMappings[field]
      if (!mapping) return null

      const valueKeys = {
        'csv-column': 'csvValue',
        'phaidra-field': 'phaidraValue'
      }
      
      if (!mapping.subFields) return null
      return mapping.subFields[subField]?.[valueKeys[mapping.source]] || null
    },

    async processPreviewData() {
      if (!this.csvContent) return

      const rows = this.csvContent.split('\n')
      const headers = this.parseCsvRow(rows[0])

      const previewRows = rows.slice(1).map(row => {
        const values = this.parseCsvRow(row)
        const rowData = {}
        
        this.allFields.forEach(field => {
          const mapping = this.getAllFieldMappings[field]
          if (!mapping) {
            rowData[field] = ''
            return
          }

          if (this.isMultiField(field)) {
            rowData[field] = {}
            Object.keys(this.getSubFields(field)).forEach(subField => {
              if (mapping.source === 'phaidra-field') {
                const subFieldConfig = fieldSettings[field].multiFieldConfig.fields[subField]
                rowData[field][subField] = subFieldConfig.phaidraDisplayValue(mapping.subFields[subField]?.phaidraValue)
              } else if (mapping.source === 'csv-column') {
                const columnName = mapping.subFields[subField]?.csvValue
                rowData[field][subField] = columnName ? values[headers.indexOf(columnName)] : ''
              }
            })
          } else {
            if (mapping.source === 'phaidra-field') {
              rowData[field] = fieldSettings[field].phaidraDisplayValue(mapping.phaidraValue)
            } else if (mapping.source === 'csv-column') {
              rowData[field] = mapping.csvValue ? values[headers.indexOf(mapping.csvValue)] : ''
            }
          }
        })
        
        return rowData
      })

      this.previewData = previewRows
    },

    parseCsvRow(row) {
      return row.split(';').map(v => v.trim().replace(/["']/g, ''))
    },

    getSourceInfo(field, subField = null) {
      const fieldMapping = this.getAllFieldMappings[field]
      if (!fieldMapping) return null

      const mapping = subField ? fieldMapping.subFields?.[subField] : fieldMapping
      if (!mapping) return null

      return fieldMapping.source === 'csv-column'
        ? mapping.csvValue ? `Sourced from CSV column "${mapping.csvValue}"` : null
        : mapping.phaidraValue ? 'Default value sourced from Phaidra' : null
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