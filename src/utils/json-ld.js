export default {
  get_json_dce_title (title, subtitle, language) {
    var h = {
      '@type': 'bf:Title',
      'bf:mainTitle': [
        {
          '@value': title
        }
      ]
    }
    if (language) {
      h['bf:mainTitle'][0]['@language'] = language
    }
    if (subtitle) {
      h['bf:subtitle'] = [
        {
          '@value': subtitle
        }
      ]
      if (language) {
        h['bf:subtitle'][0]['@language'] = language
      }
    }
    return h
  },
  get_json_bf_note (value, language, type) {
    var h = {}

    if (type) {
      h['@type'] = type
    }

    h['skos:prefLabel'] = [
      {
        '@value': value
      }
    ]

    if (language) {
      h['skos:prefLabel'][0]['@language'] = language
    }

    return h
  },
  get_json_object (rdfslabels, preflabels, type, identifiers) {
    var h = {}

    if (type) {
      h['@type'] = type
    }

    if (preflabels) {
      if (preflabels.length > 0) {
        h['skos:prefLabel'] = []
        for (var j = 0; j < preflabels.length; j++) {
          h['skos:prefLabel'].push(preflabels[j])
        }
      }
    }

    if (rdfslabels) {
      h['skos:prefLabel'] = []
      for (var i = 0; i < rdfslabels.length; i++) {
        h['skos:prefLabel'].push(rdfslabels[i])
      }
    }

    if (identifiers) {
      h['skos:exactMatch'] = identifiers
    }
    return h
  },
  get_json_spatial (rdfslabels, preflabels, coordinates, type, identifiers) {
    var h = {}

    if (type) {
      h['@type'] = type
    }

    h['skos:prefLabel'] = []
    for (var i = 0; i < rdfslabels.length; i++) {
      h['skos:prefLabel'].push(rdfslabels[i])
    }

    if (preflabels) {
      if (preflabels.length > 0) {
        h['skos:prefLabel'] = []
        for (var j = 0; j < preflabels.length; j++) {
          h['skos:prefLabel'].push(preflabels[j])
        }
      }
    }

    if (identifiers) {
      h['skos:exactMatch'] = identifiers
    }

    if (coordinates) {
      h['schema:geo'] = [
        {
          '@type': 'schema:GeoCoordinates',
          'schema:latitude': [
            coordinates['schema:latitude']
          ],
          'schema:longitude': [
            coordinates['schema:longitude']
          ]
        }
      ]
    }

    return h
  },
  get_json_valueobject (value, language) {
    var h = {
      '@value': value
    }

    if (language) {
      h['@language'] = language
    }

    return h
  },
  get_json_quantitativevalue (value, unitCode) {
    var h = {
      '@type': 'schema:QuantitativeValue',
      'schema:unitCode': [
        unitCode
      ],
      'schema:value': [
        value
      ]
    }

    return h
  },
  get_json_role (type, firstname, lastname, institution, date, identifiers) {
    var h = {
      '@type': type
    }
    if (firstname) {
      h['schema:givenName'] = [
        {
          '@value': firstname
        }
      ]
    }
    if (lastname) {
      h['schema:familyName'] = [
        {
          '@value': lastname
        }
      ]
    }
    if (institution) {
      h['schema:name'] = [
        {
          '@value': institution
        }
      ]
    }
    if (date) {
      h['dcterms:date'] = [
        date
      ]
    }
    if (identifiers) {
      h['skos:exactMatch'] = identifiers
    }
    return h
  },
  get_json_project (name, nameLanguage, description, descriptionLanguage, identifiers, homepage) {
    var h = {
      '@type': 'foaf:Project'
    }
    if (name) {
      h['skos:prefLabel'] = [
        {
          '@value': name
        }
      ]
    }
    if (nameLanguage) {
      h['skos:prefLabel'][0]['@language'] = nameLanguage
    }
    if (description) {
      h['rdfs:comment'] = [
        {
          '@value': description
        }
      ]
    }
    if (descriptionLanguage) {
      h['rdfs:comment'][0]['@language'] = descriptionLanguage
    }
    if (identifiers) {
      h['skos:exactMatch'] = identifiers
    }
    if (homepage) {
      h['foaf:homepage'] = [
        homepage
      ]
    }
    return h
  },
  get_json_funder (name, nameLanguage, identifiers) {
    var h = {
      '@type': 'frapo:FundingAgency'
    }
    if (name) {
      h['skos:prefLabel'] = [
        {
          '@value': name
        }
      ]
    }
    if (nameLanguage) {
      h['skos:prefLabel'][0]['@language'] = nameLanguage
    }
    if (identifiers) {
      h['skos:exactMatch'] = identifiers
    }
    return h
  },
  validate_object (object) {
    if (!object['@type']) {
      console.error('JSON-LD validation: missing @type attribute', object)
      return false
    }
    return true
  },
  push_object (jsonld, predicate, object) {
    if (this.validate_object(object)) {
      if (!jsonld[predicate]) {
        jsonld[predicate] = []
      }
      jsonld[predicate].push(object)
    }
  },
  push_literal (jsonld, predicate, value) {
    if (!jsonld[predicate]) {
      jsonld[predicate] = []
    }
    jsonld[predicate].push(value)
  },
  push_value (jsonld, predicate, valueobject) {
    if (!jsonld[predicate]) {
      jsonld[predicate] = []
    }
    jsonld[predicate].push(valueobject)
  },
  containerForm2json (formData) {
    var jsonlds = {}
    jsonlds['container'] = {}

    for (var i = 0; i < formData.sections.length; i++) {
      var s = formData.sections[i]
      var jsonldid = 'container'
      if (s.type === 'member') {
        jsonldid = 'member_' + s.id
        jsonlds[jsonldid] = {}
      }
      if (s.type === 'phaidra:Subject') {
        jsonldid = 'subject-' + i
        jsonlds[jsonldid] = {
          '@type': 'phaidra:Subject'
        }
      }
      if (s.type === 'phaidra:DigitizedObject') {
        jsonldid = 'digitized-object'
        jsonlds[jsonldid] = {}
      }

      this.form2json(jsonlds[jsonldid], s)
    }

    Object.keys(jsonlds).forEach(function (key) {
      if (key === 'digitized-object') {
        jsonlds['container']['prov:wasDerivedFrom'] = jsonlds[key]
        jsonlds['container']['prov:wasDerivedFrom']['@type'] = 'phaidra:DigitizedObject'
        delete jsonlds[key]
      }
      if (key.startsWith('subject-')) {
        if (!jsonlds['container']['dcterms:subject']) {
          jsonlds['container']['dcterms:subject'] = []
        }
        jsonlds['container']['dcterms:subject'].push(jsonlds[key])
        delete jsonlds[key]
      }
    })

    return jsonlds
  },
  form2json (jsonld, formData) {
    for (var j = 0; j < formData.fields.length; j++) {
      var f = formData.fields[j]

      switch (f.predicate) {

        case 'dce:title':
          if (f.title) {
            this.push_object(jsonld, f.predicate, this.get_json_dce_title(f.title, f.subtitle, f.language))
          }
          break

        case 'bf:note':
          if (f.value) {
            this.push_object(jsonld, f.predicate, this.get_json_bf_note(f.value, f.language, f.type))
          }
          break

        case 'dcterms:language':
          if (f.value) {
            this.push_literal(jsonld, f.predicate, f.value)
          }
          break

        case 'dcterms:type':
          if (f.value) {
            this.push_literal(jsonld, f.predicate, f.value)
          }
          break

        case 'role':
          if (f.role && (f.firstname || f.lastname || f.institution || f.identifier)) {
            this.push_object(jsonld, 'role:' + f.role, this.get_json_role(f.type, f.firstname, f.lastname, f.institution, f.date, [f.identifier]))
          }
          break

        case 'edm:rights':
          if (f.value) {
            this.push_literal(jsonld, f.predicate, f.value)
          }
          break

        case 'dce:rights':
        case 'schema:temporalCoverage':
          if (f.value) {
            this.push_value(jsonld, f.predicate, this.get_json_valueobject(f.value, f.language))
          }
          break

        case 'opaque:ethnographic':
        case 'dce:subject':
          if (f.value) {
            this.push_object(jsonld, f.predicate, this.get_json_object([{ '@value': f.value, '@language': f.language }], null, 'skos:Concept'))
          }
          break

        case 'frapo:isOutputOf':
          if (f.name || f.identifier || f.description || f.homepage) {
            this.push_object(jsonld, f.predicate, this.get_json_project(f.name, f.nameLanguage, f.description, f.descriptionLanguage, [f.identifier], f.homepage))
          }
          break

        case 'frapo:hasFundingAgency':
          if (f.name || f.identifier) {
            this.push_object(jsonld, f.predicate, this.get_json_funder(f.name, f.nameLanguage, [f.identifier]))
          }
          break

        case 'opaque:cco_accessionNumber':
          if (f.value) {
            this.push_literal(jsonld, f.predicate, f.value)
          }
          break

        case 'bf:shelfMark':
          if (f.value) {
            this.push_literal(jsonld, f.predicate, f.value)
          }
          break

        case 'bf:physicalLocation':
          if (f.value) {
            this.push_value(jsonld, f.predicate, this.get_json_valueobject(f.value, f.language))
          }
          break

        case 'vra:hasInscription':
          if (f.component === 'p-select' && f.value) {
            this.push_object(jsonld, f.predicate, this.get_json_object(null, null, 'vra:Inscription', f.value))
          } else {
            if (f.value) {
              this.push_object(jsonld, f.predicate, this.get_json_object([{ '@value': f.value, '@language': f.language }], null, 'vra:Inscription'))
            }
          }
          break

        case 'vra:material':
          if (f.value) {
            this.push_object(jsonld, f.predicate, this.get_json_object([{ '@value': f.value, '@language': f.language }], null, 'vra:Material'))
          }
          break

        case 'vra:hasTechnique':
          if (f.component === 'p-select' && f.value) {
            this.push_object(jsonld, f.predicate, this.get_json_object(f['skos:prefLabel'], null, 'vra:Technique', f.value))
          } else {
            if (f.value) {
              this.push_object(jsonld, f.predicate, this.get_json_object([{ '@value': f.value, '@language': f.language }], null, 'vra:Technique'))
            }
          }
          break

        case 'schema:width':
        case 'schema:height':
        case 'schema:depth':
        case 'schema:weight':
          if (f.value) {
            this.push_object(jsonld, f.predicate, this.get_json_quantitativevalue(f.value, f.unitCode))
          }
          break

        case 'dcterms:provenance':
          if (f.value) {
            this.push_object(jsonld, f.predicate, this.get_json_object([{ '@value': f.value, '@language': f.language }], null, 'dcterms:ProvenanceStatement'))
          }
          break

        case 'dcterms:spatial':
          if (f.component === 'p-gbv-suggest-getty' && f.value) {
            this.push_object(jsonld, f.predicate, this.get_json_spatial(f['skos:prefLabel'], f['skos:prefLabel'], f.coordinates, 'schema:Place', [f.value]))
          } else {
            if (f.value) {
              this.push_object(jsonld, f.predicate, this.get_json_object([{ '@value': f.value, '@language': f.language }], null, 'schema:Place'))
            }
          }
          break

        case 'ebucore:filename':
          if (f.value) {
            this.push_literal(jsonld, f.predicate, f.value)
          }
          break

        case 'ebucore:hasMimeType':
          if (f.value) {
            this.push_literal(jsonld, f.predicate, f.value)
          }
          break

        default:
          console.error('form2json: unrecognized predicate ', f.predicate, f)
      }
    }
    return jsonld
  }
}
