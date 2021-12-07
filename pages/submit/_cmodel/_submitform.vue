<template>
  <v-container fluid>
    <v-alert :value="validationError" dismissible type="error" transition="slide-y-transition">
      <span>{{ $t('Please fill in the required fields') }}</span>
      <template v-if="fieldsMissing.length > 0">
        <br/>
        <span>{{ $t('Some required fields are missing') }}:</span>
        <ul>
          <li v-for="(f, i) in fieldsMissing" :key="'mfld'+i">{{ f }}</li>
        </ul>
      </template>
    </v-alert>
    <v-row>
      <v-col>
        <client-only>
        <p-i-form
          :form="form"
          :rights="rights"
          :enablerights="true"
          :validate="validate"
          v-on:load-form="form = $event"
          v-on:object-created="objectCreated($event)"
          v-on:add-phaidrasubject-section="addPhaidrasubjectSection($event)"
          v-on:input-rights="rights = $event"
        ></p-i-form>
        </client-only>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import fields from 'phaidra-vue-components/src/utils/fields'
import { context } from '../../../mixins/context'
import { formvalidation } from '../../../mixins/formvalidation'
import { cmodels } from '../../../utils/cmodels'

export default {
  mixins: [ context, formvalidation ],
  computed: {
    cmodelparam: function () {
      return this.$route.params.cmodel
    },
    submitformparam: function () {
      return this.$route.params.submitform
    },
    cmodel: function () {
      for (let cm of this.cmodels) {
        if (cm.cmodelparam === this.cmodelparam) {
          return cm
        }
      }
      return { text: '' }
    }
  },
  data () {
    return {
      form: { sections: [] },
      rights: {},
      cmodels
    }
  },
  methods: {
    objectCreated: function (event) {
      this.$router.push(this.localeLocation({ path: `detail/${event}`}))
      this.$vuetify.goTo(0)
    },
    getField: function (fieldId) {
      let field = fields.getField(fieldId)
      field.removable = true
      return field
    },
    getPictureDigitalGeneralSection: function () {
      let s = []

      let rt = this.getField('resource-type')
      rt.value = this.cmodel.value
      s.push(rt)

      let ot = this.getField('object-type-checkboxes')
      ot.resourceType = this.cmodel.value
      s.push(ot)

      s.push(this.getField('title'))

      s.push(this.getField('role-extended'))

      s.push(this.getField('description'))

      s.push(this.getField('note'))

      s.push(this.getField('language'))

      let dc = this.getField('date-edtf')
      dc.type = 'dcterms:created'
      s.push(dc)

      let pc = this.getField('spatial-getty')
      pc.type = 'vra:placeOfCreation'
      s.push(pc)

      s.push(this.getField('keyword'))

      s.push(this.getField('gnd-subject'))

      s.push(this.getField('temporal-coverage'))

      let psc = this.getField('spatial-getty')
      psc.type = 'dcterms:spatial'
      s.push(psc)

      s.push(this.getField('association'))

      return s
    },
    getPicturePOGeneralSection: function () {
      let s = []

      let rt = this.getField('resource-type')
      rt.value = this.cmodel.value
      s.push(rt)

      let ot = this.getField('object-type-checkboxes')
      ot.resourceType = this.cmodel.value
      s.push(ot)

      s.push(this.getField('title'))

      s.push(this.getField('role-extended'))

      s.push(this.getField('description'))

      s.push(this.getField('digitization-note'))

      s.push(this.getField('language'))

      let dc = this.getField('date-edtf')
      dc.type = 'dcterms:created'
      s.push(dc)

      s.push(this.getField('keyword'))

      s.push(this.getField('gnd-subject'))

      s.push(this.getField('temporal-coverage'))

      let sc = this.getField('spatial-getty')
      sc.type = 'dcterms:spatial'
      s.push(sc)

      s.push(this.getField('association'))

      return s
    },
    getPictureDigitalFileSection: function () {
      let s = []
      s.push(this.getField('file'))

      s.push(this.getField('license'))

      s.push(this.getField('rights'))

      return s
    },
    getPicturePOFileSection: function () {
      let s = []
      s.push(this.getField('file'))

      s.push(this.getField('license'))

      s.push(this.getField('rights'))

      return s
    },
    getPictureDigitizedFileSection: function () {
      let s = []
      s.push(this.getField('file'))

      s.push(this.getField('license'))

      s.push(this.getField('rights'))

      return s
    },
    getPictureDigitizedSubjectSection: function () {
      let s = []

      s.push(this.getField('role-extended'))

      s.push(this.getField('condition-note'))

      s.push(this.getField('reproduction-note'))

      s.push(this.getField('inscription'))

      s.push(this.getField('provenance'))

      let dc = this.getField('date-edtf')
      dc.type = 'dcterms:created'
      s.push(dc)

      let pc = this.getField('spatial-getty')
      pc.type = 'vra:placeOfCreation'
      s.push(pc)

      s.push(this.getField('physical-location'))

      s.push(this.getField('shelf-mark'))

      s.push(this.getField('accession-number'))

      s.push(this.getField('material-text'))

      s.push(this.getField('material-vocab'))

      s.push(this.getField('technique-text'))

      s.push(this.getField('technique-vocab'))

      s.push(this.getField('width'))

      s.push(this.getField('height'))

      return s
    },
    getPictureMapFileSection: function () {
      let s = []
      s.push(this.getField('file'))

      s.push(this.getField('license'))

      s.push(this.getField('rights'))

      return s
    },
    getDocumentDigitalFileSection: function () {
      let s = []
      s.push(this.getField('file'))

      s.push(this.getField('license'))

      s.push(this.getField('rights'))

      return s
    },
    getDocumentPosterFileSection: function () {
      let s = []
      s.push(this.getField('file'))

      s.push(this.getField('license'))

      s.push(this.getField('rights'))

      return s
    },
    getDocumentDigitizedFileSection: function () {
      let s = []
      s.push(this.getField('file'))

      s.push(this.getField('license'))

      s.push(this.getField('rights'))

      return s
    },
    getAudioDigitalFileSection: function () {
      let s = []
      s.push(this.getField('file'))

      s.push(this.getField('dce-format-vocab'))

      s.push(this.getField('duration'))

      s.push(this.getField('license'))

      s.push(this.getField('rights'))

      return s
    },
    getAudioDigitizedFileSection: function () {
      let s = []
      s.push(this.getField('file'))

      s.push(this.getField('dce-format-vocab'))

      s.push(this.getField('duration'))

      s.push(this.getField('license'))

      s.push(this.getField('rights'))

      return s
    },
    getVideoDigitalFileSection: function () {
      let s = []
      s.push(this.getField('file'))

      s.push(this.getField('dce-format-vocab'))

      s.push(this.getField('duration'))

      s.push(this.getField('license'))

      s.push(this.getField('rights'))

      return s
    },
    getVideoDigitizedFileSection: function () {
      let s = []
      s.push(this.getField('file'))

      s.push(this.getField('dce-format-vocab'))

      s.push(this.getField('duration'))

      s.push(this.getField('license'))

      s.push(this.getField('rights'))

      return s
    },
    getDataGeneralFileSection: function () {
      let s = []
      s.push(this.getField('file'))

      s.push(this.getField('dce-format-vocab'))

      s.push(this.getField('license'))

      s.push(this.getField('rights'))

      return s
    },
    getDataResearchdataFileSection: function () {
      let s = []
      s.push(this.getField('file'))

      s.push(this.getField('dce-format-vocab'))

      s.push(this.getField('license'))

      s.push(this.getField('rights'))

      return s
    },
    getPicturePOSubjectSection: function () {
      let s = []

      s.push(this.getField('role-extended'))

      s.push(this.getField('condition-note'))

      s.push(this.getField('reproduction-note'))

      s.push(this.getField('provenance'))

      s.push(this.getField('inscription'))

      let d = this.getField('date-edtf')
      d.type = 'dcterms:date'
      s.push(d)

      let dc = this.getField('date-edtf')
      dc.type = 'dcterms:created'
      s.push(dc)

      let pc = this.getField('spatial-getty')
      pc.type = 'vra:placeOfCreation'
      s.push(pc)

      s.push(this.getField('physical-location'))

      s.push(this.getField('shelf-mark'))

      s.push(this.getField('accession-number'))

      s.push(this.getField('material-text'))

      s.push(this.getField('material-vocab'))

      s.push(this.getField('technique-text'))

      s.push(this.getField('technique-vocab'))

      s.push(this.getField('width'))

      s.push(this.getField('height'))

      s.push(this.getField('depth'))

      return s
    },
    getPictureDigitizedGeneralSection: function () {
      let s = []

      let rt = this.getField('resource-type')
      rt.value = this.cmodel.value
      s.push(rt)

      let ot = this.getField('object-type-checkboxes')
      ot.resourceType = this.cmodel.value
      s.push(ot)

      s.push(this.getField('title'))

      s.push(this.getField('role-extended'))

      s.push(this.getField('description'))

      s.push(this.getField('digitization-note'))

      s.push(this.getField('language'))

      let dc = this.getField('date-edtf')
      dc.type = 'dcterms:created'
      s.push(dc)

      s.push(this.getField('keyword'))

      s.push(this.getField('gnd-subject'))

      s.push(this.getField('temporal-coverage'))

      let sc = this.getField('spatial-getty')
      sc.type = 'dcterms:spatial'
      s.push(sc)

      s.push(this.getField('association'))

      return s
    },
    getPictureMapGeneralSection: function () {
      let s = []

      let rt = this.getField('resource-type')
      rt.value = this.cmodel.value
      s.push(rt)

      let ot = this.getField('object-type-checkboxes')
      ot.resourceType = this.cmodel.value
      s.push(ot)

      s.push(this.getField('title'))

      s.push(this.getField('role-extended'))

      s.push(this.getField('description'))

      s.push(this.getField('digitization-note'))

      s.push(this.getField('language'))

      let dc = this.getField('date-edtf')
      dc.type = 'dcterms:created'
      s.push(dc)

      s.push(this.getField('keyword'))

      s.push(this.getField('gnd-subject'))

      s.push(this.getField('temporal-coverage'))

      let sc = this.getField('spatial-getty')
      sc.type = 'dcterms:spatial'
      s.push(sc)

      s.push(this.getField('association'))

      return s
    },
    getPictureMapSubjectSection: function () {
      let s = []

      s.push(this.getField('role-extended'))

      s.push(this.getField('condition-note'))

      s.push(this.getField('reproduction-note'))

      s.push(this.getField('inscription'))

      s.push(this.getField('provenance'))

      s.push(this.getField('scale'))

      let ci = this.getField('series')
      ci.predicate = 'rdau:P60101'
      ci.label = this.$t('Contained in')
      s.push(ci)

      s.push(this.getField('bf-publication'))

      s.push(this.getField('physical-location'))

      s.push(this.getField('shelf-mark'))

      s.push(this.getField('accession-number'))

      s.push(this.getField('material-text'))

      s.push(this.getField('material-vocab'))

      s.push(this.getField('technique-text'))

      s.push(this.getField('technique-vocab'))

      s.push(this.getField('width'))

      s.push(this.getField('height'))

      return s
    },
    getDocumentDigitalGeneralSection: function () {
      let s = []

      let rt = this.getField('resource-type')
      rt.value = this.cmodel.value
      s.push(rt)

      let ot = this.getField('object-type-checkboxes')
      ot.resourceType = this.cmodel.value
      s.push(ot)

      s.push(this.getField('title'))

      s.push(this.getField('role-extended'))

      s.push(this.getField('description'))

      s.push(this.getField('number-of-pages'))

      s.push(this.getField('language'))

      let dc = this.getField('date-edtf')
      dc.type = 'dcterms:created'
      s.push(dc)

      let pc = this.getField('spatial-getty')
      pc.type = 'vra:placeOfCreation'
      s.push(pc)

      s.push(this.getField('keyword'))

      s.push(this.getField('gnd-subject'))

      s.push(this.getField('temporal-coverage'))

      s.push(this.getField('association'))

      return s
    },
    getDocumentPosterGeneralSection: function () {
      let s = []

      let rt = this.getField('resource-type')
      rt.value = this.cmodel.value
      s.push(rt)

      let ot = this.getField('object-type-checkboxes')
      ot.resourceType = this.cmodel.value
      s.push(ot)

      s.push(this.getField('title'))

      s.push(this.getField('role-extended'))

      s.push(this.getField('description'))

      s.push(this.getField('number-of-pages'))

      s.push(this.getField('project'))

      s.push(this.getField('language'))

      let dc = this.getField('date-edtf')
      dc.type = 'dcterms:created'
      s.push(dc)

      let pc = this.getField('spatial-getty')
      pc.type = 'vra:placeOfCreation'
      s.push(pc)

      s.push(this.getField('keyword'))

      s.push(this.getField('gnd-subject'))

      s.push(this.getField('temporal-coverage'))

      s.push(this.getField('association'))

      return s
    },
    getDocumentDigitizedGeneralSection: function () {
      let s = []

      let rt = this.getField('resource-type')
      rt.value = this.cmodel.value
      s.push(rt)

      let ot = this.getField('object-type-checkboxes')
      ot.resourceType = this.cmodel.value
      s.push(ot)

      s.push(this.getField('title'))

      s.push(this.getField('role-extended'))

      s.push(this.getField('description'))

      s.push(this.getField('number-of-pages'))

      s.push(this.getField('digitization-note'))

      s.push(this.getField('language'))

      let dc = this.getField('date-edtf')
      dc.type = 'dcterms:created'
      s.push(dc)

      s.push(this.getField('keyword'))

      s.push(this.getField('gnd-subject'))

      s.push(this.getField('temporal-coverage'))

      s.push(this.getField('association'))

      return s
    },
    getDocumentDigitizedSubjectSection: function () {
      let s = []

      let ot = this.getField('object-type-checkboxes')
      ot.resourceType = this.cmodel.value
      s.push(ot)

      s.push(this.getField('description'))

      s.push(this.getField('role-extended'))

      s.push(this.getField('condition-note'))

      s.push(this.getField('reproduction-note'))

      s.push(this.getField('provenance'))

      let d = this.getField('date-edtf')
      d.type = 'dcterms:date'
      s.push(d)

      let dc = this.getField('date-edtf')
      dc.type = 'dcterms:created'
      s.push(dc)

      let di = this.getField('date-edtf')
      di.type = 'dcterms:issued'
      s.push(di)

      let pc = this.getField('spatial-getty')
      pc.type = 'vra:placeOfCreation'
      s.push(pc)

      s.push(this.getField('physical-location'))

      s.push(this.getField('shelf-mark'))

      s.push(this.getField('number-of-pages'))

      s.push(this.getField('material-text'))

      s.push(this.getField('material-vocab'))

      s.push(this.getField('width'))

      s.push(this.getField('height'))

      return s
    },
    getAudioDigitalGeneralSection: function () {
      let s = []

      let rt = this.getField('resource-type')
      rt.value = this.cmodel.value
      s.push(rt)

      let ot = this.getField('object-type-checkboxes')
      ot.resourceType = this.cmodel.value
      s.push(ot)

      s.push(this.getField('title'))

      s.push(this.getField('role-extended'))

      s.push(this.getField('description'))

      s.push(this.getField('table-of-contents'))

      s.push(this.getField('genre'))

      s.push(this.getField('language'))

      let dc = this.getField('date-edtf')
      dc.type = 'dcterms:created'
      s.push(dc)

      let pc = this.getField('spatial-getty')
      pc.type = 'vra:placeOfCreation'
      s.push(pc)

      s.push(this.getField('keyword'))

      s.push(this.getField('gnd-subject'))

      s.push(this.getField('temporal-coverage'))

      s.push(this.getField('dce-format-vocab'))

      s.push(this.getField('duration'))

      s.push(this.getField('technique-text'))

      s.push(this.getField('technique-vocab'))

      s.push(this.getField('association'))

      return s
    },
    getAudioDigitizedGeneralSection: function () {
      let s = []

      let rt = this.getField('resource-type')
      rt.value = this.cmodel.value
      s.push(rt)

      let ot = this.getField('object-type-checkboxes')
      ot.resourceType = this.cmodel.value
      s.push(ot)

      s.push(this.getField('title'))

      s.push(this.getField('role-extended'))

      s.push(this.getField('description'))

      s.push(this.getField('digitization-note'))

      s.push(this.getField('table-of-contents'))

      s.push(this.getField('genre'))

      s.push(this.getField('language'))

      let dc = this.getField('date-edtf')
      dc.type = 'dcterms:created'
      s.push(dc)

      let pc = this.getField('spatial-getty')
      pc.type = 'vra:placeOfCreation'
      s.push(pc)

      s.push(this.getField('keyword'))

      s.push(this.getField('gnd-subject'))

      s.push(this.getField('temporal-coverage'))

      s.push(this.getField('dce-format-vocab'))

      s.push(this.getField('duration'))

      s.push(this.getField('association'))

      return s
    },
    getAudioDigitizedSubjectSection: function () {
      let s = []

      s.push(this.getField('role-extended'))

      s.push(this.getField('condition-note'))

      s.push(this.getField('reproduction-note'))

      s.push(this.getField('provenance'))

      s.push(this.getField('supplementary-content'))

      s.push(this.getField('inscription'))

      let ct = this.getField('carrier-type')
      // TODO: filter
      s.push(ct)

      let dc = this.getField('date-edtf')
      dc.type = 'dcterms:created'
      s.push(dc)

      let pc = this.getField('spatial-getty')
      pc.type = 'vra:placeOfCreation'
      s.push(pc)

      s.push(this.getField('physical-location'))

      s.push(this.getField('shelf-mark'))

      s.push(this.getField('accession-number'))

      s.push(this.getField('material-text'))

      s.push(this.getField('material-vocab'))

      s.push(this.getField('technique-text'))

      s.push(this.getField('technique-vocab'))

      return s
    },
    getVideoDigitalGeneralSection: function () {
      let s = []

      let rt = this.getField('resource-type')
      rt.value = this.cmodel.value
      s.push(rt)

      let ot = this.getField('object-type-checkboxes')
      ot.resourceType = this.cmodel.value
      s.push(ot)

      s.push(this.getField('title'))

      s.push(this.getField('role-extended'))

      s.push(this.getField('description'))

      s.push(this.getField('table-of-contents'))

      s.push(this.getField('genre'))

      s.push(this.getField('audience'))

      s.push(this.getField('language'))

      s.push(this.getField('subtitle-language'))

      let dc = this.getField('date-edtf')
      dc.type = 'dcterms:created'
      s.push(dc)

      let pc = this.getField('spatial-getty')
      pc.type = 'vra:placeOfCreation'
      s.push(pc)

      s.push(this.getField('keyword'))

      s.push(this.getField('gnd-subject'))

      s.push(this.getField('temporal-coverage'))

      s.push(this.getField('dce-format-vocab'))

      s.push(this.getField('duration'))

      s.push(this.getField('technique-text'))

      s.push(this.getField('technique-vocab'))

      s.push(this.getField('association'))

      return s
    },
    getVideoDigitizedGeneralSection: function () {
      let s = []

      let rt = this.getField('resource-type')
      rt.value = this.cmodel.value
      s.push(rt)

      let ot = this.getField('object-type-checkboxes')
      ot.resourceType = this.cmodel.value
      s.push(ot)

      s.push(this.getField('title'))

      s.push(this.getField('role-extended'))

      s.push(this.getField('description'))

      s.push(this.getField('digitization-note'))

      s.push(this.getField('table-of-contents'))

      s.push(this.getField('genre'))

      s.push(this.getField('audience'))

      s.push(this.getField('language'))

      s.push(this.getField('subtitle-language'))

      let dc = this.getField('date-edtf')
      dc.type = 'dcterms:created'
      s.push(dc)

      let pc = this.getField('spatial-getty')
      pc.type = 'vra:placeOfCreation'
      s.push(pc)

      s.push(this.getField('keyword'))

      s.push(this.getField('gnd-subject'))

      s.push(this.getField('temporal-coverage'))

      s.push(this.getField('dce-format-vocab'))

      s.push(this.getField('duration'))

      s.push(this.getField('association'))

      return s
    },
    getVideoDigitizedSubjectSection: function () {
      let s = []

      s.push(this.getField('role-extended'))

      s.push(this.getField('condition-note'))

      s.push(this.getField('reproduction-note'))

      s.push(this.getField('provenance'))

      s.push(this.getField('supplementary-content'))

      s.push(this.getField('inscription'))

      let dc = this.getField('date-edtf')
      dc.type = 'dcterms:created'
      s.push(dc)

      let pc = this.getField('spatial-getty')
      pc.type = 'vra:placeOfCreation'
      s.push(pc)

      s.push(this.getField('physical-location'))

      s.push(this.getField('shelf-mark'))

      s.push(this.getField('accession-number'))

      let ct = this.getField('carrier-type')
      // TODO: filter
      s.push(ct)

      s.push(this.getField('material-text'))

      s.push(this.getField('material-vocab'))

      s.push(this.getField('technique-text'))

      s.push(this.getField('technique-vocab'))

      return s
    },
    getDataGeneralGeneralSection: function () {
      let s = []

      let rt = this.getField('resource-type')
      rt.value = this.cmodel.value
      s.push(rt)

      let ot = this.getField('object-type-checkboxes')
      ot.resourceType = this.cmodel.value
      s.push(ot)

      s.push(this.getField('title'))

      s.push(this.getField('role-extended'))

      s.push(this.getField('description'))

      s.push(this.getField('language'))

      let dc = this.getField('date-edtf')
      dc.type = 'dcterms:created'
      s.push(dc)

      let sc = this.getField('spatial-getty')
      sc.type = 'dcterms:spatial'
      s.push(sc)

      s.push(this.getField('keyword'))

      s.push(this.getField('gnd-subject'))

      s.push(this.getField('temporal-coverage'))

      s.push(this.getField('dce-format-vocab'))

      s.push(this.getField('association'))

      return s
    },
    getDataResearchdataGeneralSection: function () {
      let s = []

      let rt = this.getField('resource-type')
      rt.value = this.cmodel.value
      s.push(rt)

      let ot = this.getField('object-type-checkboxes')
      ot.resourceType = this.cmodel.value
      s.push(ot)

      s.push(this.getField('title'))

      s.push(this.getField('role-extended'))

      s.push(this.getField('description'))

      s.push(this.getField('project'))

      s.push(this.getField('citation'))

      s.push(this.getField('language'))

      let dc = this.getField('date-edtf')
      dc.type = 'dcterms:created'
      s.push(dc)

      let sc = this.getField('spatial-getty')
      sc.type = 'dcterms:spatial'
      s.push(sc)

      s.push(this.getField('keyword'))

      s.push(this.getField('gnd-subject'))

      s.push(this.getField('temporal-coverage'))

      s.push(this.getField('dce-format-vocab'))

      s.push(this.getField('association'))

      return s
    },
    getResourceGeneralGeneralSection: function () {
      let s = []

      let rt = this.getField('resource-type')
      rt.value = this.cmodel.value
      s.push(rt)

      let ot = this.getField('object-type-checkboxes')
      ot.resourceType = this.cmodel.value
      s.push(ot)

      s.push(this.getField('title'))

      s.push(this.getField('role-extended'))

      s.push(this.getField('description'))

      s.push(this.getField('note'))

      s.push(this.getField('language'))

      let dc = this.getField('date-edtf')
      dc.type = 'dcterms:created'
      s.push(dc)

      let da = this.getField('date-edtf')
      da.type = 'dcterms:available'
      s.push(da)

      s.push(this.getField('keyword'))

      s.push(this.getField('gnd-subject'))

      s.push(this.getField('temporal-coverage'))

      let sc = this.getField('spatial-getty')
      sc.type = 'dcterms:spatial'
      s.push(sc)

      s.push(this.getField('association'))

      return s
    },
    getCollectionDigitalGeneralSection: function () {
      let s = []

      let rt = this.getField('resource-type')
      rt.value = this.cmodel.value
      s.push(rt)

      s.push(this.getField('title'))

      s.push(this.getField('role-extended'))

      s.push(this.getField('description'))

      s.push(this.getField('table-of-contents'))

      s.push(this.getField('note'))

      s.push(this.getField('project'))

      s.push(this.getField('keyword'))

      s.push(this.getField('gnd-subject'))

      s.push(this.getField('temporal-coverage'))

      let sc = this.getField('spatial-getty')
      sc.type = 'dcterms:spatial'
      s.push(sc)

      s.push(this.getField('association'))

      return s
    },
    getCollectionDigitizedGeneralSection: function () {
      let s = []

      let rt = this.getField('resource-type')
      rt.value = this.cmodel.value
      s.push(rt)

      s.push(this.getField('title'))

      s.push(this.getField('role-extended'))

      s.push(this.getField('description'))

      s.push(this.getField('table-of-contents'))

      s.push(this.getField('note'))

      s.push(this.getField('digitization-note'))

      s.push(this.getField('project'))

      s.push(this.getField('keyword'))

      s.push(this.getField('gnd-subject'))

      s.push(this.getField('temporal-coverage'))

      let sc = this.getField('spatial-getty')
      sc.type = 'dcterms:spatial'
      s.push(sc)

      s.push(this.getField('association'))

      return s
    },
    getCollectionDigitizedSubjectSection: function () {
      let s = []

      let ot = this.getField('object-type-checkboxes')
      ot.resourceType = this.cmodel.value
      s.push(ot)

      s.push(this.getField('title'))

      s.push(this.getField('role-extended'))

      s.push(this.getField('provenance'))

      let dc = this.getField('date-edtf')
      dc.type = 'dcterms:created'
      s.push(dc)

      let pc = this.getField('spatial-getty')
      pc.type = 'vra:placeOfCreation'
      s.push(pc)

      s.push(this.getField('physical-location'))

      s.push(this.getField('shelf-mark'))

      return s
    },
    initPictureDigital: function (form) {
      form.sections = [
        {
          title: 'File',
          type: 'file',
          disablemenu: true,
          id: 2,
          fields: this.getPictureDigitalFileSection()
        },
        {
          title: 'General',
          type: 'digitalobject',
          disablemenu: true,
          id: 1,
          fields: this.getPictureDigitalGeneralSection()
        }
      ]
    },
    initPicturePhysicalObject: function (form) {
      form.sections = [
        {
          title: 'File',
          type: 'file',
          disablemenu: true,
          id: 2,
          fields: this.getPicturePOFileSection()
        },
        {
          title: 'General',
          type: 'digitalobject',
          disablemenu: true,
          id: 1,
          fields: this.getPicturePOGeneralSection()
        },
        {
          title: 'Represented object',
          type: 'phaidra:Subject',
          disablemenu: true,
          id: 3,
          fields: this.getPicturePOSubjectSection()
        }
      ]
    },
    initPictureDigitized: function (form) {
      form.sections = [
        {
          title: 'File',
          type: 'file',
          disablemenu: true,
          id: 3,
          fields: this.getPictureDigitizedFileSection()
        },
        {
          title: 'General',
          type: 'digitalobject',
          disablemenu: true,
          id: 1,
          fields: this.getPictureDigitizedGeneralSection()
        },
        {
          title: 'Digitized object',
          type: 'phaidra:Subject',
          disablemenu: true,
          id: 2,
          fields: this.getPictureDigitizedSubjectSection()
        }
      ]
    },
    initPictureMap: function (form) {
      form.sections = [
        {
          title: 'File',
          type: 'file',
          disablemenu: true,
          id: 3,
          fields: this.getPictureMapFileSection()
        },
        {
          title: 'General',
          type: 'digitalobject',
          disablemenu: true,
          id: 1,
          fields: this.getPictureMapGeneralSection()
        },
        {
          title: 'Represented object',
          type: 'phaidra:Subject',
          disablemenu: true,
          id: 2,
          fields: this.getPictureMapSubjectSection()
        }
      ]
    },
    initDocumentDigital: function (form) {
      form.sections = [
        {
          title: 'File',
          type: 'file',
          disablemenu: true,
          id: 2,
          fields: this.getDocumentDigitalFileSection()
        },
        {
          title: 'General',
          type: 'digitalobject',
          disablemenu: true,
          id: 1,
          fields: this.getDocumentDigitalGeneralSection()
        }
      ]
    },
    initDocumentPoster: function (form) {
      form.sections = [
        {
          title: 'File',
          type: 'file',
          disablemenu: true,
          id: 2,
          fields: this.getDocumentPosterFileSection()
        },
        {
          title: 'General',
          type: 'digitalobject',
          disablemenu: true,
          id: 1,
          fields: this.getDocumentPosterGeneralSection()
        }
      ]
    },
    initDocumentDigitized: function (form) {
      form.sections = [
        {
          title: 'File',
          type: 'file',
          disablemenu: true,
          id: 2,
          fields: this.getDocumentDigitizedFileSection()
        },
        {
          title: 'General',
          type: 'digitalobject',
          disablemenu: true,
          id: 1,
          fields: this.getDocumentDigitizedGeneralSection()
        },
        {
          title: 'Digitized object',
          type: 'phaidra:Subject',
          disablemenu: true,
          id: 3,
          fields: this.getDocumentDigitizedSubjectSection()
        }
      ]
    },
    initAudioDigital: function (form) {
      form.sections = [
        {
          title: 'File',
          type: 'file',
          disablemenu: true,
          id: 2,
          fields: this.getAudioDigitalFileSection()
        },
        {
          title: 'General',
          type: 'digitalobject',
          disablemenu: true,
          id: 1,
          fields: this.getAudioDigitalGeneralSection()
        }
      ]
    },
    initAudioDigitized: function (form) {
      form.sections = [
        {
          title: 'File',
          type: 'file',
          disablemenu: true,
          id: 2,
          fields: this.getAudioDigitizedFileSection()
        },
        {
          title: 'General',
          type: 'digitalobject',
          disablemenu: true,
          id: 1,
          fields: this.getAudioDigitizedGeneralSection()
        },
        {
          title: 'Digitized object',
          type: 'phaidra:Subject',
          disablemenu: true,
          id: 3,
          fields: this.getAudioDigitizedSubjectSection()
        }
      ]
    },
    initVideoDigital: function (form) {
      form.sections = [
        {
          title: 'File',
          type: 'file',
          disablemenu: true,
          id: 2,
          fields: this.getVideoDigitalFileSection()
        },
        {
          title: 'General',
          type: 'digitalobject',
          disablemenu: true,
          id: 1,
          fields: this.getVideoDigitalGeneralSection()
        }
      ]
    },
    initVideoDigitized: function (form) {
      form.sections = [
        {
          title: 'File',
          type: 'file',
          disablemenu: true,
          id: 2,
          fields: this.getVideoDigitizedFileSection()
        },
        {
          title: 'General',
          type: 'digitalobject',
          disablemenu: true,
          id: 1,
          fields: this.getVideoDigitizedGeneralSection()
        },
        {
          title: 'Digitized object',
          type: 'phaidra:Subject',
          disablemenu: true,
          id: 3,
          fields: this.getVideoDigitizedSubjectSection()
        }
      ]
    },
    initDataGeneral: function (form) {
      form.sections = [
        {
          title: 'File',
          type: 'file',
          disablemenu: true,
          id: 2,
          fields: this.getDataGeneralFileSection()
        },
        {
          title: 'General',
          type: 'digitalobject',
          disablemenu: true,
          id: 1,
          fields: this.getDataGeneralGeneralSection()
        }
      ]
    },
    initDataResearchdata: function (form) {
      form.sections = [
        {
          title: 'File',
          type: 'file',
          disablemenu: true,
          id: 2,
          fields: this.getDataResearchdataFileSection()
        },
        {
          title: 'General',
          type: 'digitalobject',
          disablemenu: true,
          id: 1,
          fields: this.getDataResearchdataGeneralSection()
        }
      ]
    },
    initResourceGeneral: function (form) {
      form.sections = [
        {
          title: 'General',
          type: 'digitalobject',
          disablemenu: true,
          id: 2,
          fields: this.getResourceGeneralGeneralSection()
        },
        {
          title: 'Resource link',
          type: 'resourcelink',
          disablemenu: true,
          id: 1,
          fields: []
        }
      ]
    },
    initCollectionDigital: function (form) {
      form.sections = [
        {
          title: 'General',
          type: 'digitalobject',
          disablemenu: true,
          id: 1,
          fields: this.getCollectionDigitalGeneralSection()
        }
      ]
    },
    initCollectionDigitized: function (form) {
      form.sections = [
        {
          title: 'General',
          type: 'digitalobject',
          disablemenu: true,
          id: 1,
          fields: this.getCollectionDigitizedGeneralSection()
        },
        {
          title: 'Digitized object',
          type: 'phaidra:Subject',
          disablemenu: true,
          id: 2,
          fields: this.getCollectionDigitizedSubjectSection()
        }
      ]
    },
    initForm: function () {
      this.form = { sections: [] }
      switch (this.cmodelparam) {
        case 'picture':
          switch (this.submitformparam) {
            case 'digital':
              this.initPictureDigital(this.form)
              break
            case 'physicalobject':
              this.initPicturePhysicalObject(this.form)
              break
            case 'digitized':
              this.initPictureDigitized(this.form)
              break
            case 'map':
              this.initPictureMap(this.form)
              break
            default:
              console.error('bad submitform param: [' + this.submitformparam + ']')
              break
          }
          break
        case 'document':
          switch (this.submitformparam) {
            case 'digital':
              this.initDocumentDigital(this.form)
              break
            case 'poster':
              this.initDocumentPoster(this.form)
              break
            case 'digitized':
              this.initDocumentDigitized(this.form)
              break
            default:
              console.error('bad submitform param: [' + this.submitformparam + ']')
              break
          }
          break
        case 'audio':
          switch (this.submitformparam) {
            case 'digital':
              this.initAudioDigital(this.form)
              break
            case 'digitized':
              this.initAudioDigitized(this.form)
              break
            default:
              console.error('bad submitform param: [' + this.submitformparam + ']')
              break
          }
          break
        case 'video':
          switch (this.submitformparam) {
            case 'digital':
              this.initVideoDigital(this.form)
              break
            case 'digitized':
              this.initVideoDigitized(this.form)
              break
            default:
              console.error('bad submitform param: [' + this.submitformparam + ']')
              break
          }
          break
        case 'data':
          switch (this.submitformparam) {
            case 'general':
              this.initDataGeneral(this.form)
              break
            case 'researchdata':
              this.initDataResearchdata(this.form)
              break
            default:
              console.error('bad submitform param: [' + this.submitformparam + ']')
              break
          }
          break
        case 'resource':
          switch (this.submitformparam) {
            case 'general':
              this.initResourceGeneral(this.form)
              break
            default:
              console.error('bad submitform param: [' + this.submitformparam + ']')
              break
          }
          break
        case 'collection':
          switch (this.submitformparam) {
            case 'digital':
              this.initCollectionDigital(this.form)
              break
            case 'digitized':
              this.initCollectionDigitized(this.form)
              break
            default:
              console.error('bad submitform param: [' + this.submitformparam + ']')
              break
          }
          break
        default:
          console.error('bad cmodel param: [' + this.cmodelparam + ']')
          break
      }
      this.markMandatory()
    }
  },
  beforeRouteEnter: function (to, from, next) {
    next(vm => {
      vm.initForm()
      next()
    })
  },
  beforeRouteUpdate: function (to, from, next) {
    this.initForm()
    next()
  }
}
</script>

<style scoped>

</style>
