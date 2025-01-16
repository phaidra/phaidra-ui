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
        <v-card>
          <v-card-title>Data Preview</v-card-title>
          <v-card-text>
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th v-for="field in mappedFields" :key="field" class="text-left">
                      {{ field }} (CSV: {{ getSourceColumn(field) }})
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
    ...mapGetters('bulk-upload', ['getMappedFields', 'getFieldMapping']),

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
        
        // Map only the fields that were selected in step 2
        this.mappedFields.forEach(field => {
          const csvColumn = this.getFieldMapping(field)
          const columnIndex = headers.indexOf(csvColumn)
          rowData[field] = columnIndex >= 0 ? values[columnIndex] : ''
        })
        
        return rowData
      })

      this.previewData = previewRows
    },

    getSourceColumn(field) {
      return this.getFieldMapping(field)
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