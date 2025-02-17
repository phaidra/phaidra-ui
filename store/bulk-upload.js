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
  fileName: '',
  requiredFields: ['Title', 'Role', 'Description', 'Keywords', 'Type', 'License', 'Filename'],
  fieldMappings: {}, // Will store mappings like { field: { source: 'csv-column|phaidra-field', csvValue: string, phaidraValue: object } }
  uploadState: {}, // Will store upload state for each row { rowIndex: { status: 'pending|uploading|completed|error', pid: null, error: null } }
  uploadProgress: {
    total: 0,
    completed: 0,
    failed: 0
  }
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
  },
  setFieldMapping(state, { requiredField, source, csvValue, phaidraValue }) {
    if (!source) {
      state.fieldMappings = {
        ...state.fieldMappings,
        [requiredField]: null
      }
    } else {
      const existingMapping = state.fieldMappings[requiredField] || {}
      state.fieldMappings = {
        ...state.fieldMappings,
        [requiredField]: {
          source,
          csvValue: csvValue !== undefined ? csvValue : existingMapping.csvValue || null,
          phaidraValue: phaidraValue !== undefined ? phaidraValue : existingMapping.phaidraValue || null
        }
      }
    }
  },
  clearFieldMappings(state) {
    state.fieldMappings = {}
  },
  setUploadState(state, { rowIndex, status, pid, error }) {
    state.uploadState = {
      ...state.uploadState,
      [rowIndex]: { status, pid, error }
    }
  },
  setUploadProgress(state, { total, completed, failed }) {
    state.uploadProgress = { total, completed, failed }
  },
  clearUploadState(state) {
    state.uploadState = {}
    state.uploadProgress = {
      total: 0,
      completed: 0,
      failed: 0
    }
  },
  resetSteps(state) {
    for (const step in state.steps) {
      state.steps[step].completed = false
    }
    state.maxStepReached = 1
    state.currentStep = 1
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
  },
  getUnmappedFields: (state) => {
    return state.requiredFields.filter(field => !state.fieldMappings[field])
  },
  getMappedFields: (state) => {
    return state.requiredFields.filter(field => state.fieldMappings[field])
  },
  getFieldMapping: (state) => (field) => {
    return state.fieldMappings[field]
  },
  getAllFieldMappings: (state) => {
    return state.fieldMappings
  },
  getUploadState: (state) => (rowIndex) => {
    return state.uploadState[rowIndex] || { status: 'pending', pid: null, error: null }
  },
  getUploadProgress: (state) => {
    return state.uploadProgress
  },
  isUploadComplete: (state) => {
    return state.uploadProgress.completed === state.uploadProgress.total
  }
} 