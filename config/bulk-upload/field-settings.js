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
    allowedSources: ['csv-column'],
    phaidraDisplayValue: (value) => value
  },
  'Subtitle': {
    required: false,
    fieldType: 'single-field',
    allowedSources: ['csv-column'],
    phaidraDisplayValue: (value) => value
  },
  'Description': {
    required: true,
    fieldType: 'single-field',
    allowedSources: ['csv-column'],
    phaidraDisplayValue: (value) => value
  },
  'Keywords': {
    required: true,
    fieldType: 'single-field',
    allowedSources: ['csv-column', 'phaidra-field'],
    phaidraDisplayValue: (value) => value,
    phaidraComponentMapping: [
      {
        text: 'Keywords',
        component: 'PIKeyword',
        field: () => {
          const field = fieldslib.getField("keyword")
          field.suggester = 'keywordsuggester'
          field.disableSuggest = true
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
  'Type': {
    required: true,
    fieldType: 'single-field',
    allowedSources: ['csv-column', 'phaidra-field'],
    phaidraDisplayValue: (value) => value?.["skos:prefLabel"]?.["eng"] || '',
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
        'Role': { 
          required: true,
          phaidraDisplayValue: (value) => value?.["skos:prefLabel"]?.["eng"] || ''
        },
        'First name': { 
          required: false,
          phaidraDisplayValue: (value) => value || ''
        },
        'Last name': { 
          required: false,
          phaidraDisplayValue: (value) => value || ''
        },
        'ORCID': { 
          required: false,
          phaidraDisplayValue: (value) => value || ''
        }
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
    phaidraDisplayValue: (value) => value?.["@id"] || '',
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
  'OEFOS': {
    required: true,
    fieldType: 'single-field',
    allowedSources: ['phaidra-field'],
    phaidraDisplayValue: (value) => value,
    phaidraComponentMapping: [
      {
        text: 'Subject (ÖFOS)',
        component: 'PISubjectOefos',
        field: () => {
          const field = fieldslib.getField("oefos-subject")

          // needed to prevent a "duplicate/order dropdown" from appearing
          field.multiplicable = false
          field.ordered = false
          return field
        },
        getProps: function(value, updateMapping) {
          const fieldConfig = this.field()
          return {
            ...fieldConfig,
            ...getSharedProps(fieldConfig, value, updateMapping)
          }
        }
      }
    ]
  },
  'ORG Unit / Association': {
    required: false,
    fieldType: 'single-field',
    allowedSources: ['phaidra-field'],
    phaidraDisplayValue: (value) => value,
    phaidraComponentMapping: [
      {
        text: 'ORG Unit / Association',
        component: 'PIAssociation',
        field: () => {
          const field = fieldslib.getField("association")

          // needed to prevent a "duplicate/order dropdown" from appearing
          field.multiplicable = false
          field.ordered = false
          return field
        },
        getProps: function(value, updateMapping) {
          const fieldConfig = this.field()
          return {
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
    allowedSources: ['csv-column'],
    phaidraDisplayValue: (value) => value
  }
}