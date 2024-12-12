<!-- file to redirect the user to the last visited bulk upload step -->

<template>
  <div class="redirect-container">
    <h1 class="text-h4 mb-6">Bulk Upload</h1>
    <div class="loader"></div>
    <div class="redirect-text">Loading local storage...</div>
  </div>
</template>

<script>
import BulkUploadSteps from '~/components/BulkUploadSteps.vue'

export default {
  name: 'BulkUploadIndex',
  layout: 'default',
  components: {
    BulkUploadSteps
  },

  mounted() {
    if (process.client) {
      this.handleRedirect()
    }
  },

  methods: {
    handleRedirect() {
      setTimeout(() => {
        if (!this.storeState) {
          return this.$router.push('/bulk-upload/csv-config')
        }

        let redirectStep = this.storeState.currentStep || 1
        
        try {
          const savedState = localStorage.getItem('bulkUploadState')
          if (savedState) {
            const state = JSON.parse(savedState)
            if (state.currentStep && state.currentStep > 0) {
              redirectStep = state.currentStep
            }
          }
        } catch (e) {
          // If localStorage fails, fall back to store state
          console.error('localStorage error:', e)
        }

        if (this.storeState?.steps) {
          const steps = this.storeState.steps
          if (steps[redirectStep]) {
            this.$router.push(steps[redirectStep].route)
          } else {
            this.$router.push('/bulk-upload/csv-config')
          }
        } else {
          this.$router.push('/bulk-upload/csv-config')
        }
      }, 1200)
    }
  },

  computed: {
    storeState() {
      return this.$store?.state['bulk-upload'] || null
    }
  }
}
</script>

<style scoped>
.redirect-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  gap: 1rem;
}

.redirect-text {
  color: #666;
  font-size: 1.2rem;
}

.loader {
  width: 48px;
  height: 48px;
  border: 5px solid #f3f3f3;
  border-radius: 50%;
  border-top: 5px solid #3498db;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>