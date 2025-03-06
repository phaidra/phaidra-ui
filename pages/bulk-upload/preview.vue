<template>
  <v-container class="preview">
    <BulkUploadSteps />
    <v-row>
      <v-col>
        <h1 class="text-h4">Step 3: Data Validation</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-card outlined>
          <v-card-title>Data Preview</v-card-title>
          <v-card-text>
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th v-for="field in allFields" :key="field" class="text-left">
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
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, index) in previewData" :key="index">
                    <td 
                      v-for="field in allFields" 
                      :key="field"
                      :class="{ 'grey--text': !getAllFieldMappings[field] }"
                    >
                      {{ row[field] || '-' }}
                    </td>
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
      previewData: []
    }
  },

  computed: {
    ...mapState('bulk-upload', ['steps', 'csvContent']),
    ...mapGetters('bulk-upload', ['getAllFieldMappings', 'allFields'])
  },

  created() {
    this.processPreviewData()
  },

  methods: {
    ...mapMutations('bulk-upload', ['completeStep', 'setCurrentStep']),

    processPreviewData() {
      if (!this.csvContent) return

      const rows = this.csvContent.split('\n')
      const headers = rows[0].split(';').map(h => h.trim().replace(/["']/g, ''))
      
      // Process only first 5 rows for preview
      const previewRows = rows.slice(1, 6).map(row => {
        const values = row.split(';').map(v => v.trim().replace(/["']/g, ''))
        const rowData = {}
        
        // Process all fields from fieldSettings
        this.allFields.forEach(field => {
          const mapping = this.getAllFieldMappings[field]
          if (!mapping) {
            rowData[field] = ''
          } else if (mapping.source === 'phaidra-field') {
            if (field === "License") {
              rowData[field] = mapping.phaidraValue["@id"]
            }
            else if (field === "Type") {
              rowData[field] = mapping.phaidraValue["skos:prefLabel"]["eng"]
            }
            else {
              rowData[field] = mapping.phaidraValue
            }
          } else if (mapping.source === 'csv-column') {
            const columnIndex = headers.indexOf(mapping.csvValue)
            rowData[field] = columnIndex >= 0 ? values[columnIndex] : ''
          }
        })
        
        return rowData
      })

      this.previewData = previewRows
    },

    getSourceInfo(field) {
      const mapping = this.getAllFieldMappings[field]
      if (!mapping) return null
      
      if (mapping.source === 'phaidra-field') {
        return 'Default value sourced from Phaidra'
      }
      return 'Sourced from CSV column: ' + mapping.csvValue
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
</style>