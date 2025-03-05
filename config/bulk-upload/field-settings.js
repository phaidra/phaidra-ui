import fieldslib from "phaidra-vue-components/src/utils/fields"

const getSharedProps = (fieldConfig, value, updateMapping) => ({
  value: value || fieldConfig.value,
  label: fieldConfig.label || fieldConfig.text,
  field: fieldConfig,
  multilingual: false,
  outlined: true,
  dense: true,
  'hide-details': true
})

export const fieldSettings = {
  'Title': {
    required: true,
    // single-field means the phaidra component has only one field
    // multi-field means the phaidra component has multiple fields
    //   -> resulting in multiple fields for the csv source, which has a more complex logic
    //   -> view 'Role' as an example of how this is set up
    fieldType: 'single-field',
    allowedSources: ['csv-column']
  },
  'Subtitle': {
    required: false,
    fieldType: 'single-field',
    allowedSources: ['csv-column']
  },
  'Description': {
    required: true,
    fieldType: 'single-field',
    allowedSources: ['csv-column']
  },
  'Keywords': {
    required: true,
    fieldType: 'single-field',
    allowedSources: ['csv-column', 'phaidra-field'],
    phaidraComponentMapping: [
      {
        text: 'Keywords',
        component: 'PIKeyword',
        field: () => {
          const field = fieldslib.getField("keyword")
          field.disableSuggest = true
          return field
        },
        getProps: function(value, updateMapping) {
          const fieldConfig = this.field()
          return {
            // always spread fieldConfig first
            // then override with shared props to ensure value is remembered
            disableSuggest: fieldConfig.disableSuggest,
            ...getSharedProps(fieldConfig, value, updateMapping)
          }
        }
      }
    ]
  },
  'Type': {
    required: true,
    fieldType: 'single-field',
    allowedSources: ['csv-column', 'phaidra-field'],
    phaidraComponentMapping: [
      {
        text: 'Object Type',
        component: 'PISelect',
        field: () => {
          const field = fieldslib.getField("object-type-checkboxes")
          field.showValueDefinition = false
          field.vocabulary = 'objecttype'
          field.component = 'select'
          field.label = 'Object Type'
          return field
        },
        getProps: function(value, updateMapping) {
          const fieldConfig = this.field()
          return {
            // always spread fieldConfig first
            // then override with shared props to ensure value is remembered
            ...fieldConfig,
            ...getSharedProps(fieldConfig, value, updateMapping)
          }
        }
      }
    ]
  },
  'Role': {
    required: true,
    fieldType: 'multi-field',
    multiFieldConfig: {
      label: 'Role',
      fields: {
        'Role': { required: true },
        'First name': { required: false },
        'Last name': { required: false },
        'ORCID': { required: false }
      }
    },
    allowedSources: ['csv-column', 'phaidra-field'],
    phaidraComponentMapping: [
      {
        component: 'PIEntity',
        field: () => {
          const field = fieldslib.getField("role")
          field.showDefinitions = true
          field.showIdentifier = true
          field.identifierType = "ids:orcid"
          field.type = 'schema:Person'

          // needed to prevent a "duplicate/order dropdown" from appearing
          field.multiplicable = false
          field.ordered = false
          return field
        },
        getProps: function(value, updateMapping) {
          const fieldConfig = this.field()
          return {
            // always spread fieldConfig first
            // then override with shared props to ensure value is remembered
            ...fieldConfig,
            ...getSharedProps(fieldConfig, value, updateMapping)
          }
        }
      }
    ]
  },
  'License': {
    required: true,
    fieldType: 'single-field',
    allowedSources: ['phaidra-field'],
    phaidraComponentMapping: [
      {
        text: 'License',
        component: 'PISelect',
        field: () => {
          const field = fieldslib.getField("license")
          field.vocabulary = "alllicenses"
          field.showDisclaimer = false
          return field
        },
        getProps: function(value, updateMapping) {
          const fieldConfig = this.field()
          return {
            // always spread fieldConfig first
            // then override with shared props to ensure value is remembered
            ...fieldConfig,
            ...getSharedProps(fieldConfig, value, updateMapping)
          }
        }
      }
    ]
  },
  'Filename': {
    required: true,
    fieldType: 'single-field',
    allowedSources: ['csv-column']
  }
}