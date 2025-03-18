<template>
  <v-container class="upload">
    <BulkUploadSteps />
    <v-row>
      <v-col>
        <h1 class="text-h4">Step 4: Upload</h1>
        <p class="text-subtitle-1 mt-2">
          Upload your data to PHAIDRA. You can close the page and return later to resume any interrupted uploads.
        </p>
      </v-col>
    </v-row>

    <div class="position-relative">
      <LoginOverlay :is-logged-in="isLoggedIn" />
      <CompletionOverlay
        :is-complete="isComplete"
        @start-new="startNewBulkUpload"
      />

      <!-- Progress Overview -->
      <v-row class="mt-4">
        <v-col cols="12">
          <v-card outlined>
            <v-card-text>
              <!-- File Selection -->
              <div class="d-flex align-center justify-space-between mb-4">
                <div>
                  <span class="text-h6">Files</span>
                </div>
                <div class="d-flex align-center">
                  <v-file-input
                    v-model="selectedFiles"
                    multiple
                    chips
                    show-size
                    counter
                    label="Select Files"
                    outlined
                    dense
                    class="max-w-500"
                    :error-messages="fileError"
                    @change="handleFileSelection"
                  ></v-file-input>
                </div>
              </div>

              <div class="d-flex align-center justify-space-between mb-2">
                <div>
                  <span class="text-h6">Upload Progress</span>
                </div>
                <div class="d-flex align-center">
                  <v-chip class="mr-2" color="success" outlined>
                    {{ uploadProgress.completed }} Completed
                  </v-chip>
                  <v-chip class="mr-2" color="error" outlined>
                    {{ uploadProgress.failed }} Failed
                  </v-chip>
                  <v-chip color="primary" outlined>
                    {{ uploadProgress.total - (uploadProgress.completed) }} Remaining
                  </v-chip>
                </div>
              </div>
              <v-progress-linear
                :value="(uploadProgress.completed) / Math.max(1, uploadProgress.total) * 100"
                height="20"
                color="primary"
                striped
              >
                <template v-slot:default>
                  {{ Math.round((uploadProgress.completed) / Math.max(1, uploadProgress.total) * 100) }}%
                </template>
              </v-progress-linear>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Upload Table -->
      <v-row class="mt-4">
        <v-col cols="12">
          <v-card outlined>
            <v-card-text>
              <v-data-table
                :headers="headers"
                :items="tableData"
                :items-per-page="10"
                class="elevation-1"
              >
                <template v-slot:item.status="{ item }">
                  <v-chip
                    :color="getStatusColor(item.status)"
                    small
                  >
                    {{ item.status }}
                  </v-chip>
                </template>

                <template v-slot:item.actions="{ item }">
                  <template v-if="item.status === 'error'">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          icon
                          small
                          color="error"
                          v-bind="attrs"
                          v-on="on"
                          @click="showError(item)"
                        >
                          <v-icon small>mdi-alert-circle</v-icon>
                        </v-btn>
                      </template>
                      <span>View Error</span>
                    </v-tooltip>
                    <v-btn
                      icon
                      small
                      class="ml-2"
                      @click="retryUpload(item.index)"
                    >
                      <v-icon small>mdi-refresh</v-icon>
                    </v-btn>
                  </template>
                  <template v-else-if="item.status === 'completed'">
                    <v-btn
                      icon
                      small
                      :href="getObjectUrl(item.pid)"
                      target="_blank"
                    >
                      <v-icon small>mdi-open-in-new</v-icon>
                    </v-btn>
                  </template>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Navigation -->
    <v-row justify="space-between" class="mt-4">
      <v-col cols="auto">
        <v-btn
          :disabled="isUploading || isComplete"
          text
          :to="steps[3].route"
        >
          <v-icon left>mdi-arrow-left</v-icon>
          Back
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn
          color="primary"
          :loading="isUploading"
          :disabled="!isLoggedIn || isUploading || isComplete"
          @click="startUpload"
        >
          <template v-if="hasFailedUploads">
            Retry Failed Uploads
          </template>
          <template v-else>
            Start Upload
          </template>
          <v-icon right>mdi-cloud-upload</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <!-- Error Dialog -->
    <v-dialog
      v-model="errorDialog.show"
      max-width="500"
    >
      <v-card>
        <v-card-title>Upload Error</v-card-title>
        <v-card-text>
          <p class="mb-2"><strong>Row:</strong> {{ errorDialog.row }}</p>
          <p class="mb-0"><strong>Error:</strong> {{ errorDialog.error }}</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="errorDialog.show = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import BulkUploadSteps from '~/components/BulkUploadSteps.vue'
import LoginOverlay from '~/components/bulk-upload/LoginOverlay.vue'
import CompletionOverlay from '~/components/bulk-upload/CompletionOverlay.vue'
import { context } from "../../mixins/context"
import { config } from "../../mixins/config"
import fieldslib from "phaidra-vue-components/src/utils/fields"
import jsonld from "phaidra-vue-components/src/utils/json-ld"
import { fieldSettings } from '~/config/bulk-upload/field-settings'

export default {
  name: 'Upload',
  components: {
    BulkUploadSteps,
    LoginOverlay,
    CompletionOverlay
  },
  mixins: [context, config],
  middleware: 'bulk-upload',

  data() {
    return {
      fieldSettings,
      headers: [
        { text: 'Row', value: 'index' },
        { text: 'Title', value: 'title' },
        { text: 'Filename', value: 'filename' },
        { text: 'Status', value: 'status' },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      isUploading: false,
      selectedFiles: [],
      fileError: '',
      errorDialog: {
        show: false,
        row: null,
        error: null
      }
    }
  },

  computed: {
    ...mapState('bulk-upload', ['steps', 'csvContent', 'fieldMappings']),
    ...mapGetters('bulk-upload', ['getUploadState', 'getUploadProgress', 'isUploadComplete']),

    uploadProgress() {
      return this.$store.getters['bulk-upload/getUploadProgress']
    },

    isComplete() {
      return this.$store.getters['bulk-upload/isUploadComplete']
    },

    hasFailedUploads() {
      return this.uploadProgress.failed > 0
    },

    tableData() {
      if (!this.csvContent) return []

      const rows = this.csvContent.split('\n')
      const headers = rows[0].split(';').map(h => h.trim()).filter(Boolean)
      
      return rows.slice(1)
        .filter(row => row && row.trim()) // Skip empty rows
        .map((row, index) => {
          const values = row.split(';').map(v => v.trim())
          const uploadState = this.getUploadState(index)
          
          // Get title and filename from mapping
          const titleMapping = this.fieldMappings['Title']
          const filenameMapping = this.fieldMappings['Filename']
          
          const title = titleMapping?.source === 'phaidra-field' 
            ? titleMapping.phaidraValue
            : titleMapping?.source === 'csv-column'
              ? values[headers.indexOf(titleMapping.csvValue)] || 'No title'
              : 'No title'
              
          const filename = filenameMapping?.source === 'phaidra-field'
            ? filenameMapping.phaidraValue
            : filenameMapping?.source === 'csv-column'
              ? values[headers.indexOf(filenameMapping.csvValue)]
              : null

          return {
            index: index + 1,
            title,
            filename,
            status: uploadState.status,
            pid: uploadState.pid,
            error: uploadState.error
          }
        })
    },

    isLoggedIn() {
      return this.user && this.user.username
    }
  },

  methods: {
    ...mapMutations('bulk-upload', [
      'setUploadState',
      'setUploadProgress',
      'clearUploadState',
      'completeStep',
      'hardResetState'
    ]),

    getStatusColor(status) {
      switch (status) {
        case 'completed': return 'success'
        case 'error': return 'error'
        case 'uploading': return 'primary'
        default: return 'grey'
      }
    },

    getObjectUrl(pid) {
      return pid ? `http://localhost:8899/${pid}` : '#'
    },

    showError(item) {
      this.errorDialog = {
        show: true,
        row: item.index,
        error: item.error
      }
    },

    async startUpload() {
      if (this.isUploading) return

      this.isUploading = true
      const rows = this.csvContent?.split('\n') || []
      const headers = rows[0].split(';').map(h => h.trim()).filter(Boolean)
      
      // Filter out empty rows
      const validRows = rows.slice(1).filter(row => row && row.trim())

      // Initialize progress
      this.setUploadProgress({
        total: validRows.length,
        completed: this.uploadProgress.completed,
        failed: this.uploadProgress.failed
      })

      // Process each row
      for (let i = 0; i < validRows.length; i++) {
        const rowIndex = i
        const uploadState = this.getUploadState(rowIndex)

        // Skip if already completed
        if (uploadState.status === 'completed') continue

        try {
          this.setUploadState({ rowIndex, status: 'uploading', pid: null, error: null })
          const values = validRows[i].split(';').map(v => v.trim())
          
          // Create form data for upload
          const formData = await this.createFormData(headers, values)
          
          // Upload to PHAIDRA
          const response = await this.$axios.request({
            method: 'POST',
            url: `http://localhost:8899/api/picture/create`,
            headers: {
              'Content-Type': 'multipart/form-data',
              'X-XSRF-TOKEN': this.user.token
            },
            data: formData
          })

          if (response.data.status === 200 && response.data.pid) {
            this.setUploadState({ 
              rowIndex, 
              status: 'completed', 
              pid: response.data.pid, 
              error: null 
            })
            this.setUploadProgress({
              ...this.uploadProgress,
              completed: this.uploadProgress.completed + 1
            })
          } else {
            throw new Error('Upload failed: No PID received')
          }
        } catch (error) {
          console.error('Upload error:', error)
          this.setUploadState({ 
            rowIndex, 
            status: 'error', 
            pid: null, 
            error: error.message || 'Unknown error occurred' 
          })
          this.setUploadProgress({
            ...this.uploadProgress,
            failed: this.uploadProgress.failed + 1
          })
        }
      }

      this.isUploading = false
      if (this.isComplete && this.uploadProgress.failed === 0) {
        this.completeStep(4)
      }
    },

    async retryUpload(rowIndex) {
      // Reset the state for this row
      this.setUploadState({ 
        rowIndex: rowIndex - 1, 
        status: 'pending', 
        pid: null, 
        error: null 
      })
      this.setUploadProgress({
        ...this.uploadProgress,
        failed: this.uploadProgress.failed - 1
      })
      
      // Start upload
      await this.startUpload()
    },

    handleFileSelection(files) {
      this.fileError = ''
      if (!files || files.length === 0) return

      // Get all required filenames from CSV
      const rows = this.csvContent?.split('\n') || []
      const headers = rows[0].split(';').map(h => h.trim()).filter(Boolean)
      const filenameMapping = this.fieldMappings['Filename']
      
      if (!filenameMapping || filenameMapping.source !== 'csv-column') {
        this.fileError = 'No filename column mapped in CSV configuration'
        this.selectedFiles = []
        return
      }

      const filenameIndex = headers.indexOf(filenameMapping.csvValue)
      if (filenameIndex === -1) {
        this.fileError = 'Mapped filename column not found in CSV'
        this.selectedFiles = []
        return
      }

      const requiredFiles = new Set(
        rows.slice(1)
          .filter(row => row && row.trim()) // Skip empty rows
          .map(row => row.split(';')[filenameIndex].trim())
          .filter(Boolean)
      )

      // Check if all required files are present
      const selectedFileNames = new Set(files.map(f => f.name).filter(Boolean))
      const missingFiles = [...requiredFiles].filter(f => !selectedFileNames.has(f))
      const extraFiles = [...selectedFileNames].filter(f => !requiredFiles.has(f))

      if (missingFiles.length > 0) {
        this.fileError = `Missing required files: ${missingFiles.join(', ')}`
        this.selectedFiles = []
      } else if (extraFiles.length > 0) {
        this.fileError = `Extra files not in CSV: ${extraFiles.join(', ')}`
        this.selectedFiles = []
      }
    },

    async createFormData(headers, values) {
      console.log('Creating form data with mappings:', this.fieldMappings)
      
      let form = { 
        sections: [{ 
          title: null, 
          type: "digitalobject",
          id: 1, 
          fields: [] 
        }] 
      }

      // Map fields based on fieldMappings
      for (const [field, mapping] of Object.entries(this.fieldMappings || {})) {
        if (!mapping) continue
        console.log(`Processing field: ${field} with mapping:`, mapping)
        
        let f = null
        try {
          if (mapping.source === 'phaidra-field') {
            const value = mapping.phaidraValue
            console.log(`Processing Phaidra field: ${field} with value:`, value)

            const fieldConfig = this.fieldSettings[field]
            f = fieldConfig.phaidraComponentMapping[0].getProps(value)
            f.value = fieldConfig.phaidraAPIValue ? fieldConfig.phaidraAPIValue(value) : value
            console.log(field, ' field:', f)
          } else if (mapping.source === 'csv-column') {
            const columnIndex = headers.indexOf(mapping.csvValue)
            const value = values[columnIndex]
            console.log(`Processing CSV field: ${field} with value:`, value)
            
            switch(field.toLowerCase()) {
              case 'title':
                f = fieldslib.getField('title')
                f.title = value
                f.language = this.$i18n.locale
                break
              case 'subtitle':
                // Find the title field and add subtitle to it
                const titleField = form.sections[0].fields.find(field => field.title !== undefined)
                if (titleField) {
                  titleField.subtitle = value
                }
                break
              case 'description':
                f = fieldslib.getField('description')
                f.value = value
                f.language = this.$i18n.locale
                break
              case 'keywords':
                f = fieldslib.getField('keyword')
                f.value = value ? value.split(',').map(k => k.trim()).filter(Boolean) : []
                f.language = this.$i18n.locale
                f.disableSuggest = true
                break
              case 'license':
                f = fieldslib.getField('license')
                f.showValueDefinition = true
                f.vocabulary = "alllicenses"
                f.value = value
                break
              default:
                console.log(`Using default field handling for: ${field}`)
                f = fieldslib.getField(field.toLowerCase())
                if (f) {
                  f.value = value
                  f.language = this.$i18n.locale
                }
            }
          }

          // Set common field properties
          if (f) {
            f.multilingual = false
            f.configurable = false
            form.sections[0].fields.push(f)
          } else {
            console.warn(`Could not create field for: ${field}`)
          }
        } catch (error) {
          console.error(`Error processing field ${field}:`, error)
          throw new Error(`Failed to process field ${field}: ${error.message}`)
        }
      }

      console.log('Final form:', form)

      // Create metadata object
      let metadata = { 
        metadata: {
          'json-ld': jsonld.form2json(form),
          ownerid: this.user.username
        }
      }

      console.log('Final metadata:', metadata)

      // Create form data
      const formData = new FormData()
      formData.append('metadata', JSON.stringify(metadata))
      
      // Add file data if present
      const filenameMapping = this.fieldMappings['Filename']
      const filenameIndex = headers.indexOf(filenameMapping.csvValue)
      const filename = values[filenameIndex]
      if (filename) {
        const file = this.selectedFiles.find(f => f.name === filename)
        if (file) {
          formData.append('file', file)
          formData.append('mimetype', file.type || 'application/octet-stream')
        } else {
          throw new Error(`File not found: ${filename}`)
        }
      }

      return formData
    },

    async startNewBulkUpload() {
      try {
        // Reset all bulk upload data including localStorage
        this.hardResetState()
        
        // Redirect to the first step
        this.$router.push(this.steps[1].route)
      } catch (error) {
        console.error('Error starting new bulk upload:', error)
      }
    }
  },

  created() {
    // Initialize upload progress if not already set
    if (this.uploadProgress.total === 0) {
      const rows = this.csvContent?.split('\n') || []
      const validRows = rows.slice(1).filter(row => row && row.trim())
      this.setUploadProgress({
        total: validRows.length,
        completed: 0,
        failed: 0
      })
    }
  }
}
</script>

<style scoped>
.upload {
  max-width: 1200px;
  margin: 0 auto;
}

.position-relative {
  position: relative;
}
</style>