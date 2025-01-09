export const state = () => ({
  currentStep: 1,
  maxStepReached: 1,
  steps: {
    1: { route: '/bulk-upload/csv-config', completed: false },
    2: { route: '/bulk-upload/meta-data-config', completed: false },
    3: { route: '/bulk-upload/preview', completed: false },
    4: { route: '/bulk-upload/upload', completed: false }
  },
  csvContent: null,
  columns: [],
  fileName: ''
})

export const mutations = {
  initializeState(state, savedState) {
    Object.assign(state, savedState)
  },
  setCurrentStep(state, step) {
    state.currentStep = step
    if (step > state.maxStepReached) {
      state.maxStepReached = step
    }
  },
  completeStep(state, step) {
    if (state.steps[step]) {
      state.steps[step].completed = true
    }
  },
  setCsvContent(state, content) {
    state.csvContent = content
  },
  setColumns(state, columns) {
    state.columns = columns
  },
  setFileName(state, fileName) {
    state.fileName = fileName
  }
}

export const getters = {
  canAccessStep: (state) => (step) => {
    // TODO: define logic for each step later
    return true
  },
  getCurrentStepFromRoute: (state) => (route) => {
    for (const [stepNum, stepData] of Object.entries(state.steps)) {
      if (stepData.route === route) {
        return parseInt(stepNum)
      }
    }
    return 1
  }
} 