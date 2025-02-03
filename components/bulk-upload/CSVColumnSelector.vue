<template>
  <div>
    <v-select
      v-model="selectedColumn"
      :items="availableColumns"
      outlined
      dense
      clearable
      :label="'Select CSV column'"
      hide-details
      class="flex-grow-0 mr-8"
      style="width: 200px"
      :disabled="disabled"
      :class="{ 'grey-input': disabled }"
    ></v-select>
  </div>
</template>

<script>
export default {
  name: 'CSVColumnSelector',

  props: {
    field: {
      type: String,
      required: true
    },
    columns: {
      type: Array,
      required: true
    },
    value: {
      type: String,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    allMappings: {
      type: Object,
      required: true
    }
  },

  computed: {
    selectedColumn: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    },

    availableColumns() {
      // Get all currently selected values except for the current field
      const selectedValues = Object.entries(this.allMappings)
        .filter(([field]) => field !== this.field)
        .filter(([_, mapping]) => mapping?.source === 'csv-column')
        .map(([_, mapping]) => mapping.csvValue)
      
      // Return only columns that aren't selected in other fields, sorted alphabetically
      return this.columns
        .filter(col => !selectedValues.includes(col))
        .sort((a, b) => a.localeCompare(b))
    }
  }
}
</script>

<style scoped>
.grey-input :deep(.v-input__slot) {
  background-color: #f5f5f5 !important;
}
</style> 