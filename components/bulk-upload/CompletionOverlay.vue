<template>
  <v-overlay :value="isComplete && uploadProgress.failed === 0" absolute>
    <v-card class="pa-6 text-center" light>
      <v-icon size="64" color="success" class="mb-4">mdi-check-circle</v-icon>
      <h2 class="text-h5 mb-4">Bulk Upload Complete!</h2>
      <p class="mb-4">
        All files have been successfully uploaded to PHAIDRA.
      </p>
      <v-btn
        color="success"
        large
        @click="$emit('start-new')"
      >
        Start New Bulk Upload
      </v-btn>
    </v-card>
  </v-overlay>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'CompletionOverlay',
  props: {
    isComplete: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    ...mapGetters('bulk-upload', ['getUploadProgress']),
    uploadProgress() {
      return this.$store.getters['bulk-upload/getUploadProgress']
    }
  }
}
</script> 