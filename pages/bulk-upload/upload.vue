<template>
  <v-container class="upload">
    <BulkUploadSteps />
    <v-row>
      <v-col>
        <h1 class="text-h4">Step 4: Upload & Table View</h1>
      </v-col>
    </v-row>
    <v-row justify="space-between">
      <v-col cols="auto">
        <v-btn
          @click="$router.push('/bulk-upload/preview')"
        >
          <v-icon left>mdi-arrow-left</v-icon>
          Previous
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn
          color="success"
          @click="finishUpload"
        >
          Finish
          <v-icon right>mdi-check</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import BulkUploadSteps from '~/components/BulkUploadSteps.vue'

export default {
  name: 'Upload',
  components: {
    BulkUploadSteps
  },
  middleware: 'bulk-upload',
  methods: {
    finishUpload() {
      // Handle finish action
      console.log('Upload finished')
    }
  }
}
</script>