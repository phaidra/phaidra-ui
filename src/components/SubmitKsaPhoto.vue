<template>
  <v-container grid-list-lg class="ksa-submit" >

    <p-submit-form :definition="form"></p-submit-form>

  </v-container>
 
</template>

<script>
import PSubmitForm from '@/components/PSubmitForm'

export default {
  name: 'submit-ksa-photo',
  components: {
    PSubmitForm
  },
  data () {
    return {
      form: {
        sections: [
          {
            title: 'General',
            id: 'general',
            fields: [
              {
                id: 100,
                predicate: 'dcterms:type',
                metadataset: 'digital',
                component: 'p-select',
                vocabulary: 'http://purl.org/coar/resource_type',
                required: true,
                multiplicable: false,
                label: 'Resource type',
                value: 'http://purl.org/coar/resource_type/c_ecc8',
                'skos:prefLabel': []
              },
              {
                id: 101,
                predicate: 'dce:title',
                metadataset: 'digital',
                component: 'p-title',
                required: true,
                multiplicable: true,
                multilingual: true,
                ordergroup: 'title',
                label: 'Title',
                title: '',
                subtitle: '',
                language: 'deu'
              },
              {
                id: 102,
                predicate: 'bf:note',
                type: 'bf:Note',
                metadataset: 'digital',
                component: 'p-text-field',
                multiplicable: true,
                multilingual: true,
                multiline: true,
                label: 'Description',
                value: '',
                language: 'deu'
              },
              {
                id: 103,
                predicate: 'opaque:ethnographic',
                metadataset: 'digital',
                component: 'p-text-field-suggest',
                suggester: 'ethnographicsuggester',
                multiplicable: true,
                multilingual: true,
                label: 'Sociocultural category',
                value: '',
                language: 'deu'
              },
              {
                id: 104,
                predicate: 'dcterms:language',
                metadataset: 'digital',
                component: 'p-select',
                vocabulary: 'iso639-2',
                required: true,
                multiplicable: true,
                label: 'Language',
                value: 'deu',
                'skos:prefLabel': []
              },
              {
                id: 105,
                predicate: 'role',
                type: 'schema:Person',
                metadataset: 'digital',
                component: 'p-entity',
                multiplicable: true,
                showidentifier: false,
                ordered: true,
                ordergroup: 'general-entity',
                label: 'Contributions',
                firstname: '',
                lastname: '',
                role: '',
                date: ''
              },
              {
                id: 106,
                predicate: 'bf:note',
                type: 'phaidra:Remark',
                metadataset: 'digital',
                component: 'p-text-field',
                multilingual: true,
                multiline: true,
                label: 'Note',
                value: '',
                language: 'deu'
              },
              {
                id: 107,
                predicate: 'dce:subject',
                metadataset: 'digital',
                component: 'p-text-field-suggest',
                suggester: 'keywordsuggester',
                multiplicable: true,
                multilingual: true,
                label: 'Keyword',
                value: '',
                language: 'deu'
              },
              {
                id: 108,
                predicate: 'frapo:isOutputOf',
                metadataset: 'digital',
                component: 'p-project',
                name: '',
                nameLanguage: 'deu',
                description: '',
                descriptionLanguage: 'deu',
                identifier: '',
                homepage: ''
              },
              {
                id: 109,
                predicate: 'frapo:hasFundingAgency',
                metadataset: 'digital',
                component: 'p-funder',
                name: '',
                nameLanguage: 'deu',
                identifier: ''
              }
            ]
          },
          {
            title: 'Digitized object',
            id: 'digitized',
            type: 'phaidra:DigitizedObject',
            fields: [
              {
                id: 200,
                predicate: 'bf:shelfMark',
                metadataset: 'analog',
                component: 'p-text-field',
                multiplicable: true,
                label: 'Call number',
                value: ''
              },
              {
                id: 201,
                predicate: 'schema:temporalCoverage',
                metadataset: 'analog',
                component: 'p-text-field',
                label: 'Temporal coverage',
                multilingual: true,
                value: '',
                language: 'deu'
              },
              {
                id: 202,
                predicate: 'dcterms:provenance',
                metadataset: 'analog',
                component: 'p-text-field',
                multiline: true,
                multilingual: true,
                label: 'Provenance',
                value: '',
                language: 'deu'
              },
              {
                id: 203,
                predicate: 'bf:physicalLocation',
                metadataset: 'digital',
                component: 'p-text-field',
                label: 'Physical location',
                multilingual: true,
                value: '',
                language: 'deu'
              },
              {
                id: 204,
                predicate: 'opaque:cco_accessionNumber',
                metadataset: 'analog',
                component: 'p-text-field',
                label: 'Accession number',
                value: ''
              },
              {
                id: 205,
                predicate: 'bf:note',
                type: 'phaidra:ConditionNote',
                metadataset: 'analog',
                component: 'p-text-field',
                multilingual: true,
                multiline: true,
                label: 'Condition',
                value: '',
                language: 'deu'
              },
              {
                id: 206,
                predicate: 'bf:note',
                type: 'phaidra:ReproductionNote',
                metadataset: 'analog',
                component: 'p-select',
                vocabulary: 'original-copy',
                label: 'Reproduction note',
                value: '',
                'skos:prefLabel': []
              },
              {
                id: 208,
                predicate: 'vra:hasTechnique',
                type: 'vra:Technique',
                metadataset: 'analog',
                component: 'p-select',
                vocabulary: 'getty-aat-photo',
                label: 'Technique',
                value: '',
                'skos:prefLabel': []
              },
              {
                id: 209,
                predicate: 'vra:hasTechnique',
                type: 'vra:Technique',
                metadataset: 'analog',
                component: 'p-text-field',
                multilingual: true,
                multiplicable: true,
                label: 'Technique',
                value: '',
                language: 'deu',
                'skos:prefLabel': []
              },
              {
                id: 210,
                predicate: 'vra:material',
                type: 'vra:Material',
                metadataset: 'analog',
                component: 'p-text-field',
                multilingual: true,
                multiplicable: true,
                label: 'Material description',
                value: '',
                language: 'deu'
              },
              {
                id: 211,
                predicate: 'schema:height',
                metadataset: 'analog',
                component: 'p-dimension',
                label: 'Height',
                unit: 'CMT',
                value: ''
              },
              {
                id: 212,
                predicate: 'schema:width',
                metadataset: 'analog',
                component: 'p-dimension',
                label: 'Width',
                unit: 'CMT',
                value: ''
              },
              {
                id: 213,
                predicate: 'vra:hasInscription',
                metadataset: 'analog',
                component: 'p-text-field-suggest',
                suggester: 'inscriptionsuggester',
                multiplicable: true,
                multilingual: true,
                label: 'Inscription/Stamp',
                value: '',
                language: 'deu'
              },
              {
                id: 215,
                predicate: 'dcterms:spatial',
                metadataset: 'analog',
                component: 'p-gbv-suggest-getty',
                multiplicable: true,
                voc: 'tgn',
                label: 'Place',
                value: '',
                'rdfs:label': [],
                'skos:prefLabel': []
              },
              {
                id: 216,
                predicate: 'dcterms:spatial',
                metadataset: 'analog',
                component: 'p-text-field',
                multilingual: true,
                multiplicable: true,
                label: 'Place (native name)',
                value: '',
                language: 'deu'
              }
            ]
          },
          {
            title: 'Depicted object',
            id: 'subject-represented',
            type: 'phaidra:Subject',
            fields: [
              {
                id: 300,
                predicate: 'dce:title',
                metadataset: 'subject-represented',
                component: 'p-title',
                required: true,
                multiplicable: true,
                multilingual: true,
                ordergroup: 'title',
                label: 'Title',
                title: '',
                subtitle: '',
                language: 'deu'
              },
              {
                id: 301,
                predicate: 'bf:note',
                type: 'bf:Note',
                metadataset: 'subject-represented',
                component: 'p-text-field',
                multiplicable: true,
                multilingual: true,
                multiline: true,
                label: 'Description',
                value: '',
                language: 'deu'
              },
              {
                id: 302,
                predicate: 'bf:shelfMark',
                metadataset: 'subject-represented',
                component: 'p-text-field',
                multiplicable: true,
                label: 'Call number',
                value: ''
              },
              {
                id: 303,
                predicate: 'schema:temporalCoverage',
                metadataset: 'subject-represented',
                component: 'p-text-field',
                multilingual: true,
                label: 'Temporal coverage',
                value: '',
                language: 'deu'
              },
              {
                id: 304,
                predicate: 'dcterms:provenance',
                metadataset: 'subject-represented',
                component: 'p-text-field',
                multiline: true,
                multilingual: true,
                label: 'Provenance',
                value: '',
                language: 'deu'
              },
              {
                id: 305,
                predicate: 'bf:physicalLocation',
                metadataset: 'subject-represented',
                component: 'p-text-field',
                label: 'Physical location',
                value: '',
                language: 'deu'
              },
              {
                id: 306,
                predicate: 'role',
                type: 'schema:Person',
                metadataset: 'subject-represented',
                component: 'p-entity',
                multiplicable: true,
                showidentifier: false,
                ordered: true,
                ordergroup: 'general-entity',
                label: 'Contributions',
                firstname: '',
                lastname: '',
                identifier: '',
                role: '',
                date: ''
              },
              {
                id: 307,
                predicate: 'opaque:cco_accessionNumber',
                metadataset: 'subject-represented',
                component: 'p-text-field',
                label: 'Accession number',
                value: ''
              },
              {
                id: 308,
                predicate: 'vra:hasTechnique',
                type: 'vra:Technique',
                metadataset: 'analog',
                component: 'p-text-field',
                multilingual: true,
                multiplicable: true,
                label: 'Technique',
                value: '',
                language: 'deu'
              },
              {
                id: 309,
                predicate: 'vra:material',
                type: 'vra:Material',
                metadataset: 'subject-represented',
                component: 'p-text-field',
                multilingual: true,
                multiplicable: true,
                label: 'Material description',
                value: '',
                language: 'deu'
              },
              {
                id: 310,
                predicate: 'schema:height',
                metadataset: 'analog',
                component: 'p-dimension',
                label: 'Height',
                unit: 'CMT',
                value: ''
              },
              {
                id: 311,
                predicate: 'schema:width',
                metadataset: 'analog',
                component: 'p-dimension',
                label: 'Width',
                unit: 'CMT',
                value: ''
              },
              {
                id: 312,
                predicate: 'schema:depth',
                metadataset: 'analog',
                component: 'p-dimension',
                label: 'Depth',
                unit: 'CMT',
                value: ''
              }
            ]
          },
          {
            title: 'File',
            id: 32,
            type: 'member',
            multiplicable: true,
            fields: [
              {
                id: 500,
                predicate: 'ebucore:filename',
                metadataset: 'digital',
                component: 'input-file',
                label: 'Datei',
                value: ''
              },
              {
                id: 501,
                predicate: 'dce:title',
                metadataset: 'digital',
                component: 'p-title',
                required: true,
                multiplicable: true,
                multilingual: true,
                ordergroup: 'title',
                label: 'Title',
                title: '',
                subtitle: '',
                language: 'deu'
              },
              {
                id: 502,
                predicate: 'bf:note',
                type: 'bf:Note',
                metadataset: 'digital',
                component: 'p-text-field',
                multiplicable: true,
                multilingual: true,
                multiline: true,
                label: 'Description',
                value: '',
                language: 'deu'
              },
              {
                id: 504,
                predicate: 'ebucore:hasMimeType',
                metadataset: 'digital',
                component: 'p-select',
                vocabulary: 'mime-types',
                label: 'MIME type',
                value: 'image/tiff',
                'skos:prefLabel': []
              },
              {
                id: 505,
                predicate: 'bf:note',
                type: 'phaidra:DigitizationNote',
                metadataset: 'digital',
                component: 'p-text-field',
                multilingual: true,
                multiline: true,
                label: 'Digitization note',
                value: '',
                language: 'deu'
              },
              {
                id: 506,
                predicate: 'role',
                type: 'schema:Person',
                metadataset: 'digital',
                component: 'p-entity',
                multiplicable: true,
                showdate: true,
                showidentifier: false,
                ordergroup: 'file-entity',
                firstname: '',
                lastname: '',
                role: '',
                date: ''
              },
              {
                id: 507,
                predicate: 'edm:rights',
                metadataset: 'digital',
                component: 'p-select',
                vocabulary: 'licenses',
                label: 'License',
                value: '',
                'skos:prefLabel': []
              },
              {
                id: 508,
                predicate: 'dce:rights',
                metadataset: 'digital',
                component: 'p-text-field',
                multiline: true,
                multilingual: true,
                label: 'Rights statement',
                value: '',
                language: 'deu'
              }
            ]
          }
        ]
      }
    }
  }
}
</script>

<style>
.ksa-submit .v-label {
  color: rgba(0, 0, 0, 0.8) !important;
}
</style>
