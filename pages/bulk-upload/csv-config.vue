<template>
  <v-container class="csv-config">
    <BulkUploadSteps />
    <v-row>
      <v-col>
        <h1 class="text-h4">Step 1: Upload CSV File</h1>
      </v-col>
    </v-row>
    <v-row justify="end">
      <v-col cols="auto">
        <v-btn
          color="primary"
          @click="$router.push('/bulk-upload/meta-data-config')"
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
  middleware: 'bulk-upload'
}
</script>