<template>
  <div class="d-flex align-center">
    <component
      :is="phaidraComponent"
      v-bind="phaidraProps"
      class="flex-grow-1"
      @input="handleInput"
      @change="handleInput"
      :disabled="disabled"
      :class="{ 'grey-input': disabled }"
    ></component>
  </div>
</template>

<script>
import { fieldSettings } from '~/config/bulk-upload/field-settings'

export default {
  name: 'PhaidraFieldSelector',

  props: {
    field: {
      type: String,
      required: true
    },
    value: {
      type: [String, Object],
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    getAllowedSources() {
      return fieldSettings[this.field]?.allowedSources || ['csv-column', 'phaidra-field']
    },

    phaidraComponent() {
      const elementConfig = fieldSettings[this.field]?.phaidraComponentMapping?.[0]
      if (!elementConfig) return 'v-text-field'
      return elementConfig.component || 'v-text-field'
    },

    phaidraProps() {
      const elementConfig = fieldSettings[this.field]?.phaidraComponentMapping?.[0]
      if (!elementConfig) return {}

      let displayValue = null
      if (this.value) {
        if (typeof this.value === 'object') {
          if (elementConfig?.component === 'PISelect') {
            displayValue = this.value['@id'] || this.value.uri || ''
          } else if (elementConfig?.component === 'PIKeyword') {
            displayValue = this.value
          } else {
            displayValue = this.value.uri || this.value.value || this.value
          }
        } else {
          displayValue = this.value
        }
      }

      return elementConfig.getProps(
        displayValue,
        this.handleInput,
        {
          handleRoleInput: this.handleRoleInput,
          handleFirstnameInput: this.handleFirstnameInput,
          handleLastnameInput: this.handleLastnameInput
        }
      )
    }
  },

  methods: {
    handleInput(value) {
      this.$emit('input', value)
    },

    handleRoleInput(value) {
      const currentValue = this.value || {}
      this.$emit('input', { ...currentValue, role: value })
    },

    handleFirstnameInput(value) {
      const currentValue = this.value || {}
      this.$emit('input', { ...currentValue, firstname: value })
    },

    handleLastnameInput(value) {
      const currentValue = this.value || {}
      this.$emit('input', { ...currentValue, lastname: value })
    }
  }
}
</script>

<style scoped>
.grey-input :deep(.v-input__slot) {
  background-color: #f5f5f5 !important;
}
</style> 