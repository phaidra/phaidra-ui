<template>
  <v-container fluid>

    <v-row v-if="objectInfo">

        <v-col cols="12" md="8">

          <v-row justify="center" class="mb-12">
            <a :href="objectInfo.dshash['WEBVERSION'] ? instanceconfig.api + '/object/' + objectInfo.pid + '/diss/Content/getwebversion' : instanceconfig.api + '/object/' + objectInfo.pid + '/diss/Content/get'">
              <img v-if="(objectInfo.cmodel === 'PDFDocument') && (instanceconfig.baseurl === 'e-book.fwf.ac.at')" :src="'https://fedora.e-book.fwf.ac.at/fedora/get/' + objectInfo.pid + '/bdef:Document/preview?box=480'"  class="elevation-1">
              <img v-else-if="objectInfo.cmodel === 'PDFDocument'" class="elevation-1" :src="'https://' + instanceconfig.baseurl + '/preview/' + objectInfo.pid + '/Document/preview/480'" />
              <img v-else-if="objectInfo.cmodel === 'Picture' || objectInfo.cmodel === 'Page'" class="elevation-1" :src="'https://' + instanceconfig.baseurl + '/preview/' + objectInfo.pid + '/ImageManipulator/boxImage/480/png'" />
              <img v-else-if="objectInfo.cmodel === 'Book'" class="elevation-1" :src="'https://' + instanceconfig.baseurl + '/preview/' + coverPid + '/ImageManipulator/boxImage/480/png'" />
            </a>
            <template v-if="(objectInfo.cmodel === 'Audio')">
              <audio controls>
                <source :src="objectInfo.dshash['WEBVERSION'] ? instanceconfig.api + '/object/' + objectInfo.pid + '/diss/Content/getwebversion' : instanceconfig.api + '/object/' + objectInfo.pid + '/diss/Content/get'">
                Your browser does not support the audio element.
              </audio>
            </template>
          </v-row>

          <v-row v-if="objectInfo.dshash['JSON-LD']">
            <p-d-jsonld :jsonld="objectInfo.metadata['JSON-LD']" :pid="objectInfo.pid"></p-d-jsonld>
          </v-row>

          <v-col cols="12" class="mb-12" v-if="objectInfo.dshash['UWMETADATA']">
            <p-d-uwm-rec :children="objectInfo.metadata['uwmetadata']"></p-d-uwm-rec>
          </v-col>

          <h3 v-if="objectInfo.cmodel === 'Container'" class="title font-weight-light grey--text text--darken-2">{{$t('Members')}} ({{objectMembers.length}})</h3>

          <v-row no-gutters class="mt-6" v-if="objectInfo.cmodel === 'Collection'">
            <router-link class="title font-weight-light primary--text showmembers" :to="{ path: '/search', query: { collection: objectInfo.pid } }">{{ $t('Show members') }} ({{ objectInfo.haspartsize }})</router-link>
          </v-row>

          <v-row v-if="objectMembers">
            <v-card class="mb-3 pt-4" width="100%" v-for="(member) in objectMembers" :key="'member_'+member.pid">
              <a :href="member.dshash['WEBVERSION'] ? instanceconfig.api + '/object/' + member.pid + '/diss/Content/getwebversion' : instanceconfig.api + '/object/' + member.pid + '/diss/Content/get'">
                <v-img class="mb-3" max-height="300" contain v-if="member.cmodel === 'PDFDocument'" :src="'https://' + instanceconfig.baseurl + '/preview/' + member.pid + '/Document/preview/480'" />
                <v-img class="mb-3" max-height="300" contain v-else-if="member.cmodel === 'Picture' || member.cmodel === 'Page'" :src="'https://' + instanceconfig.baseurl + '/preview/' + member.pid + '/ImageManipulator/boxImage/480/png'" />
              </a>
              <center v-if="(member.cmodel === 'Audio')">
                <audio controls>
                  <source :src="member.dshash['WEBVERSION'] ? instanceconfig.api + '/object/' + member.pid + '/diss/Content/getwebversion' : instanceconfig.api + '/object/' + member.pid + '/diss/Content/get'">
                  Your browser does not support the audio element.
                </audio>
              </center>
              <v-card-text class="ma-2">
                <p-d-jsonld :jsonld="member.metadata['JSON-LD']" :pid="member.pid"></p-d-jsonld>
              </v-card-text>
              <v-divider light v-if="objectInfo.readrights"></v-divider>
              <v-card-actions class="pa-3" v-if="objectInfo.readrights">
                <v-spacer></v-spacer>
                <v-btn v-if="member.cmodel === 'Picture'" target="_blank" :href="'https://' + instanceconfig.baseurl + '/imageserver/' + member.pid" primary>{{ $t('View') }}</v-btn>
                <v-btn :href="getMemberDownloadUrl(member)" primary>{{ $t('Download') }}</v-btn>
                <v-menu offset-y v-if="objectInfo.writerights">
                  <template v-slot:activator="{ on }">
                    <v-btn color="primary" dark v-on="on">{{ $t('Edit') }}<v-icon right dark>arrow_drop_down</v-icon></v-btn>
                  </template>
                  <v-list>
                    <v-list-item :to="{ name: 'metadataeditor', params: { pid: member.pid } }">
                      <v-list-item-title>{{ $t('Edit metadata') }}</v-list-item-title>
                    </v-list-item>
                    <v-list-item :to="{ name: 'rights', params: { pid: member.pid } }">
                      <v-list-item-title>{{ $t('Access rights') }}</v-list-item-title>
                    </v-list-item>
                    <v-list-item :to="{ name: 'relationships', params: { pid: member.pid } }">
                      <v-list-item-title>{{ $t('Relationships') }}</v-list-item-title>
                    </v-list-item>
                    <v-list-item :to="{ name: 'delete', params: { pid: member.pid } }">
                      <v-list-item-title>{{ $t('Delete') }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-card-actions>
            </v-card>
          </v-row>

        </v-col>

        <v-col cols="12" md="3" offset-md="1">

          <v-row class="mb-6">
            <v-col class="pt-0">
              <v-card tile flat class="grey lighten-5">
                <v-card-title class="ph-box title font-weight-light grey white--text">{{ $t('Identifiers') }}</v-card-title>
                <v-card-text class="mt-4">
                  <v-row no-gutters class="pt-2">
                    <v-col class="caption grey--text text--darken-2" cols="2">{{ $t('PID') }}</v-col>
                    <v-col cols="9" offset="1">{{ 'https://' + instanceconfig.baseurl + '/' + objectInfo.pid }}</v-col>
                  </v-row>
                  <v-row no-gutters class="pt-2" v-if="objectInfo.dc_identifier.length > 1">
                    <v-col class="caption grey--text text--darken-2" cols="2">{{ $t('ID') }}</v-col>
                    <v-col cols="9" offset="1" v-for="(id,i) in objectInfo.dc_identifier" :key="i" v-show="(id !== 'https://' + instanceconfig.baseurl + '/' + objectInfo.pid) && (id !== 'http://' + instanceconfig.baseurl + '/' + objectInfo.pid)">
                      {{ id }}
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <v-row class="my-6">
            <v-col class="pt-0">
              <v-card tile flat class="grey lighten-5">
                <v-card-title class="ph-box title font-weight-light grey white--text">{{ $t('Details') }}</v-card-title>
                <v-card-text class="mt-4">
                  <v-row no-gutters class="pt-2">
                    <v-col class="caption grey--text text--darken-2" cols="3">Depositor</v-col>
                    <v-col cols="8" offset="1" v-if="objectInfo.owner.firstname">
                      <a :href="'mailto:' + objectInfo.owner.email">{{ objectInfo.owner.firstname }} {{ objectInfo.owner.lastname }}</a>
                    </v-col>
                    <v-col v-else cols="8">{{ objectInfo.owner.username }}</v-col>
                  </v-row>
                  <v-row no-gutters class="pt-2">
                    <v-col class="caption grey--text text--darken-2" cols="3">{{ $t('Object type') }}</v-col>
                    <v-col cols="8" offset="1">{{ objectInfo.cmodel }}</v-col>
                  </v-row>
                  <v-row v-if="objectInfo.dc_format" no-gutters class="pt-2">
                    <v-col class="caption grey--text text--darken-2" cols="3">{{ $t('Format') }}</v-col>
                    <v-col cols="8" offset="1">
                      <template v-if="objectInfo.dc_format.length > 1">
                        <v-row>
                          <v-col v-for="(v,i) in objectInfo.dc_format" :key="i">{{ v }}</v-col>
                        </v-row>
                      </template>
                      <template v-else>{{ objectInfo.dc_format[0] }}</template>
                    </v-col>
                  </v-row>
                  <v-row no-gutters class="pt-2">
                    <v-col class="caption grey--text text--darken-2" cols="3">{{ $t('Created') }}</v-col>
                    <v-col cols="8" offset="1">{{ objectInfo.created | datetimeutc }}</v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <v-row class="my-6" v-if="objectInfo.ispartof || objectInfo.hassuccessor || objectInfo.isalternativeformatof || objectInfo.isalternativeversionof || objectInfo.isbacksideof">
            <v-col class="pt-0">
              <v-card tile flat class="grey lighten-5">
                <v-card-title class="ph-box title font-weight-light grey white--text">{{ $t('Relationships') }}</v-card-title>
                <v-card-text class="mt-4">
                  <v-row v-if="objectInfo.ispartof" no-gutters class="pt-2">
                    <v-col class="caption grey--text text--darken-2" cols="4">{{ $t('Is in collection') }}</v-col>
                    <v-col cols="7" offset="1">
                      <template v-if="objectInfo.ispartof.length > 1">
                        <v-row>
                          <v-col v-for="(oId,i) in objectInfo.ispartof" :key="i">
                            <router-link :to="{ name: 'detail', params: { pid: oId } }">{{ oId }}</router-link>
                          </v-col>
                        </v-row>
                      </template>
                      <template v-else>
                        <router-link :to="{ name: 'detail', params: { pid: objectInfo.ispartof[0] } }">{{ objectInfo.ispartof[0] }}</router-link>
                      </template>
                    </v-col>
                  </v-row>
                  <v-row v-if="objectInfo.hassuccessor" no-gutters class="pt-2">
                    <v-col class="caption grey--text text--darken-2" cols="4">{{ $t('Has newer version') }}</v-col>
                    <v-col cols="7" offset="1">
                      <template v-if="objectInfo.hassuccessor.length > 1">
                        <v-row>
                          <v-col v-for="(oId,i) in objectInfo.hassuccessor" :key="i">
                            <router-link :to="{ name: 'detail', params: { pid: oId } }">{{ oId }}</router-link>
                          </v-col>
                        </v-row>
                      </template>
                      <router-link :to="{ name: 'detail', params: { pid: objectInfo.hassuccessor[0] } }">{{ objectInfo.hassuccessor[0] }}</router-link>
                    </v-col>
                  </v-row>
                  <v-row v-if="objectInfo.isalternativeformatof" no-gutters class="pt-2">
                    <v-col class="caption grey--text text--darken-2" cols="4">{{ $t('Is alternative format of') }}</v-col>
                    <v-col cols="7" offset="1">
                      <template v-if="objectInfo.isalternativeformatof.length > 1">
                        <v-row>
                          <v-col v-for="(oId,i) in objectInfo.isalternativeformatof" :key="i">
                            <router-link :to="{ name: 'detail', params: { pid: oId } }">{{ oId }}</router-link>
                          </v-col>
                        </v-row>
                      </template>
                      <router-link :to="{ name: 'detail', params: { pid: objectInfo.isalternativeformatof[0] } }">{{ objectInfo.isalternativeformatof[0] }}</router-link>
                    </v-col>
                  </v-row>
                  <v-row v-if="objectInfo.isalternativeversionof" no-gutters class="pt-2">
                    <v-col class="caption grey--text text--darken-2" cols="4">{{ $t('Is alternative version of') }}</v-col>
                    <v-col cols="7" offset="1">
                      <template v-if="objectInfo.isalternativeversionof.length > 1">
                        <v-row>
                          <v-col v-for="(oId,i) in objectInfo.isalternativeversionof" :key="i">
                            <router-link :to="{ name: 'detail', params: { pid: oId } }">{{ oId }}</router-link>
                          </v-col>
                        </v-row>
                      </template>
                      <router-link :to="{ name: 'detail', params: { pid: objectInfo.isalternativeversionof[0] } }">{{ objectInfo.isalternativeversionof[0] }}</router-link>
                    </v-col>
                  </v-row>
                  <v-row v-if="objectInfo.isbacksideof" no-gutters class="pt-2">
                    <v-col class="caption grey--text text--darken-2" cols="4">{{ $t('Is back side of') }}</v-col>
                    <v-col cols="7" offset="1">
                      <template v-if="objectInfo.isbacksideof.length > 1">
                        <v-row>
                          <v-col v-for="(oId,i) in objectInfo.isbacksideof" :key="i">
                            <router-link :to="{ name: 'detail', params: { pid: oId } }">{{ oId }}</router-link>
                          </v-col>
                        </v-row>
                      </template>
                      <template v-else>
                        <router-link :to="{ name: 'detail', params: { pid: objectInfo.isbacksideof[0] } }">{{ objectInfo.isbacksideof[0] }}</router-link>
                      </template>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <v-row class="my-6">
            <v-col class="pt-0">
              <v-card tile flat class="grey lighten-5">
                <v-card-title class="ph-box title font-weight-light grey white--text">{{ $t('Metadata') }}</v-card-title>
                <v-card-text class="mt-4">
                  <v-row no-gutters class="pt-2">
                    <router-link :to="{ name: 'metadata' }">{{ $t('Show metadata') }}</router-link>
                  </v-row>
                  <v-row no-gutters class="pt-2" v-if="objectInfo.dshash['UWMETADATA']">
                    <a :href="instanceconfig.api + '/object/' + objectInfo.pid + '/uwmetadata?format=xml'" target="_blank">{{ $t('Metadata XML') }}</a>
                  </v-row>
                  <v-row no-gutters class="pt-2">
                    <a :href="instanceconfig.api + '/object/' + objectInfo.pid + '/index/dc'" target="_blank">{{ $t('Dublin Core') }}</a>
                  </v-row>
                  <v-row no-gutters class="pt-2" v-if="objectInfo.dshash['UWMETADATA']">
                    <a class="mb-1" :href="instanceconfig.api + '/object/' + objectInfo.pid + '/datacite?format=xml'" target="_blank">{{ $t('Data Cite') }}</a>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <v-row class="my-6">
            <v-col class="pt-0">
              <v-card tile flat class="grey lighten-5">
                <v-card-title class="ph-box title font-weight-light grey white--text">{{ $t('Edit') }}</v-card-title>
                <v-card-text class="mt-4">
                  <v-row no-gutters class="pt-2" v-if="objectInfo.dshash['JSON-LD']">
                    <router-link :to="{ name: 'metadataeditor' }">{{ $t('Edit metadata') }}</router-link>
                  </v-row>
                  <v-row no-gutters class="pt-2" v-if="objectInfo.dshash['UWMETADATA']">
                    <router-link :to="{ name: 'uwmetadataeditor' }">{{ $t('Edit metadata') }}</router-link>
                  </v-row>
                  <v-row no-gutters class="pt-2" v-if="(objectInfo.cmodel === 'Container') || (objectInfo.cmodel === 'Collection')">
                    <router-link class="mb-1" :to="{ name: 'sort' }">{{ $t('Sort members') }}</router-link>
                  </v-row>
                  <v-row no-gutters class="pt-2" v-if="objectInfo.cmodel === 'Container'">
                    <router-link class="mb-1" :to="{ name: 'addmember' }">{{ $t('Upload member') }}</router-link>
                  </v-row>
                  <v-row no-gutters class="pt-2" v-if="(objectInfo.cmodel !== 'Container') && (objectInfo.cmodel !== 'Collection') && (objectInfo.cmodel !== 'Resource') && (objectInfo.cmodel !== 'Book') && (objectInfo.cmodel !== 'Page')">
                    <router-link class="mb-1" :to="{ name: 'uploadwebversion' }">{{ $t('Upload web-optimized version') }}</router-link>
                  </v-row>
                  <v-row no-gutters class="pt-2">
                    <router-link class="mb-1" :to="{ name: 'rights' }">{{ $t('Access rights') }}</router-link>
                  </v-row>
                  <v-row no-gutters class="pt-2">
                    <router-link class="mb-1" :to="{ name: 'relationships' }">{{ $t('Relationships') }}</router-link>
                  </v-row>
                  <v-row no-gutters class="pt-2">
                    <router-link class="mb-1" :to="{ name: 'delete' }">{{ $t('Delete') }}</router-link>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <v-row class="my-6" v-if="(viewable && objectInfo.readrights) || (downloadable && objectInfo.readrights)">
            <v-col class="pt-0">
              <v-card tile flat class="grey lighten-5">
                <v-card-title class="ph-box title font-weight-light grey white--text">{{ $t('Data') }}</v-card-title>
                <v-card-text class="mt-4">
                  <v-row no-gutters class="pt-2" v-if="viewable && objectInfo.readrights">
                    <a target="_blank" :href="instanceconfig.api + '/object/' + objectInfo.pid + '/diss/Content/get'" primary>{{ $t('View') }}</a>
                  </v-row>
                  <template v-if="downloadable && objectInfo.readrights && (objectInfo.cmodel === 'Picture')">
                    <v-row no-gutters class="pt-2">
                      <a target="_blank" :href="instanceconfig.api + '/imageserver/?IIIF=' + objectInfo.pid + '.tif/full/pct:50/0/default.jpg'" primary>{{ $t('View scaled to 50%') }}</a>
                    </v-row>
                    <v-row no-gutters class="pt-2">
                      <a target="_blank" :href="instanceconfig.api + '/imageserver/?IIIF=' + objectInfo.pid + '.tif/full/pct:25/0/default.jpg'" primary>{{ $t('View scaled to 25%') }}</a>
                    </v-row>
                  </template>
                  <v-row no-gutters class="pt-2" v-if="downloadable && objectInfo.readrights">
                    <a :href="instanceconfig.api + '/object/' + objectInfo.pid + '/diss/Content/download'" primary>{{ $t('Download') }}</a>
                  </v-row>
                  <v-row no-gutters class="pt-2" v-if="downloadable && objectInfo.readrights && objectInfo.dshash['WEBVERSION']">
                    <a :href="instanceconfig.api + '/object/' + objectInfo.pid + '/diss/Content/downloadwebversion'" primary>{{ $t('Download web-optimized version') }}</a>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

        </v-col>

    </v-row>

    <v-row v-else>
      <v-alert :value="true" transition="slide-y-transition">{{$t('Object not found')}}</v-alert>
    </v-row>

  </v-container>
</template>

<script>
import { context } from '../mixins/context'
import { config } from '../mixins/config'
import configjs from '../config/phaidra-ui'
import axios from 'axios'
import qs from 'qs'

export default {
  name: 'detail',
  mixins: [ context, config ],
  computed: {
    routepid: function () {
      return this.$store.state.route.params.pid
    },
    objectInfo: function () {
      return this.$store.state.objectInfo
    },
    objectMembers: function () {
      return this.$store.state.objectMembers
    },
    downloadable: function () {
      switch (this.objectInfo.cmodel) {
        case 'PDFDocument':
        case 'Video':
        case 'Audio':
        case 'Picture':
        case 'Unknown':
        case 'Book':
          return true
        default:
          return false
      }
    },
    viewable: function () {
      switch (this.objectInfo.cmodel) {
        case 'PDFDocument':
        case 'Video':
        case 'Audio':
        case 'Picture':
        case 'Book':
          return true
        default:
          return false
      }
    },
    coverPid: function () {
      // HACK
      var pidNumStr = this.objectInfo.pid.substr(2)
      var coverPidNum = parseInt(pidNumStr) + 1
      return 'o:' + coverPidNum
    }
  },
  methods: {
    async fetchAsyncData (self, pid) {
      await self.$store.dispatch('fetchObjectInfo', pid)
      await self.$store.dispatch('fetchObjectMembers', pid)
    },
    getMemberDownloadUrl: function (member) {
      if (member.cmodel === 'Asset' || member.cmodel === 'Video') {
        return this.instanceconfig.fedora + '/objects/' + member.pid + '/methods/bdef:Content/download'
      } else {
        return this.instanceconfig.api + '/object/' + member.pid + '/diss/Content/download'
      }
    }
  },
  serverPrefetch () {
    console.log('[' + this.$store.state.route.params.pid + '] prefetch')
    return this.fetchAsyncData(this, this.$store.state.route.params.pid)
  },
  beforeRouteEnter: async function (to, from, next) {
    // see https://router.vuejs.org/guide/advanced/data-fetching.html#fetching-before-navigation
    // here the component does not exist yet so we don't have 'this' or access to the store
    let inforesponse
    let members = []
    try {
      console.log('[' + to.params.pid + '] fetching object info')
      inforesponse = await axios.get(configjs.instances[configjs.defaultinstance].api + '/object/' + to.params.pid + '/info')
      console.log('[' + to.params.pid + '] fetching object info done, querying object members')
      let params = {
        q: 'ismemberof:"' + to.params.pid + '"',
        defType: 'edismax',
        wt: 'json',
        qf: 'ismemberof^5',
        fl: 'pid',
        sort: 'pos_in_' + to.params.pid.replace(':', '_') + ' asc'
      }
      let query = qs.stringify(params, { encodeValuesOnly: true, indices: false })
      let membersresponse = await axios.get(configjs.instances[configjs.defaultinstance].solr + '/select?' + query)
      console.log('[' + to.params.pid + '] object has ' + membersresponse.data.response.numFound + ' members')
      if (membersresponse.data.response.numFound > 0) {
        for (let doc of membersresponse.data.response.docs) {
          console.log('[' + to.params.pid + '] fetching object info of member ' + doc.pid)
          let memresponse = await axios.get(configjs.instances[configjs.defaultinstance].api + '/object/' + doc.pid + '/info')
          console.log('[' + to.params.pid + '] fetching object info of member ' + doc.pid + ' done')
          members.push(memresponse.data.info)
        }
      }
    } catch (error) {
      console.error(error)
    }
    // on next() the component will be rendered, waits for no async calls, but we can put data to store since we already have them
    next(vm => {
      if (inforesponse) {
        if (inforesponse.data) {
          vm.$store.commit('setObjectInfo', inforesponse.data.info)
          vm.$store.commit('setObjectMembers', members)
        }
      }
    })
  },
  beforeRouteUpdate: async function (to, from, next) {
    await this.fetchAsyncData(this, to.params.pid)
    next()
  }
}
</script>

<style lang="stylus" scoped>
@require '../stylus/colors'

h3
  color: $phaidragrey.darken-4
</style>

<style scoped>
.container {
  padding: 0px;
}

.col-border {
  display: block;
  border: solid;
  border-width: 0 0 0 thin;
  border-color: rgba(0, 0, 0, 0.12);
  padding-top: 0px;
}

.showmembers {
  text-decoration: underline;
}

.ph-box {
  line-height: 1rem;
}
</style>
