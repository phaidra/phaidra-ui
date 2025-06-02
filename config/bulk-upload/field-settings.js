import fieldslib from "phaidra-vue-components/src/utils/fields"

const getSharedProps = (fieldConfig, value) => ({
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
    csvDisplayValue: (value) => value,
    csvAPIValue: (value) => value,
    phaidraDisplayValue: (value) => value,
    phaidraComponentMapping: [
      {
        text: 'Title',
        component: 'PITitle',
        field: () => {
          const field = fieldslib.getField("title")
          field.multilingual = false
          return field
        },
        getProps: function(value) {
          const fieldConfig = this.field()
          return {
            ...fieldConfig,
            ...getSharedProps(fieldConfig, value)
          }
        }
      }
    ]

  },
  'Subtitle': {
    required: false,
    fieldType: 'single-field',
    allowedSources: ['csv-column'],
    csvDisplayValue: (value) => value,
    csvAPIValue: (value) => value
  },
  'Description': {
    required: true,
    fieldType: 'single-field',
    allowedSources: ['csv-column'],
    csvDisplayValue: (value) => value,
    csvAPIValue: (value) => value,
    phaidraDisplayValue: (value) => value,
    phaidraComponentMapping: [
      {
        text: 'Description',
        component: 'PIDescription',
        field: () => fieldslib.getField("description"),
        getProps: function(value) {
          const fieldConfig = this.field()
          return {
            ...fieldConfig,
            ...getSharedProps(fieldConfig, value)
          }
        }
      }
    ]

  },
  'Keywords': {
    required: true,
    fieldType: 'single-field',
    allowedSources: ['csv-column', 'phaidra-field'],
    csvDisplayValue: (value) => value.split(','),
    csvAPIValue: (value) => value.split(','),
    phaidraDisplayValue: (value) => value,
    phaidraFieldValue: (value) => {
      if (!value) return null
      return value.value || value
    },
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
        getProps: function(value) {
          const fieldConfig = this.field()
          return {
            // always spread fieldConfig first
            // then override with shared props to ensure value is remembered
            ...fieldConfig,
            ...getSharedProps(fieldConfig, value)
          }
        }
      }
    ]
  },
  'Type': {
    required: true,
    fieldType: 'single-field',
    allowedSources: ['phaidra-field'],
    csvDisplayValue: (value) => value,
    csvAPIValue: (value) => value,
    // displayed correctly (preview step 3.)
    phaidraDisplayValue: (value) => value?.["skos:prefLabel"]?.["eng"] || '',
    // send the correct data to the API (upload step 4.)
    phaidraAPIValue: (value) => value?.["@id"] || '',
    // correctly retrieve value from storage to the phaidra component (mapping step 2.)
    phaidraFieldValue: (value) => {
      if (!value) return null
      return value['@id'] || ''
    },
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
        getProps: function(value) {
          const fieldConfig = this.field()
          return {
            // always spread fieldConfig first
            // then override with shared props to ensure value is remembered
            ...fieldConfig,
            ...getSharedProps(fieldConfig, value)
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
          csvDisplayValue: (value) => value,
          phaidraDisplayValue: (value) => value?.["skos:prefLabel"]?.["eng"] || ''
        },
        'First name': { 
          required: false,
          csvDisplayValue: (value) => value,
          phaidraDisplayValue: (value) => value || ''
        },
        'Last name': { 
          required: false,
          csvDisplayValue: (value) => value,
          phaidraDisplayValue: (value) => value || ''
        },
        'ORCID': { 
          required: false,
          csvDisplayValue: (value) => value,
          phaidraDisplayValue: (value) => value || ''
        }
      }
    },
    allowedSources: ['csv-column', 'phaidra-field'],
    phaidraFieldValue: (value) => {
      if (!value) return null
      const roleValue = value.subFields?.Role?.phaidraValue
      return {
        role: roleValue?.['@id'] || roleValue,
        firstname: value.subFields?.['First name']?.phaidraValue || '',
        lastname: value.subFields?.['Last name']?.phaidraValue || '',
        identifierText: value.subFields?.['ORCID']?.phaidraValue || ''
      }
    },
    phaidraComponentMapping: [
      {
        component: 'PIEntityExtended',
        field: () => {
          const field = fieldslib.getField("role")
          field.showDefinitions = true
          field.showIdentifier = true
          field.showIdentifierType = true
          field.enableTypeSelect = false
          field.showActions = false
          field.showAffiliation = false
          field.type = 'schema:Person'

          // needed to prevent a "duplicate/order dropdown" from appearing
          field.multiplicable = false
          field.ordered = false
          return field
        },
        getProps: function(value) {
          const fieldConfig = this.field()
          return {
            // always spread fieldConfig first
            // then override with shared props to ensure value is remembered
            ...fieldConfig,
            ...getSharedProps(fieldConfig, value)
          }
        }
      }
    ]
  },
  'License': {
    required: true,
    fieldType: 'single-field',
    allowedSources: ['phaidra-field'],
    csvDisplayValue: (value) => value,
    csvAPIValue: (value) => value,
    phaidraDisplayValue: (value) => value?.["skos:prefLabel"]?.["eng"] || '',
    phaidraAPIValue: (value) => value?.["@id"] || '',
    phaidraFieldValue: (value) => {
      if (!value) return null
      return value['@id'] || ''
    },
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
        getProps: function(value) {
          const fieldConfig = this.field()
          return {
            // always spread fieldConfig first
            // then override with shared props to ensure value is remembered
            ...fieldConfig,
            ...getSharedProps(fieldConfig, value)
          }
        }
      }
    ]
  },
  'OEFOS': {
    required: true,
    fieldType: 'single-field',
    allowedSources: ['phaidra-field'],
    csvDisplayValue: (value) => value,
    csvAPIValue: (value) => value,
    phaidraDisplayValue: (value) => value["skos:prefLabel"]?.["eng"] || '',
    phaidraFieldValue: (value) => {
      if (!value) return null
      return value['@id'] || ''
    },
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
        getProps: function(value) {
          const fieldConfig = this.field()
          return {
            ...fieldConfig,
            ...getSharedProps(fieldConfig, value)
          }
        }
      }
    ]
  },
  'ORG Unit / Association': {
    required: false,
    fieldType: 'single-field',
    allowedSources: ['phaidra-field'],
    csvDisplayValue: (value) => value,
    csvAPIValue: (value) => value,
    phaidraDisplayValue: (value) => value?.["skos:prefLabel"]?.["eng"] || '',
    phaidraFieldValue: (value) => {
      if (!value) return null
      return value['@id'] || ''
    },
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
        getProps: function(value) {
          const fieldConfig = this.field()
          return {
            ...fieldConfig,
            ...getSharedProps(fieldConfig, value)
          }
        }
      }
    ]
  },
  'Filename': {
    required: true,
    fieldType: 'single-field',
    allowedSources: ['csv-column'],
    csvDisplayValue: (value) => value,
    csvAPIValue: (value) => value
  }
}