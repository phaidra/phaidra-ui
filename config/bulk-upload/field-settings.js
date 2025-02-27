import fieldslib from "phaidra-vue-components/src/utils/fields"

const getSharedProps = (fieldConfig, value, updateMapping) => ({
  value: value,
  label: fieldConfig.label || fieldConfig.text,
  field: fieldConfig,
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
    allowedSources: ['csv-column'],
    phaidraComponentMapping: [
      {
        text: 'Title',
        component: 'PITitle',
        field: () => {
          const field = fieldslib.getField("title")
          field.multilingual = false
          return field
        },
        getProps: function(value, updateMapping) {
          return getSharedProps(this.field(), value, updateMapping)
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
        'Last name': { required: false }
      }
    },
    allowedSources: ['csv-column', 'phaidra-field'],
    phaidraComponentMapping: [
      {
        text: 'Author',
        component: 'PIEntity',
        field: () => {
          const field = fieldslib.getField("role")
          field.ordergroup = "role"
          field.roleVocabulary = "submitrolepredicate"
          field.showDefinitions = true
          field.multilingual = false
          field.component = 'entity'
          field.label = 'Author'
          field.roleLabel = 'Role'
          field.showname = false
          field.type = 'schema:Person'
          field.inputStyle = 'outlined'
          return field
        },
        getProps: function(value, updateMapping) {
          const fieldConfig = this.field()
          return {
            ...getSharedProps(fieldConfig, value, updateMapping),
            roleVocabulary: fieldConfig.roleVocabulary,
            showDefinitions: fieldConfig.showDefinitions,
            roleLabel: fieldConfig.roleLabel,
            showname: fieldConfig.showname,
            type: fieldConfig.type,
            inputStyle: fieldConfig.inputStyle
          }
        }
      }
    ]
  },
  'Description': {
    required: true,
    fieldType: 'single-field',
    allowedSources: ['csv-column'],
    phaidraComponentMapping: [
      {
        text: 'Description',
        component: 'PITextField',
        field: () => {
          const field = fieldslib.getField("description")
          field.multilingual = false
          field.component = 'text-field'
          return field
        },
        getProps: function(value, updateMapping) {
          return getSharedProps(this.field(), value, updateMapping)
        }
      }
    ]
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
          field.multilingual = false
          return field
        },
        getProps: function(value, updateMapping) {
          const fieldConfig = this.field()
          return {
            ...getSharedProps(fieldConfig, value, updateMapping),
            disableSuggest: fieldConfig.disableSuggest
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
          field.showLabel = true
          field.multilingual = false
          field.vocabulary = 'objecttype'
          field.component = 'select'
          field.label = 'Object Type'
          return field
        },
        getProps: function(value, updateMapping) {
          const fieldConfig = this.field()
          return {
            ...getSharedProps(fieldConfig, value, updateMapping),
            vocabulary: fieldConfig.vocabulary,
            showValueDefinition: false
          }
        }
      }
    ]
  },
  'Persistent identifier': {
    required: false,
    fieldType: 'single-field',
    allowedSources: ['csv-column', 'phaidra-field'],
    phaidraComponentMapping: [
      {
        text: 'Identifier',
        component: 'PIAlternateIdentifier',
        field: () => {
          const field = fieldslib.getField("alternate-identifier")
          field.multilingual = false
          return field
        },
        getProps: function(value, updateMapping) {
          return getSharedProps(this.field(), value, updateMapping)
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
          field.multilingual = false
          return field
        },
        getProps: function(value, updateMapping) {
          const fieldConfig = this.field()
          return {
            ...getSharedProps(fieldConfig, value, updateMapping),
            showDisclaimer: false,
            vocabulary: 'alllicenses'
          }
        }
      }
    ]
  },
  'Filename': {
    required: true,
    fieldType: 'single-field',
    allowedSources: ['csv-column'],
    phaidraComponentMapping: []
  }
} 