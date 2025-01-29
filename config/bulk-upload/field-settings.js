import fieldslib from "phaidra-vue-components/src/utils/fields"

const getSharedProps = (fieldConfig, value, updateMapping) => ({
  value,
  label: fieldConfig.label || fieldConfig.text,
  field: fieldConfig,
  outlined: true,
  dense: true,
  'hide-details': true
})

export const fieldSettings = {
  'Title': {
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
    allowedSources: ['csv-column', 'phaidra-field'],
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
            showValueDefinition: true
          }
        }
      }
    ]
  },
  'Persistent identifier': {
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
    allowedSources: ['phaidra-field'],
    phaidraComponentMapping: [
      {
        text: 'License',
        component: 'PISelect',
        field: () => {
          const field = fieldslib.getField("license")
          field.showValueDefinition = true
          field.vocabulary = "alllicenses"
          field.multilingual = false
          return field
        },
        getProps: function(value, updateMapping) {
          const fieldConfig = this.field()
          return {
            ...getSharedProps(fieldConfig, value, updateMapping),
            showValueDefinition: true,
            vocabulary: 'alllicenses',
            predicate: 'edm:rights'
          }
        }
      }
    ]
  },
  'Filename': {
    allowedSources: ['csv-column'],
    phaidraComponentMapping: []
  }
} 