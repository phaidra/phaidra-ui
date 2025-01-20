import fieldslib from "phaidra-vue-components/src/utils/fields"

export const phaidraFieldMappings = {
  'Title': [
    {
      text: 'Title',
      value: 'title',
      field: () => {
        const field = fieldslib.getField("title")
        field.multilingual = false
        return field
      }
    }
  ],
  'Role': [
    {
      text: 'Author',
      value: 'role:aut',
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
      }
    }
  ],
  'Description': [
    {
      text: 'Description',
      value: 'description',
      field: () => {
        const field = fieldslib.getField("description")
        field.multilingual = false
        field.component = 'text-field'
        return field
      }
    }
  ],
  'Keywords': [
    {
      text: 'Keywords',
      value: 'keyword',
      field: () => {
        const field = fieldslib.getField("keyword")
        field.disableSuggest = true
        field.multilingual = false
        return field
      }
    }
  ],
  'Type': [
    {
      text: 'Object Type',
      value: 'object-type',
      field: () => {
        const field = fieldslib.getField("object-type-checkboxes")
        field.showLabel = true
        field.multilingual = false
        field.vocabulary = 'objecttype'
        field.component = 'select'
        field.label = 'Object Type'
        return field
      }
    }
  ],
  'Persistent identifier': [
    {
      text: 'Identifier',
      value: 'identifier',
      field: () => {
        const field = fieldslib.getField("alternate-identifier")
        field.multilingual = false
        return field
      }
    }
  ],
  'License': [
    {
      text: 'License',
      value: 'license',
      field: () => {
        const field = fieldslib.getField("license")
        field.showValueDefinition = true
        field.vocabulary = "alllicenses"
        field.multilingual = false
        return field
      }
    }
  ]
} 