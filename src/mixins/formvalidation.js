export const formvalidation = {
  data () {
    return {
      validationError: false,
      fieldsMissing: []
    }
  },
  methods: {
    validate: function () {
      this.validationError = false
      this.fieldsMissing = []
      let missingTitle = true
      let missingDescription = true
      let missingKeyword = true
      let missingRole = true
      let missingLicense = true
      let missingResourceType = true
      let missingObjectType = true
      let missingFile = true
      let resourceType = null
      for (let s of this.form.sections) {
        for (let f of s.fields) {
          if (f.predicate === 'dcterms:type') {
            resourceType = f.value
          }
        }
      }
      switch (resourceType) {
        case 'https://pid.phaidra.org/vocabulary/GXS7-ENXJ':
          // collection
          missingFile = false
          missingLicense = false
          missingObjectType = false
          break
        case 'https://pid.phaidra.org/vocabulary/T8GH-F4V8':
          // resource
          missingFile = false
          missingLicense = false
          break
      }

      for (let s of this.form.sections) {
        for (let f of s.fields) {
          if (f.predicate === 'dcterms:type') {
            missingResourceType = false
            if (f.value.length < 1) {
              f.errorMessages.push(this.$t('Please select'))
              console.log('missing resource type')
              this.validationError = true
            }
          }
          if (f.predicate === 'edm:hasType') {
            missingObjectType = false
            if (f.hasOwnProperty('selectedTerms')) {
              if (f.selectedTerms.length < 1) {
                f.errorMessages.push(this.$t('Please select one or more object types'))
                console.log('missing object type:' + JSON.stringify(f))
                this.validationError = true
              }
            } else {
              if (f.value.length < 1) {
                f.errorMessages.push(this.$t('Please select one or more object types'))
                console.log('missing object type (value.length < 1):' + JSON.stringify(f))
                this.validationError = true
              }
            }
          }
          if (f.component === 'p-title') {
            missingTitle = false
            f.titleErrorMessages = []
            if (f.title.length < 1) {
              f.titleErrorMessages.push(this.$t('Missing title'))
              console.log('missing title')
              this.validationError = true
            }
          }
          if ((f.predicate === 'bf:note') && (f.type === 'bf:Note')) {
            missingDescription = false
            f.errorMessages = []
            if (f.value.length < 1) {
              f.errorMessages.push(this.$t('Missing description'))
              console.log('missing description')
              this.validationError = true
            }
          }
          if (f.component === 'p-keyword') {
            missingKeyword = false
            f.errorMessages = []
            if (f.value.length < 1) {
              f.errorMessages.push(this.$t('Missing keywords'))
              console.log('missing keywords')
              this.validationError = true
            }
          }
          if ((f.component === 'p-entity') || (f.component === 'p-entity-extended')) {
            missingRole = false
            f.firstnameErrorMessages = []
            f.lastnameErrorMessages = []
            f.roleErrorMessages = []
            f.affiliationErrorMessages = []
            f.affiliationTextErrorMessages = []
            f.organizationErrorMessages = []
            f.organizationTextErrorMessages = []
            if (f.role.length < 1) {
              f.roleErrorMessages.push(this.$t('Missing role'))
              console.log('missing role')
              this.validationError = true
            }
            if (f.type === 'schema:Person') {
              if (f.firstname.length < 1) {
                f.firstnameErrorMessages.push(this.$t('Missing firstname'))
                console.log('missing firstname')
                this.validationError = true
              }
              if (f.lastname.length < 1) {
                f.lastnameErrorMessages.push(this.$t('Missing lastname'))
                console.log('missing lastname')
                this.validationError = true
              }
            }
            if (f.type === 'schema:Organization') {
              if (f.organization.length < 1) {
                f.organizationErrorMessages.push(this.$t('Missing organization'))
                console.log('missing organisation')
                this.validationError = true
              }
            }
          }
          if (f.component === 'p-select') {
            if (f.predicate === 'edm:rights') {
              f.errorMessages = []
              missingLicense = false
              if (f.value.length < 1) {
                f.errorMessages.push(this.$t('Please select'))
                console.log('missing license')
                this.validationError = true
              }
            }
          }
          if (f.component === 'p-file') {
            missingFile = false
            f.fileErrorMessages = []
            f.mimetypeErrorMessages = []
            if (!f.file) {
              f.fileErrorMessages.push(this.$t('Please select'))
              console.log('missing file')
              this.validationError = true
            }
            if (f.mimetype.length < 1) {
              f.mimetypeErrorMessages.push(this.$t('Please select'))
              console.log('missing mimetype')
              this.validationError = true
            } else {
              // TODO check mime type against resource type
            }
          }
        }
      }

      if (missingTitle) {
        this.fieldsMissing.push(this.$t('Title'))
      }
      if (missingDescription) {
        this.fieldsMissing.push(this.$t('Description'))
      }
      if (missingKeyword) {
        this.fieldsMissing.push(this.$t('Keyword'))
      }
      if (missingRole) {
        this.fieldsMissing.push(this.$t('Role'))
      }
      if (missingLicense) {
        this.fieldsMissing.push(this.$t('License'))
      }
      if (missingResourceType) {
        this.fieldsMissing.push(this.$t('Resource type'))
      }
      if (missingObjectType) {
        this.fieldsMissing.push(this.$t('Object type'))
      }
      if (missingFile) {
        this.fieldsMissing.push(this.$t('File'))
      }
      console.log('error[' + this.validationError + '] missing fields:' + JSON.stringify(this.fieldsMissing))
      if (this.validationError) {
        this.$vuetify.goTo(0)
      }
      return !this.validationError
    }
  }
}
