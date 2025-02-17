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
                    <th v-for="field in mappedFields" :key="field" class="text-left">
                      {{ field }} ({{ getSourceColumn(field) }})
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, index) in previewData" :key="index">
                    <td v-for="field in mappedFields" :key="field">
                      {{ row[field] }}
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

export default {
  name: 'Preview',
  components: {
    BulkUploadSteps
  },
  middleware: 'bulk-upload',

  data() {
    return {
      fieldMappings: {},
      previewData: []
    }
  },

  computed: {
    ...mapState('bulk-upload', ['steps', 'csvContent']),
    ...mapGetters('bulk-upload', ['getMappedFields', 'getAllFieldMappings']),

    mappedFields() {
      return this.getMappedFields
    },
    isValid() {
      return this.previewData.length > 0
    }
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
        
        // Map fields based on whether they come from CSV or are Phaidra values
        this.mappedFields.forEach(field => {
          const mapping = this.getAllFieldMappings[field]
          if (!mapping) {
            rowData[field] = ''
          } else if (mapping.source === 'phaidra-field') {
            if (field == "License") {
              rowData[field] = mapping.phaidraValue["@id"]
            }
            else if (field == "Type") {
              rowData[field] = mapping.phaidraValue["skos:prefLabel"]["eng"]
            }
            else {
              // For Phaidra values, use the phaidraValue
              rowData[field] = mapping.phaidraValue
            }
          } else if (mapping.source === 'csv-column') {
            // For CSV mappings, get the value from the corresponding column
            const columnIndex = headers.indexOf(mapping.csvValue)
            rowData[field] = columnIndex >= 0 ? values[columnIndex] : ''
          }
        })
        
        return rowData
      })

      this.previewData = previewRows
    },

    getSourceColumn(field) {
      const mapping = this.getAllFieldMappings
      if (mapping[field]?.source === 'phaidra-field') {
        return 'Phaidra: ' + mapping[field].phaidraValue
      }
      else if (mapping[field]?.source === 'csv-column') {
        return 'CSV: ' + mapping[field].csvValue
      }
      return ''
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