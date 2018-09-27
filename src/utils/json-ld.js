export default {
  formDataToJsonLD (formData) {
    var jsonlds = {}
    jsonlds['container'] = {}

    for (var i = 0; i < formData.sections.length; i++) {
      var s = formData.sections[i]
      var jsonldid = 'container'
      if (s.type === 'member') {
        jsonldid = 'member_' + s.id
        jsonlds[jsonldid] = {}
      }
      if (s.id === 'secondary') {
        jsonldid = 'secondary'
        jsonlds[jsonldid] = {}
      }

      for (var j = 0; j < s.fields.length; j++) {
        var f = s.fields[j]

        switch (f.predicate) {

          case 'dce:title':
            if (f.title) {
              var titledef = {
                '@type': 'bf:Title',
                'bf:mainTitle': {
                  '@value': f.title
                }
              }
              if (f.language) {
                titledef['bf:mainTitle']['@language'] = f.language
              }
              if (f.subtitle) {
                titledef['bf:subtitle'] = {
                  '@value': f.subtitle
                }
                if (f.language) {
                  titledef['bf:subtitle']['@language'] = f.language
                }
              }
              if (!jsonlds[jsonldid]['dce:title']) {
                jsonlds[jsonldid]['dce:title'] = []
              }
              jsonlds[jsonldid]['dce:title'].push(titledef)
            }
            break

          case 'funding':
            if ((f.projectName) || (f.projectId)) {
              var projectdef = {
                '@type': 'foaf:Project'
              }
              if (f.projectName) {
                projectdef['rdfs:label'] = {
                  '@value': f.projectName
                }
              }
              if (f.projectNameLanguage) {
                projectdef['rdfs:label']['@language'] = f.projectNameLanguage
              }
              if (f.projectId) {
                projectdef['skos:exactMatch'] = f.projectId
              }
              if (!jsonlds[jsonldid]['frapo:isOutputOf']) {
                jsonlds[jsonldid]['frapo:isOutputOf'] = []
              }
              jsonlds[jsonldid]['frapo:isOutputOf'].push(projectdef)
            }
            if (f.funderName || f.funderId) {
              var funderdef = {
                '@type': 'frapo:FundingAgency'
              }
              if (f.funderName) {
                funderdef['rdfs:label'] = {
                  '@value': f.funderName
                }
              }
              if (f.funderNameLanguage) {
                funderdef['rdfs:label']['@language'] = f.funderNameLanguage
              }
              if (f.funderId) {
                funderdef['skos:exactMatch'] = f.funderId
              }
              if (!jsonlds[jsonldid]['frapo:hasFundingAgency']) {
                jsonlds[jsonldid]['frapo:hasFundingAgency'] = []
              }
              jsonlds[jsonldid]['frapo:hasFundingAgency'].push(funderdef)
            }
            break

          case 'bf:note':
            if (f.value) {
              var notedef = {
                'rdfs:label': {
                  '@value': f.value
                }
              }
              if (f.language) {
                notedef['rdfs:label']['@language'] = f.language
              }
              if (f.bfnotetype) {
                notedef['bf:noteType'] = f.bfnotetype
              }
              if (!jsonlds[jsonldid]['bf:note']) {
                jsonlds[jsonldid]['bf:note'] = []
              }
              jsonlds[jsonldid]['bf:note'].push(notedef)
            }
            break

          case 'dce:subject':
            if (f.value) {
              var subdef = {
                '@type': 'skos:Concept',
                'skos:prefLabel': {
                  '@value': f.value
                }
              }
              if (f.language) {
                subdef['skos:prefLabel']['@language'] = f.language
              }
              if (!jsonlds[jsonldid]['dce:subject']) {
                jsonlds[jsonldid]['dce:subject'] = []
              }
              jsonlds[jsonldid]['dce:subject'].push(subdef)
            }
            break

          case 'dcterms:spatial':
            if (f.component === 'p-text-field') {
              var spaconceptdef = {
                '@type': 'skos:Concept',
                'skos:prefLabel': {
                  '@value': f.value
                }
              }
              if (f.language) {
                spaconceptdef['skos:prefLabel']['@language'] = f.language
              }
              if (!jsonlds[jsonldid]['dcterms:spatial']) {
                jsonlds[jsonldid]['dcterms:spatial'] = []
              }
              jsonlds[jsonldid]['dcterms:spatial'].push(spaconceptdef)
            }
            if (f.component === 'p-gbv-suggest-getty') {
              if (f.prefLabel && (f.prefLabel.length > 0)) {
                var spadef = {
                  '@type': 'schema:Place'
                }
                if (f.value) {
                  spadef['skos:exactMatch'] = [f.value]
                }
                if (f.prefLabel) {
                  spadef['skos:prefLabel'] = f.prefLabel
                }
                if (f.path) {
                  spadef['rdfs:label'] = f.path
                }
                if (f.coordinates) {
                  spadef['schema:geo'] = {
                    '@type': 'schema:GeoCoordinates',
                    'schema:latitude': f.coordinates['schema:latitude'],
                    'schema:longitude': f.coordinates['schema:longitude']
                  }
                }
                if (!jsonlds[jsonldid]['dcterms:spatial']) {
                  jsonlds[jsonldid]['dcterms:spatial'] = []
                }
                jsonlds[jsonldid]['dcterms:spatial'].push(spadef)
              }
            }
            break

          case 'dce:rights':
            if (f.value) {
              var rdef = {
                '@value': f.value
              }
              if (f.language) {
                rdef['@language'] = f.language
              }
              if (!jsonlds[jsonldid]['dce:rights']) {
                jsonlds[jsonldid]['dce:rights'] = []
              }
              jsonlds[jsonldid]['dce:rights'].push(rdef)
            }
            break

          case 'dce:format':
            if (f.value) {
              if (!jsonlds[jsonldid]['dce:format']) {
                jsonlds[jsonldid]['dce:format'] = []
              }
              jsonlds[jsonldid]['dce:format'].push(f.value)
            }
            break

          case 'opaque:digitalOrigin':
            if (f.value) {
              var dodef = {
                '@value': f.value
              }
              if (f.language) {
                dodef['@language'] = f.language
              }
              if (!jsonlds[jsonldid]['opaque:digitalOrigin']) {
                jsonlds[jsonldid]['opaque:digitalOrigin'] = []
              }
              jsonlds[jsonldid]['opaque:digitalOrigin'].push(dodef)
            }
            break

          case 'schema:temporalCoverage':
            if (f.value) {
              var tcdef = {
                '@value': f.value
              }
              if (f.language) {
                tcdef['@language'] = f.language
              }
              if (!jsonlds[jsonldid]['schema:temporalCoverage']) {
                jsonlds[jsonldid]['schema:temporalCoverage'] = []
              }
              jsonlds[jsonldid]['schema:temporalCoverage'].push(tcdef)
            }
            break

          case 'role':
            if (f.role && (f.firstname || f.lastname || f.institution)) {
              var roledef = {
                '@type': f.type
              }
              if (f.firstname) {
                roledef['schema:givenName'] = {
                  '@value': f.firstname
                }
              }
              if (f.lastname) {
                roledef['schema:familyName'] = {
                  '@value': f.lastname
                }
              }
              if (f.institution) {
                roledef['schema:name'] = {
                  '@value': f.institution
                }
              }
              if (f.date) {
                roledef['dcterms:date'] = f.date
              }
              if (!jsonlds[jsonldid]['role:' + f.role]) {
                jsonlds[jsonldid]['role:' + f.role] = []
              }
              jsonlds[jsonldid]['role:' + f.role].push(roledef)
            }
            break

          case 'dcterms:provenance':
            if (f.value) {
              var provdef = {
                '@type': 'dcterms:ProvenanceStatement',
                'rdfs:label': {
                  '@value': f.value,
                  '@language': f.language
                }
              }
              if (f.language) {
                provdef['rdfs:label']['@language'] = f.language
              }
              if (!jsonlds[jsonldid]['dctems:provenance']) {
                jsonlds[jsonldid]['dctems:provenance'] = []
              }
              jsonlds[jsonldid]['dctems:provenance'].push(provdef)
            }
            break

          case 'schema:height':
            if (f.heigh) {
            }
            break

          case 'vra:hasInscription':
            if (f.value) {
              var inscdef = {
                '@type': 'vra:Inscription',
                'vra:text': {
                  '@value': f.value,
                  '@language': f.language
                }
              }
              if (f.language) {
                inscdef['vra:text']['@language'] = f.language
              }
              if (!jsonlds[jsonldid]['vra:hasInscription']) {
                jsonlds[jsonldid]['vra:hasInscription'] = []
              }
              jsonlds[jsonldid]['vra:hasInscription'].push(inscdef)
            }
            break

          default:
            if (f.predicate) {
              if (f.value) {
                if (!jsonlds[jsonldid][f.predicate]) {
                  jsonlds[jsonldid][f.predicate] = []
                }
                jsonlds[jsonldid][f.predicate].push(f.value)
              }
            }
        }
      }
    }
    return jsonlds
  }
}
