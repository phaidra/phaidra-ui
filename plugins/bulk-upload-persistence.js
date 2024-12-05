export default ({ store }) => {
  // Only run on client-side
  if (process.client) {
    // Initialize store with localStorage data if it exists
    const savedState = localStorage.getItem('bulkUploadState')
    if (savedState) {
      store.commit('bulk-upload/initializeState', JSON.parse(savedState))
    }

    // Subscribe to store mutations
    store.subscribe((mutation, state) => {
      if (mutation.type.startsWith('bulk-upload/')) {
        localStorage.setItem('bulkUploadState', JSON.stringify(state['bulk-upload']))
      }
    })
  }
} 