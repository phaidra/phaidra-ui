<template>
  <v-container class="csv-config">
    <BulkUploadSteps />
    <v-row>
      <v-col>
        <h1 class="text-h4">Step 1: Load CSV File</h1>
      </v-col>
    </v-row>

    <!-- File Upload Section -->
    <v-row class="mt-4">
      <v-col cols="12" md="6">
        <template v-if="savedFileName">
          <v-card outlined class="pa-4">
            <div class="d-flex align-center">
              <v-icon left color="primary">mdi-file-document-outline</v-icon>
              <span class="text-body-1">{{ savedFileName }}</span>
              <v-spacer></v-spacer>
              <v-btn
                text
                color="primary"
                @click="showFileInput = true"
              >
                Change File
              </v-btn>
            </div>
          </v-card>
          <v-expand-transition>
            <div v-show="showFileInput">
              <div class="d-flex align-center">
                <v-file-input
                  v-model="csvFile"
                  accept=".csv"
                  label="Select New CSV File"
                  outlined
                  class="mt-4 flex-grow-1"
                  @change="handleFileUpload"
                  :error-messages="errorMessage"
                  persistent-hint
                  :clearable="false"
                ></v-file-input>
                <v-btn
                  text
                  color="grey"
                  class="mt-4 ml-2"
                  @click="showFileInput = false"
                >
                  Cancel
                </v-btn>
              </div>
            </div>
          </v-expand-transition>
        </template>
        <v-file-input
          v-else
          v-model="csvFile"
          accept=".csv"
          label="Select CSV File"
          outlined
          @change="handleFileUpload"
          :error-messages="errorMessage"
          persistent-hint
          :clearable="false"
        ></v-file-input>
      </v-col>
    </v-row>

    <!-- Preview Section -->
    <v-row v-if="$store.state['bulk-upload'].columns.length">
      <v-col cols="12">
        <v-card outlined class="pa-4">
          <div class="d-flex align-center mb-4">
            <h3 class="text-h6 mb-0 mr-4">
              CSV Columns of "{{ savedFileName }}"
            </h3>
          </div>
          <v-chip
            v-for="column in $store.state['bulk-upload'].columns"
            :key="column"
            class="mr-2 mb-2"
            color="primary"
            outlined
          >
            {{ column }}
          </v-chip>
        </v-card>
      </v-col>
    </v-row>

    <!-- Navigation -->
    <v-row justify="end" class="mt-4">
      <v-col cols="auto">
        <v-btn
          color="primary"
          @click="$router.push('/bulk-upload/meta-data-config')"
          :disabled="!isValid"
        >
          Next
          <v-icon right>mdi-arrow-right</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import BulkUploadSteps from '~/components/BulkUploadSteps.vue'

export default {
  name: 'CsvConfig',
  components: {
    BulkUploadSteps
  },
  middleware: 'bulk-upload',

  data() {
    return {
      errorMessage: '',
      showFileInput: false,
    }
  },

  computed: {
    isValid() {
      return this.$store.state['bulk-upload'].columns.length > 0
    },
    savedFileName() {
      return this.$store.state['bulk-upload'].fileName
    },
    csvFile: {
      get() {
        return this.$store.state['bulk-upload'].csvContent
      },
      set(value) {
        if (!value) {
          this.$store.commit('bulk-upload/setCsvContent', null)
          this.$store.commit('bulk-upload/setColumns', [])
          this.$store.commit('bulk-upload/setFileName', '')
        }
      }
    }
  },

  methods: {
    async handleFileUpload(file) {
      if (!file) {
        this.errorMessage = ''
        return
      }

      try {
        const text = await this.readFileContent(file)
        const firstLine = text.split('\n')[0]
        const columns = firstLine
          .split(';')
          .map(col => col.trim().replace(/["']/g, '')) // Remove quotes and trim whitespace
          .filter(col => col !== '') // Remove empty columns
        
        if (columns.length === 0) {
          throw new Error('No valid columns found in the CSV file')
        }

        this.currentFileName = file.name
        
        // Store the CSV content and filename in Vuex
        this.$store.commit('bulk-upload/setCsvContent', text)
        this.$store.commit('bulk-upload/setColumns', columns)
        this.$store.commit('bulk-upload/setFileName', file.name)
        this.$store.commit('bulk-upload/completeStep', 1)
        this.errorMessage = ''
      } catch (error) {
        this.errorMessage = 'Error reading CSV file. Please make sure it\'s a valid CSV file.'
        console.error('Error reading CSV:', error)
      }
    },

    readFileContent(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (event) => resolve(event.target.result)
        reader.onerror = (error) => reject(error)
        reader.readAsText(file)
      })
    }
  }
}
</script>

<style scoped>
.csv-config {
  max-width: 1200px;
  margin: 0 auto;
}
</style>