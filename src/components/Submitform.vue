<template>
  <v-container>
    <v-row>
      <v-col>
        <p-i-form
          :form="form"
          :rights="rights"
          :enablerights="true"
          v-on:load-form="form = $event"
          v-on:object-created="objectCreated($event)"
          v-on:add-phaidrasubject-section="addPhaidrasubjectSection($event)"
          v-on:input-rights="rights = $event"
        ></p-i-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import fields from 'phaidra-vue-components/src/utils/fields'
import { context } from '../mixins/context'
import { cmodels } from '../utils/cmodels'

export default {
  name: 'submitform',
  mixins: [ context ],
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
      this.$store.commit('setAlerts', [{ type: 'success', msg: 'Object ' + event + ' created' }])
      this.$router.push({ name: 'detail', params: { pid: event } })
      this.$vuetify.goTo(0)
    },
    getPictureDigitalGeneralSection: function () {
      let s = []

      let rt = fields.getField('resource-type')
      rt.value = this.cmodel.value
      s.push(rt)

      let ot = fields.getField('object-type')
      // TODO: filter
      s.push(ot)

      s.push(fields.getField('title'))

      s.push(fields.getField('role-extended'))

      s.push(fields.getField('description'))

      s.push(fields.getField('note'))

      s.push(fields.getField('language'))

      let dc = fields.getField('date-edtf')
      dc.type = 'dcterms:created'
      s.push(dc)

      let pc = fields.getField('spatial-getty')
      pc.type = 'vra:placeOfCreation'
      s.push(pc)

      s.push(fields.getField('keyword'))

      s.push(fields.getField('gnd-subject'))

      let dtc = fields.getField('date-edtf')
      dtc.type = 'dcterms:temporal'
      s.push(dtc)

      s.push(fields.getField('temporal-coverage'))

      let psc = fields.getField('spatial-getty')
      psc.type = 'dcterms:spatial'
      s.push(psc)

      s.push(fields.getField('association'))

      return s
    },
    getPicturePOGeneralSection: function () {
      let s = []

      let rt = fields.getField('resource-type')
      rt.value = this.cmodel.value
      s.push(rt)

      s.push(fields.getField('title'))

      s.push(fields.getField('role-extended'))

      s.push(fields.getField('description'))

      s.push(fields.getField('note'))

      s.push(fields.getField('digitization-note'))

      s.push(fields.getField('language'))

      let dc = fields.getField('date-edtf')
      dc.type = 'dcterms:created'
      s.push(dc)

      s.push(fields.getField('keyword'))

      s.push(fields.getField('gnd-subject'))

      let tc = fields.getField('date-edtf')
      tc.type = 'dcterms:temporal'
      s.push(tc)

      s.push(fields.getField('temporal-coverage'))

      let sc = fields.getField('spatial-getty')
      sc.type = 'dcterms:spatial'
      s.push(sc)

      s.push(fields.getField('association'))

      return s
    },
    getPictureDigitalFileSection: function () {
      let s = []
      s.push(fields.getField('file'))

      s.push(fields.getField('license'))

      s.push(fields.getField('rights'))

      return s
    },
    getPicturePOFileSection: function () {
      let s = []
      s.push(fields.getField('file'))

      s.push(fields.getField('license'))

      s.push(fields.getField('rights'))

      return s
    },
    getPictureDigitizedFileSection: function () {
      let s = []
      s.push(fields.getField('file'))

      s.push(fields.getField('license'))

      s.push(fields.getField('rights'))

      return s
    },
    getPictureDigitizedSubjectSection: function () {
      let s = []

      let ot = fields.getField('object-type')
      // TODO: filter
      s.push(ot)

      s.push(fields.getField('role-extended'))

      s.push(fields.getField('condition-note'))

      s.push(fields.getField('reproduction-note'))

      s.push(fields.getField('provenance'))

      let d = fields.getField('date-edtf')
      d.type = 'dcterms:date'
      s.push(d)

      let dc = fields.getField('date-edtf')
      dc.type = 'dcterms:created'
      s.push(dc)

      let pc = fields.getField('spatial-getty')
      pc.type = 'vra:placeOfCreation'
      s.push(pc)

      s.push(fields.getField('physical-location'))

      s.push(fields.getField('accession-number'))

      s.push(fields.getField('shelf-mark'))

      s.push(fields.getField('inscription'))

      s.push(fields.getField('material-text'))

      s.push(fields.getField('material-vocab'))

      s.push(fields.getField('technique-text'))

      s.push(fields.getField('technique-vocab'))

      s.push(fields.getField('width'))

      s.push(fields.getField('height'))

      return s
    },
    getPictureMapFileSection: function () {
      let s = []
      s.push(fields.getField('file'))

      s.push(fields.getField('license'))

      s.push(fields.getField('rights'))

      return s
    },
    getDocumentDigitalFileSection: function () {
      let s = []
      s.push(fields.getField('file'))

      s.push(fields.getField('license'))

      s.push(fields.getField('rights'))

      return s
    },
    getDocumentPosterFileSection: function () {
      let s = []
      s.push(fields.getField('file'))

      s.push(fields.getField('license'))

      s.push(fields.getField('rights'))

      return s
    },
    getDocumentDigitizedFileSection: function () {
      let s = []
      s.push(fields.getField('file'))

      s.push(fields.getField('license'))

      s.push(fields.getField('rights'))

      return s
    },
    getAudioDigitalFileSection: function () {
      let s = []
      s.push(fields.getField('file'))

      s.push(fields.getField('dce-format-vocab'))

      s.push(fields.getField('duration'))

      s.push(fields.getField('license'))

      s.push(fields.getField('rights'))

      return s
    },
    getAudioDigitizedFileSection: function () {
      let s = []
      s.push(fields.getField('file'))

      s.push(fields.getField('dce-format-vocab'))

      s.push(fields.getField('duration'))

      s.push(fields.getField('license'))

      s.push(fields.getField('rights'))

      return s
    },
    getVideoDigitalFileSection: function () {
      let s = []
      s.push(fields.getField('file'))

      s.push(fields.getField('dce-format-vocab'))

      s.push(fields.getField('duration'))

      s.push(fields.getField('license'))

      s.push(fields.getField('rights'))

      return s
    },
    getVideoDigitizedFileSection: function () {
      let s = []
      s.push(fields.getField('file'))

      s.push(fields.getField('dce-format-vocab'))

      s.push(fields.getField('duration'))

      s.push(fields.getField('license'))

      s.push(fields.getField('rights'))

      return s
    },
    getDataGeneralFileSection: function () {
      let s = []
      s.push(fields.getField('file'))

      s.push(fields.getField('dce-format-vocab'))

      s.push(fields.getField('license'))

      s.push(fields.getField('rights'))

      return s
    },
    getDataResearchdataFileSection: function () {
      let s = []
      s.push(fields.getField('file'))

      s.push(fields.getField('dce-format-vocab'))

      s.push(fields.getField('license'))

      s.push(fields.getField('rights'))

      return s
    },
    getPicturePOSubjectSection: function () {
      let s = []

      let ot = fields.getField('object-type')
      // TODO: filter
      s.push(ot)

      s.push(fields.getField('role-extended'))

      s.push(fields.getField('condition-note'))

      s.push(fields.getField('reproduction-note'))

      s.push(fields.getField('provenance'))

      let d = fields.getField('date-edtf')
      d.type = 'dcterms:date'
      s.push(d)

      let dc = fields.getField('date-edtf')
      dc.type = 'dcterms:created'
      s.push(dc)

      let pc = fields.getField('spatial-getty')
      pc.type = 'vra:placeOfCreation'
      s.push(pc)

      s.push(fields.getField('physical-location'))

      s.push(fields.getField('accession-number'))

      s.push(fields.getField('shelf-mark'))

      s.push(fields.getField('inscription'))

      s.push(fields.getField('material-text'))

      s.push(fields.getField('material-vocab'))

      s.push(fields.getField('technique-text'))

      s.push(fields.getField('technique-vocab'))

      s.push(fields.getField('width'))

      s.push(fields.getField('height'))

      s.push(fields.getField('depth'))

      return s
    },
    getPictureDigitizedGeneralSection: function () {
      let s = []

      let rt = fields.getField('resource-type')
      rt.value = this.cmodel.value
      s.push(rt)

      s.push(fields.getField('title'))

      s.push(fields.getField('role-extended'))

      s.push(fields.getField('description'))

      s.push(fields.getField('note'))

      s.push(fields.getField('digitization-note'))

      s.push(fields.getField('language'))

      let dc = fields.getField('date-edtf')
      dc.type = 'dcterms:created'
      s.push(dc)

      s.push(fields.getField('keyword'))

      s.push(fields.getField('gnd-subject'))

      let tc = fields.getField('date-edtf')
      tc.type = 'dcterms:temporal'
      s.push(tc)

      s.push(fields.getField('temporal-coverage'))

      let sc = fields.getField('spatial-getty')
      sc.type = 'dcterms:spatial'
      s.push(sc)

      s.push(fields.getField('association'))

      return s
    },
    getPictureMapGeneralSection: function () {
      let s = []

      let rt = fields.getField('resource-type')
      rt.value = this.cmodel.value
      s.push(rt)

      s.push(fields.getField('title'))

      s.push(fields.getField('role-extended'))

      s.push(fields.getField('description'))

      s.push(fields.getField('note'))

      s.push(fields.getField('digitization-note'))

      s.push(fields.getField('language'))

      let dc = fields.getField('date-edtf')
      dc.type = 'dcterms:created'
      s.push(dc)

      s.push(fields.getField('keyword'))

      s.push(fields.getField('gnd-subject'))

      let tc = fields.getField('date-edtf')
      tc.type = 'dcterms:temporal'
      s.push(tc)

      s.push(fields.getField('temporal-coverage'))

      let sc = fields.getField('spatial-getty')
      sc.type = 'dcterms:spatial'
      s.push(sc)

      s.push(fields.getField('association'))

      return s
    },
    getPictureMapSubjectSection: function () {
      let s = []

      let ot = fields.getField('object-type')
      // TODO: filter
      s.push(ot)

      s.push(fields.getField('role-extended'))

      s.push(fields.getField('condition-note'))

      s.push(fields.getField('reproduction-note'))

      s.push(fields.getField('provenance'))

      let d = fields.getField('date-edtf')
      d.type = 'dcterms:date'
      s.push(d)

      let dc = fields.getField('date-edtf')
      dc.type = 'dcterms:created'
      s.push(dc)

      let pc = fields.getField('spatial-getty')
      pc.type = 'vra:placeOfCreation'
      s.push(pc)

      s.push(fields.getField('physical-location'))

      let sc = fields.getField('spatial-getty')
      sc.type = 'dcterms:spatial'
      s.push(sc)

      s.push(fields.getField('scale'))

      let ci = fields.getField('series')
      ci.predicate = 'rdau:P60101'
      ci.label = this.$t('Contained in')
      s.push(ci)

      s.push(fields.getField('accession-number'))

      s.push(fields.getField('shelf-mark'))

      s.push(fields.getField('inscription'))

      s.push(fields.getField('material-text'))

      s.push(fields.getField('material-vocab'))

      s.push(fields.getField('technique-text'))

      s.push(fields.getField('technique-vocab'))

      s.push(fields.getField('width'))

      s.push(fields.getField('height'))

      return s
    },
    getDocumentDigitalGeneralSection: function () {
      let s = []

      let rt = fields.getField('resource-type')
      rt.value = this.cmodel.value
      s.push(rt)

      let ot = fields.getField('object-type')
      // TODO: filter
      s.push(ot)

      s.push(fields.getField('title'))

      s.push(fields.getField('role-extended'))

      s.push(fields.getField('description'))

      s.push(fields.getField('number-of-pages'))

      s.push(fields.getField('note'))

      s.push(fields.getField('language'))

      let dc = fields.getField('date-edtf')
      dc.type = 'dcterms:created'
      s.push(dc)

      let pc = fields.getField('spatial-getty')
      pc.type = 'vra:placeOfCreation'
      s.push(pc)

      s.push(fields.getField('keyword'))

      s.push(fields.getField('gnd-subject'))

      let tc = fields.getField('date-edtf')
      tc.type = 'dcterms:temporal'
      s.push(tc)

      s.push(fields.getField('temporal-coverage'))

      let sc = fields.getField('spatial-getty')
      sc.type = 'dcterms:spatial'
      s.push(sc)

      s.push(fields.getField('association'))

      return s
    },
    getDocumentPosterGeneralSection: function () {
      let s = []

      let rt = fields.getField('resource-type')
      rt.value = this.cmodel.value
      s.push(rt)

      let ot = fields.getField('object-type')
      // TODO: filter
      s.push(ot)

      s.push(fields.getField('title'))

      s.push(fields.getField('role-extended'))

      s.push(fields.getField('description'))

      s.push(fields.getField('note'))

      s.push(fields.getField('number-of-pages'))

      s.push(fields.getField('language'))

      let dc = fields.getField('date-edtf')
      dc.type = 'dcterms:created'
      s.push(dc)

      let pc = fields.getField('spatial-getty')
      pc.type = 'vra:placeOfCreation'
      s.push(pc)

      s.push(fields.getField('keyword'))

      s.push(fields.getField('gnd-subject'))

      let tc = fields.getField('date-edtf')
      tc.type = 'dcterms:temporal'
      s.push(tc)

      s.push(fields.getField('temporal-coverage'))

      s.push(fields.getField('project'))

      let fnd = fields.getField('funder')
      fnd.multilingial = false
      fnd.multiplicable = true
      s.push(fnd)

      s.push(fields.getField('association'))

      return s
    },
    getDocumentDigitizedGeneralSection: function () {
      let s = []

      let rt = fields.getField('resource-type')
      rt.value = this.cmodel.value
      s.push(rt)

      s.push(fields.getField('title'))

      s.push(fields.getField('role-extended'))

      s.push(fields.getField('description'))

      s.push(fields.getField('note'))

      s.push(fields.getField('number-of-pages'))

      s.push(fields.getField('digitization-note'))

      s.push(fields.getField('language'))

      let dc = fields.getField('date-edtf')
      dc.type = 'dcterms:created'
      s.push(dc)

      s.push(fields.getField('keyword'))

      s.push(fields.getField('gnd-subject'))

      let tc = fields.getField('date-edtf')
      tc.type = 'dcterms:temporal'
      s.push(tc)

      s.push(fields.getField('temporal-coverage'))

      s.push(fields.getField('association'))

      return s
    },
    getDocumentDigitizedSubjectSection: function () {
      let s = []

      let ot = fields.getField('object-type')
      // TODO: filter
      s.push(ot)

      s.push(fields.getField('description'))

      s.push(fields.getField('role-extended'))

      s.push(fields.getField('condition-note'))

      s.push(fields.getField('reproduction-note'))

      s.push(fields.getField('provenance'))

      let d = fields.getField('date-edtf')
      d.type = 'dcterms:date'
      s.push(d)

      let dc = fields.getField('date-edtf')
      dc.type = 'dcterms:created'
      s.push(dc)

      let di = fields.getField('date-edtf')
      di.type = 'dcterms:issued'
      s.push(di)

      let pc = fields.getField('spatial-getty')
      pc.type = 'vra:placeOfCreation'
      s.push(pc)

      s.push(fields.getField('physical-location'))

      s.push(fields.getField('shelf-mark'))

      s.push(fields.getField('number-of-pages'))

      s.push(fields.getField('material-text'))

      s.push(fields.getField('material-vocab'))

      s.push(fields.getField('width'))

      s.push(fields.getField('height'))

      return s
    },
    getAudioDigitalGeneralSection: function () {
      let s = []

      let rt = fields.getField('resource-type')
      rt.value = this.cmodel.value
      s.push(rt)

      let ot = fields.getField('object-type')
      // TODO: filter
      s.push(ot)

      s.push(fields.getField('genre'))

      s.push(fields.getField('title'))

      s.push(fields.getField('role-extended'))

      s.push(fields.getField('description'))

      s.push(fields.getField('table-of-contents'))

      s.push(fields.getField('note'))

      s.push(fields.getField('language'))

      let dc = fields.getField('date-edtf')
      dc.type = 'dcterms:created'
      s.push(dc)

      let di = fields.getField('date-edtf')
      di.type = 'dcterms:issued'
      s.push(di)

      let dcc = fields.getField('date-edtf')
      dcc.type = 'dcterms:dateCopyrighted'
      s.push(dcc)

      let pc = fields.getField('spatial-getty')
      pc.type = 'vra:placeOfCreation'
      s.push(pc)

      s.push(fields.getField('technique-text'))

      s.push(fields.getField('technique-vocab'))

      s.push(fields.getField('keyword'))

      s.push(fields.getField('gnd-subject'))

      let tc = fields.getField('date-edtf')
      tc.type = 'dcterms:temporal'
      s.push(tc)

      s.push(fields.getField('temporal-coverage'))

      s.push(fields.getField('association'))

      return s
    },
    getAudioDigitizedGeneralSection: function () {
      let s = []

      let rt = fields.getField('resource-type')
      rt.value = this.cmodel.value
      s.push(rt)

      s.push(fields.getField('genre'))

      s.push(fields.getField('title'))

      s.push(fields.getField('role-extended'))

      s.push(fields.getField('description'))

      s.push(fields.getField('table-of-contents'))

      s.push(fields.getField('note'))

      s.push(fields.getField('digitization-note'))

      s.push(fields.getField('language'))

      let d = fields.getField('date-edtf')
      d.type = 'dcterms:date'
      s.push(d)

      let dc = fields.getField('date-edtf')
      dc.type = 'dcterms:created'
      s.push(dc)

      let di = fields.getField('date-edtf')
      di.type = 'dcterms:issued'
      s.push(di)

      let dcc = fields.getField('date-edtf')
      dcc.type = 'dcterms:dateCopyrighted'
      s.push(dcc)

      let pc = fields.getField('spatial-getty')
      pc.type = 'vra:placeOfCreation'
      s.push(pc)

      s.push(fields.getField('keyword'))

      s.push(fields.getField('gnd-subject'))

      let tc = fields.getField('date-edtf')
      tc.type = 'dcterms:temporal'
      s.push(tc)

      s.push(fields.getField('temporal-coverage'))

      s.push(fields.getField('association'))

      return s
    },
    getAudioDigitizedSubjectSection: function () {
      let s = []

      let ot = fields.getField('object-type')
      // TODO: filter
      s.push(ot)

      let ct = fields.getField('carrier-type')
      // TODO: filter
      s.push(ct)

      s.push(fields.getField('description'))

      s.push(fields.getField('role-extended'))

      s.push(fields.getField('condition-note'))

      s.push(fields.getField('reproduction-note'))

      s.push(fields.getField('provenance'))

      s.push(fields.getField('supplementary-content'))

      let d = fields.getField('date-edtf')
      d.type = 'dcterms:date'
      s.push(d)

      let dc = fields.getField('date-edtf')
      dc.type = 'dcterms:created'
      s.push(dc)

      let pc = fields.getField('spatial-getty')
      pc.type = 'vra:placeOfCreation'
      s.push(pc)

      s.push(fields.getField('physical-location'))

      s.push(fields.getField('accession-number'))

      s.push(fields.getField('shelf-mark'))

      s.push(fields.getField('inscription'))

      s.push(fields.getField('material-text'))

      s.push(fields.getField('material-vocab'))

      s.push(fields.getField('technique-text'))

      s.push(fields.getField('technique-vocab'))

      return s
    },
    getVideoDigitalGeneralSection: function () {
      let s = []

      let rt = fields.getField('resource-type')
      rt.value = this.cmodel.value
      s.push(rt)

      let ot = fields.getField('object-type')
      // TODO: filter
      s.push(ot)

      s.push(fields.getField('genre'))

      s.push(fields.getField('title'))

      s.push(fields.getField('role-extended'))

      s.push(fields.getField('description'))

      s.push(fields.getField('table-of-contents'))

      s.push(fields.getField('note'))

      s.push(fields.getField('language'))

      let dc = fields.getField('date-edtf')
      dc.type = 'dcterms:created'
      s.push(dc)

      let pc = fields.getField('spatial-getty')
      pc.type = 'vra:placeOfCreation'
      s.push(pc)

      s.push(fields.getField('technique-text'))

      s.push(fields.getField('technique-vocab'))

      s.push(fields.getField('audience'))

      s.push(fields.getField('subtitle-language'))

      s.push(fields.getField('keyword'))

      s.push(fields.getField('gnd-subject'))

      let tc = fields.getField('date-edtf')
      tc.type = 'dcterms:temporal'
      s.push(tc)

      s.push(fields.getField('temporal-coverage'))

      s.push(fields.getField('association'))

      return s
    },
    getVideoDigitizedGeneralSection: function () {
      let s = []

      let rt = fields.getField('resource-type')
      rt.value = this.cmodel.value
      s.push(rt)

      s.push(fields.getField('genre'))

      s.push(fields.getField('title'))

      s.push(fields.getField('role-extended'))

      s.push(fields.getField('description'))

      s.push(fields.getField('table-of-contents'))

      s.push(fields.getField('note'))

      s.push(fields.getField('language'))

      let dc = fields.getField('date-edtf')
      dc.type = 'dcterms:created'
      s.push(dc)

      let pc = fields.getField('spatial-getty')
      pc.type = 'vra:placeOfCreation'
      s.push(pc)

      s.push(fields.getField('technique-text'))

      s.push(fields.getField('technique-vocab'))

      s.push(fields.getField('audience'))

      s.push(fields.getField('subtitle-language'))

      s.push(fields.getField('keyword'))

      s.push(fields.getField('gnd-subject'))

      let tc = fields.getField('date-edtf')
      tc.type = 'dcterms:temporal'
      s.push(tc)

      s.push(fields.getField('temporal-coverage'))

      s.push(fields.getField('association'))

      return s
    },
    getVideoDigitizedSubjectSection: function () {
      let s = []

      let ot = fields.getField('object-type')
      // TODO: filter
      s.push(ot)

      let ct = fields.getField('carrier-type')
      // TODO: filter
      s.push(ct)

      s.push(fields.getField('role-extended'))

      s.push(fields.getField('condition-note'))

      s.push(fields.getField('reproduction-note'))

      s.push(fields.getField('provenance'))

      s.push(fields.getField('supplementary-content'))

      let d = fields.getField('date-edtf')
      d.type = 'dcterms:date'
      s.push(d)

      let dc = fields.getField('date-edtf')
      dc.type = 'dcterms:created'
      s.push(dc)

      let pc = fields.getField('spatial-getty')
      pc.type = 'vra:placeOfCreation'
      s.push(pc)

      s.push(fields.getField('physical-location'))

      s.push(fields.getField('accession-number'))

      s.push(fields.getField('shelf-mark'))

      s.push(fields.getField('inscription'))

      s.push(fields.getField('material-text'))

      s.push(fields.getField('material-vocab'))

      s.push(fields.getField('technique-text'))

      s.push(fields.getField('technique-vocab'))

      return s
    },
    getDataGeneralGeneralSection: function () {
      let s = []

      let rt = fields.getField('resource-type')
      rt.value = this.cmodel.value
      s.push(rt)

      let ot = fields.getField('object-type')
      // TODO: filter
      s.push(ot)

      s.push(fields.getField('title'))

      s.push(fields.getField('role-extended'))

      s.push(fields.getField('description'))

      s.push(fields.getField('note'))

      s.push(fields.getField('language'))

      let dc = fields.getField('date-edtf')
      dc.type = 'dcterms:created'
      s.push(dc)

      let da = fields.getField('date-edtf')
      da.type = 'dcterms:available'
      s.push(da)

      let di = fields.getField('date-edtf')
      di.type = 'dcterms:issued'
      s.push(di)

      s.push(fields.getField('keyword'))

      s.push(fields.getField('gnd-subject'))

      let tc = fields.getField('date-edtf')
      tc.type = 'dcterms:temporal'
      s.push(tc)

      s.push(fields.getField('temporal-coverage'))

      let sc = fields.getField('spatial-getty')
      sc.type = 'dcterms:spatial'
      s.push(sc)

      s.push(fields.getField('association'))

      return s
    },
    getDataResearchdataGeneralSection: function () {
      let s = []

      let rt = fields.getField('resource-type')
      rt.value = this.cmodel.value
      s.push(rt)

      let ot = fields.getField('object-type')
      // TODO: filter
      s.push(ot)

      s.push(fields.getField('title'))

      s.push(fields.getField('role-extended'))

      s.push(fields.getField('description'))

      s.push(fields.getField('note'))

      s.push(fields.getField('language'))

      let dc = fields.getField('date-edtf')
      dc.type = 'dcterms:created'
      s.push(dc)

      s.push(fields.getField('project'))

      let fnd = fields.getField('funder')
      fnd.multilingial = false
      fnd.multiplicable = true
      s.push(fnd)

      s.push(fields.getField('citation'))

      s.push(fields.getField('keyword'))

      s.push(fields.getField('gnd-subject'))

      let tc = fields.getField('date-edtf')
      tc.type = 'dcterms:temporal'
      s.push(tc)

      s.push(fields.getField('temporal-coverage'))

      let sc = fields.getField('spatial-getty')
      sc.type = 'dcterms:spatial'
      s.push(sc)

      s.push(fields.getField('association'))

      return s
    },
    getResourceGeneralGeneralSection: function () {
      let s = []

      let rt = fields.getField('resource-type')
      rt.value = this.cmodel.value
      s.push(rt)

      let ot = fields.getField('object-type')
      // TODO: filter
      s.push(ot)

      s.push(fields.getField('title'))

      s.push(fields.getField('role-extended'))

      s.push(fields.getField('description'))

      s.push(fields.getField('note'))

      s.push(fields.getField('language'))

      let dc = fields.getField('date-edtf')
      dc.type = 'dcterms:created'
      s.push(dc)

      let da = fields.getField('date-edtf')
      da.type = 'dcterms:available'
      s.push(da)

      s.push(fields.getField('keyword'))

      s.push(fields.getField('gnd-subject'))

      s.push(fields.getField('temporal-coverage'))

      let sc = fields.getField('spatial-getty')
      sc.type = 'dcterms:spatial'
      s.push(sc)

      s.push(fields.getField('association'))

      return s
    },
    getCollectionDigitalGeneralSection: function () {
      let s = []

      let rt = fields.getField('resource-type')
      rt.value = this.cmodel.value
      s.push(rt)

      s.push(fields.getField('title'))

      s.push(fields.getField('role-extended'))

      s.push(fields.getField('description'))

      s.push(fields.getField('table-of-contents'))

      s.push(fields.getField('note'))

      s.push(fields.getField('project'))

      s.push(fields.getField('keyword'))

      s.push(fields.getField('gnd-subject'))

      s.push(fields.getField('temporal-coverage'))

      let sc = fields.getField('spatial-getty')
      sc.type = 'dcterms:spatial'
      s.push(sc)

      s.push(fields.getField('association'))

      return s
    },
    getCollectionDigitizedGeneralSection: function () {
      let s = []

      let rt = fields.getField('resource-type')
      rt.value = this.cmodel.value
      s.push(rt)

      s.push(fields.getField('title'))

      s.push(fields.getField('role-extended'))

      s.push(fields.getField('description'))

      s.push(fields.getField('table-of-contents'))

      s.push(fields.getField('note'))

      s.push(fields.getField('digitization-note'))

      s.push(fields.getField('project'))

      s.push(fields.getField('keyword'))

      s.push(fields.getField('gnd-subject'))

      s.push(fields.getField('temporal-coverage'))

      let sc = fields.getField('spatial-getty')
      sc.type = 'dcterms:spatial'
      s.push(sc)

      s.push(fields.getField('association'))

      return s
    },
    getCollectionDigitizedSubjectSection: function () {
      let s = []

      let ot = fields.getField('object-type')
      // TODO: filter
      s.push(ot)

      s.push(fields.getField('title'))

      s.push(fields.getField('role-extended'))

      s.push(fields.getField('provenance'))

      let dc = fields.getField('date-edtf')
      dc.type = 'dcterms:created'
      s.push(dc)

      let pc = fields.getField('spatial-getty')
      pc.type = 'vra:placeOfCreation'
      s.push(pc)

      s.push(fields.getField('physical-location'))

      s.push(fields.getField('shelf-mark'))

      return s
    },
    initPictureDigital: function (form) {
      form.sections = [
        {
          title: 'General',
          type: 'digitalobject',
          disablemenu: true,
          id: 1,
          fields: this.getPictureDigitalGeneralSection()
        },
        {
          title: 'File',
          type: 'file',
          disablemenu: true,
          id: 2,
          fields: this.getPictureDigitalFileSection()
        }
      ]
    },
    initPicturePhysicalObject: function (form) {
      form.sections = [
        {
          title: 'General',
          type: 'digitalobject',
          disablemenu: true,
          id: 1,
          fields: this.getPicturePOGeneralSection()
        },
        {
          title: 'File',
          type: 'file',
          disablemenu: true,
          id: 2,
          fields: this.getPicturePOFileSection()
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
        },
        {
          title: 'File',
          type: 'file',
          disablemenu: true,
          id: 3,
          fields: this.getPictureDigitizedFileSection()
        }
      ]
    },
    initPictureMap: function (form) {
      form.sections = [
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
        },
        {
          title: 'File',
          type: 'file',
          disablemenu: true,
          id: 3,
          fields: this.getPictureMapFileSection()
        }
      ]
    },
    initDocumentDigital: function (form) {
      form.sections = [
        {
          title: 'General',
          type: 'digitalobject',
          disablemenu: true,
          id: 1,
          fields: this.getDocumentDigitalGeneralSection()
        },
        {
          title: 'File',
          type: 'file',
          disablemenu: true,
          id: 2,
          fields: this.getDocumentDigitalFileSection()
        }
      ]
    },
    initDocumentPoster: function (form) {
      form.sections = [
        {
          title: 'General',
          type: 'digitalobject',
          disablemenu: true,
          id: 1,
          fields: this.getDocumentPosterGeneralSection()
        },
        {
          title: 'File',
          type: 'file',
          disablemenu: true,
          id: 2,
          fields: this.getDocumentPosterFileSection()
        }
      ]
    },
    initDocumentDigitized: function (form) {
      form.sections = [
        {
          title: 'General',
          type: 'digitalobject',
          disablemenu: true,
          id: 1,
          fields: this.getDocumentDigitizedGeneralSection()
        },
        {
          title: 'File',
          type: 'file',
          disablemenu: true,
          id: 2,
          fields: this.getDocumentDigitizedFileSection()
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
          title: 'General',
          type: 'digitalobject',
          disablemenu: true,
          id: 1,
          fields: this.getAudioDigitalGeneralSection()
        },
        {
          title: 'File',
          type: 'file',
          disablemenu: true,
          id: 2,
          fields: this.getAudioDigitalFileSection()
        }
      ]
    },
    initAudioDigitized: function (form) {
      form.sections = [
        {
          title: 'General',
          type: 'digitalobject',
          disablemenu: true,
          id: 1,
          fields: this.getAudioDigitizedGeneralSection()
        },
        {
          title: 'File',
          type: 'file',
          disablemenu: true,
          id: 2,
          fields: this.getAudioDigitizedFileSection()
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
          title: 'General',
          type: 'digitalobject',
          disablemenu: true,
          id: 1,
          fields: this.getVideoDigitalGeneralSection()
        },
        {
          title: 'File',
          type: 'file',
          disablemenu: true,
          id: 2,
          fields: this.getVideoDigitalFileSection()
        }
      ]
    },
    initVideoDigitized: function (form) {
      form.sections = [
        {
          title: 'General',
          type: 'digitalobject',
          disablemenu: true,
          id: 1,
          fields: this.getVideoDigitizedGeneralSection()
        },
        {
          title: 'File',
          type: 'file',
          disablemenu: true,
          id: 2,
          fields: this.getVideoDigitizedFileSection()
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
          title: 'General',
          type: 'digitalobject',
          disablemenu: true,
          id: 1,
          fields: this.getDataGeneralGeneralSection()
        },
        {
          title: 'File',
          type: 'file',
          disablemenu: true,
          id: 2,
          fields: this.getDataGeneralFileSection()
        }
      ]
    },
    initDataResearchdata: function (form) {
      form.sections = [
        {
          title: 'General',
          type: 'digitalobject',
          disablemenu: true,
          id: 1,
          fields: this.getDataResearchdataGeneralSection()
        },
        {
          title: 'File',
          type: 'file',
          disablemenu: true,
          id: 2,
          fields: this.getDataResearchdataFileSection()
        }
      ]
    },
    initResourceGeneral: function (form) {
      form.sections = [
        {
          title: 'Resource link',
          type: 'resourcelink',
          disablemenu: true,
          id: 1,
          fields: []
        },
        {
          title: 'General',
          type: 'digitalobject',
          disablemenu: true,
          id: 2,
          fields: this.getResourceGeneralGeneralSection()
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
