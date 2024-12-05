<template>
  <v-container class="preview">
    <BulkUploadSteps />
    <v-row>
      <v-col>
        <h1 class="text-h4">Step 3: Preview</h1>
      </v-col>
    </v-row>
    <v-row justify="space-between">
      <v-col cols="auto">
        <v-btn
          @click="$router.push('/bulk-upload/meta-data-config')"
        >
          <v-icon left>mdi-arrow-left</v-icon>
          Previous
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn
          color="primary"
          @click="$router.push('/bulk-upload/upload')"
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
  name: 'Preview',
  components: {
    BulkUploadSteps
  },
  middleware: 'bulk-upload'
}
</script>