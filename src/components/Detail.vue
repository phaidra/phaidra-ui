<template>
  <v-container fluid grid-list-md>

    <v-layout row wrap>

        <v-flex xs12 md8 class="pr-1">
          <v-layout column>

            <!--<h1 v-if="objectInfo">X</h1>-->
            <h1>{{objectInfo.pid}}</h1>

<!--
            <v-flex v-if="objectInfo" class="text-xs-center my-4">
              <a :href="instanceconfig.api + '/object/' + objectInfo.pid + '/diss/Content/get'">
                <img v-if="(objectInfo.cmodel === 'PDFDocument') && (instanceconfig.baseurl === 'e-book.fwf.ac.at')" :src="'https://fedora.e-book.fwf.ac.at/fedora/get/' + objectInfo.pid + '/bdef:Document/preview?box=480'"  class="elevation-1">
                <img v-else-if="objectInfo.cmodel === 'PDFDocument'" class="elevation-1" :src="'https://' + instanceconfig.baseurl + '/preview/' + objectInfo.pid + '/Document/preview/480'" />
                <img v-else-if="objectInfo.cmodel === 'Picture' || objectInfo.cmodel === 'Page'" class="elevation-1" :src="'https://' + instanceconfig.baseurl + '/preview/' + objectInfo.pid + '/ImageManipulator/boxImage/480/png'" />
                <img v-else-if="objectInfo.cmodel === 'Book'" class="elevation-1" :src="'https://' + instanceconfig.baseurl + '/preview/' + coverPid + '/ImageManipulator/boxImage/480/png'" />
              </a>
              <center v-if="(objectInfo.cmodel === 'Audio')">
                <audio controls>
                  <source :src="'https://' + instanceconfig.baseurl + '/open/' + objectInfo.pid">
                  Your browser does not support the audio element.
                </audio>
              </center>
            </v-flex>

            <v-flex v-if="objectInfo && objectInfo.dshash['JSON-LD']">
              <p-d-jsonld :jsonld="objectInfo.metadata['JSON-LD']" :pid="objectInfo.pid"></p-d-jsonld>
            </v-flex>
-->
            <!--
            <v-flex v-if="objectInfo.dshash['UWMETADATA']">
              <p-d-uwmetadata :indexdata="doc"></p-d-uwmetadata>
            </v-flex>
            -->
<!--
            <h3 class="display-2 grey--text ma-4">{{$t('Members')}} ({{members.length}})</h3>

            <v-flex v-if="members">
              <v-card class="mb-3 pt-4" v-for="(member) in members" :key="'member_'+member.pid">
                <a :href="instance.api + '/object/' + member.pid + '/diss/Content/get'">
                  <v-img class="mb-3" max-height="300" contain v-if="(member.cmodel === 'PDFDocument') && (instanceconfig.baseurl === 'e-book.fwf.ac.at')" :src="'https://fedora.e-book.fwf.ac.at/fedora/get/' + member.pid + '/bdef:Document/preview?box=480'"/>
                  <v-img class="mb-3" max-height="300" contain v-else-if="member.cmodel === 'PDFDocument'" :src="'https://' + instanceconfig.baseurl + '/preview/' + member.pid + '/Document/preview/480'" />
                  <v-img class="mb-3" max-height="300" contain v-else-if="member.cmodel === 'Picture' || member.cmodel === 'Page'" :src="'https://' + instanceconfig.baseurl + '/preview/' + member.pid + '/ImageManipulator/boxImage/480/png'" />
                </a>
                <center v-if="(member.cmodel === 'Audio')">
                  <audio controls>
                    <source :src="'https://' + instanceconfig.baseurl + '/open/' + member.pid">
                    Your browser does not support the audio element.
                  </audio>
                </center>
                <v-card-text class="ma-2">
                  <p-d-jsonld
                    :jsonld="displayjsonld[member.pid]" :pid="member.pid"
                  ></p-d-jsonld>
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
                      <v-list-tile :to="{ name: 'metadataeditor', params: { pid: member.pid } }">
                        <v-list-tile-title>{{ $t('Edit metadata') }}</v-list-tile-title>
                      </v-list-tile>
                      <v-list-tile :to="{ name: 'manage', params: { pid: member.pid } }">
                        <v-list-tile-title>{{ $t('Manage object') }}</v-list-tile-title>
                      </v-list-tile>
                    </v-list>
                  </v-menu>
                </v-card-actions>
              </v-card>
            </v-flex>

            <v-flex v-else>

            </v-flex>
-->
          </v-layout>

        </v-flex>

        <v-flex xs12 md3 offset-xs0 offset-md1>
          <v-layout column grid-list-md>

            <v-card flat>
              <v-card-text>
                <v-layout column>
                  <v-flex>
                    <h3 class="display-2">{{ $t('Identifiers') }}</h3>
                  </v-flex>
                  <v-flex>
                    <v-container grid-list-md fluid>
                      <v-layout row wrap>
                        <v-flex class="caption grey--text" xs2>{{ $t('PID') }}</v-flex>
                        <v-flex xs10 v-if="objectInfo">{{ 'https://' + instanceconfig.baseurl + '/' + objectInfo.pid }}</v-flex>
                        <v-flex xs10 v-else>...</v-flex>
                      </v-layout>
                      <v-layout v-if="objectInfo && (objectInfo.dc_identifier.length > 1)" row wrap>
                        <v-flex class="caption grey--text" xs2>{{ $t('Other') }}</v-flex>
                        <v-layout column>
                          <v-flex xs10 v-for="(id,i) in objectInfo.dc_identifier" :key="i" v-show="id !== 'http://' + instanceconfig.baseurl + '/' + objectInfo.pid">
                            {{ id }}
                          </v-flex>
                        </v-layout>
                      </v-layout>
                    </v-container>
                  </v-flex>
                </v-layout>
              </v-card-text>
              <v-divider></v-divider>
            </v-card>

            <v-card flat>
              <v-card-text>
                <v-layout column>
                  <v-flex>
                    <h3 class="display-2">{{ $t('Object data') }}</h3>
                  </v-flex>
                  <v-flex>
                    <v-container fluid grid-list-md>
                      <!--
                      <v-layout row>
                        <v-flex class="caption grey--text" xs4>{{ $t('Owner') }}</v-flex>
                        <v-flex xs8>
                          <a :href="'mailto:' + objectInfo.owner.email">{{ objectInfo.owner.firstname }} {{ objectInfo.owner.lastname }}</a>
                        </v-flex>
                        <v-flex xs8 v-if="doc">{{ objectInfo.owner }}</v-flex>
                      </v-layout>
                      <v-layout row>
                        <v-flex class="caption grey--text" xs4>{{ $t('Object Type') }}</v-flex>
                        <v-flex xs8>{{ objectInfo.cmodel }}</v-flex>
                      </v-layout>
                      <v-layout row v-if="objectInfo.dc_format">
                        <v-flex class="caption grey--text" xs4>{{ $t('Format') }}</v-flex>
                        <v-flex xs8>
                          <v-layout column>
                            <v-flex v-for="(v,i) in objectInfo.dc_format" :key="i">{{ v }}</v-flex>
                          </v-layout>
                        </v-flex>
                      </v-layout>
                      <v-layout row>
                        <v-flex class="caption grey--text" xs4>{{ $t('Created') }}</v-flex>
                        <v-flex xs8>{{ objectInfo.created | time }}</v-flex>
                      </v-layout>
                      -->
                    </v-container>
                  </v-flex>
                </v-layout>
              </v-card-text>
              <v-divider></v-divider>
            </v-card>

<!--
            <v-card flat v-if="objectInfo.ispartof || objectInfo.hassuccessor || objectInfo.isalternativeformatof || objectInfo.isalternativeversionof || objectInfo.isbacksideof">
              <v-card-text>
                <v-layout column>
                  <v-flex>
                    <h3 class="display-2">{{ $t('Relationships') }}</h3>
                  </v-flex>
                  <v-flex>
                    <v-container fluid grid-list-md>
                      <v-layout row v-if="objectInfo.ispartof">
                        <v-flex class="caption grey--text" xs4>{{ $t('Is in collection') }}</v-flex>
                        <v-flex xs8>
                          <v-layout column>
                            <v-flex v-for="(v,i) in objectInfo.ispartof" :key="i">
                              <router-link :to="{ name: 'detail', params: { pid: v } }">{{ v }}</router-link>
                            </v-flex>
                          </v-layout>
                        </v-flex>
                      </v-layout>
                      <v-layout row v-if="objectInfo.hassuccessor">
                        <v-flex class="caption grey--text" xs4>{{ $t('Has newer version') }}</v-flex>
                        <v-flex xs8>
                          <v-layout column>
                            <v-flex v-for="(v,i) in objectInfo.hassuccessor" :key="i">
                              <router-link :to="{ name: 'detail', params: { pid: v } }">{{ v }}</router-link>
                            </v-flex>
                          </v-layout>
                        </v-flex>
                      </v-layout>
                      <v-layout row v-if="objectInfo.isalternativeformatof">
                        <v-flex class="caption grey--text" xs4>{{ $t('Is alternative format of') }}</v-flex>
                        <v-flex xs8>
                          <v-layout column>
                            <v-flex v-for="(v,i) in objectInfo.isalternativeformatof" :key="i">
                              <router-link :to="{ name: 'detail', params: { pid: v } }">{{ v }}</router-link>
                            </v-flex>
                          </v-layout>
                        </v-flex>
                      </v-layout>
                      <v-layout row v-if="objectInfo.isalternativeversionof">
                        <v-flex class="caption grey--text" xs4>{{ $t('Is alternative version of') }}</v-flex>
                        <v-flex xs8>
                          <v-layout column>
                            <v-flex v-for="(v,i) in objectInfo.isalternativeversionof" :key="i">
                              <router-link :to="{ name: 'detail', params: { pid: v } }">{{ v }}</router-link>
                            </v-flex>
                          </v-layout>
                        </v-flex>
                      </v-layout>
                      <v-layout row v-if="objectInfo.isbacksideof">
                        <v-flex class="caption grey--text" xs4>{{ $t('Is back side of') }}</v-flex>
                        <v-flex xs8>
                          <v-layout column>
                            <v-flex v-for="(v,i) in objectInfo.isbacksideof" :key="i">
                              <router-link :to="{ name: 'detail', params: { pid: v } }">{{ v }}</router-link>
                            </v-flex>
                          </v-layout>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-flex>
                </v-layout>
              </v-card-text>
              <v-divider></v-divider>
            </v-card>
-
            <v-card flat>
              <v-card-text>
                <v-layout column>
                  <v-flex>
                    <h3 class="display-2">{{ $t('Metadata') }}</h3>
                  </v-flex>
                  <v-flex class="ma-2">
                    <v-layout column>
                      <router-link class="mb-1" :to="{ name: 'metadata' }">{{ $t('Show metadata') }}</router-link>
                      <a class="mb-1" v-if="objectInfo.dshash['UWMETADATA']" :href="instance.api + '/object/' + objectInfo.pid + '/uwmetadata?format=xml'" target="_blank">{{ $t('Metadata XML') }}</a>
                      <a class="mb-1" :href="instance.api + '/object/' + objectInfo.pid + '/index/dc'" target="_blank">{{ $t('Dublin Core') }}</a>
                      <a class="mb-1" :href="instance.api + '/object/' + objectInfo.pid + '/datacite?format=xml'" target="_blank">{{ $t('Data Cite') }}</a>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-card-text>
              <v-divider></v-divider>
            </v-card>

            <v-card flat v-if="objectInfo.writerights">
              <v-card-text>
                <v-layout column>
                  <v-flex>
                    <h3 class="display-2">{{ $t('Edit') }}</h3>
                  </v-flex>
                  <v-flex class="ma-2">
                    <v-layout column>
                      <router-link class="mb-1" :to="{ name: 'metadataeditor' }">{{ $t('Edit metadata') }}</router-link>
                      <router-link class="mb-1" :to="{ name: 'manage' }">{{ $t('Manage object') }}</router-link>
                      <router-link class="mb-1" :to="{ name: 'addmember' }">{{ $t('Upload container member') }}</router-link>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-card-text>
              <v-divider></v-divider>
            </v-card>

            <v-card flat v-if="viewable || downloadable || (objectInfo.cmodel === 'Collection')">
              <v-card-text>
                <v-layout column>
                  <v-flex>
                    <h3 class="display-2">{{ $t('Links') }}</h3>
                  </v-flex>
                  <v-flex class="ma-2">
                    <v-layout column>
                      <a class="mb-1" v-if="viewable && objectInfo.readrights" :href="instance.api + '/object/' + objectInfo.pid + '/diss/Content/get'" primary>{{ $t('View') }}</a>
                      <a class="mb-1" v-if="downloadable && objectInfo.readrights" :href="instance.api + '/object/' + objectInfo.pid + '/diss/Content/download'" primary>{{ $t('Download') }}</a>
                      <a class="mb-1" v-if="objectInfo.cmodel === 'Collection'" :href="'/?#/search/?collection=' + objectInfo.pid" target="_blank">{{ $t('Show members') }}</a>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
            -->
          </v-layout>

        </v-flex>

    </v-layout>
<!--
    <v-layout v-else>
      <v-flex>
        <v-alert :value="true" transition="slide-y-transition">{{$t('Object not found')}}</v-alert>
      </v-flex>
    </v-layout>
-->
  </v-container>
</template>

<script>
import { context } from '../mixins/context'
import { config } from '../mixins/config'

export default {
  name: 'detail',
  mixins: [ context, config ],
  computed: {
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
  beforeRouteEnter: function (to, from, next) {
    next(vm => {
      if (typeof window !== 'undefined') {
        let fetch = true
        if (vm.$store.state.objectInfo) {
          console.log('beforeRouteEnter currentpid[' + vm.$store.state.objectInfo.pid + '] routepid[' + to.params.pid + ']')
          if (vm.$store.state.objectInfo.pid === to.params.pid) {
            fetch = false
          }
        }
        if (fetch) {
          vm.fetchAsyncData(vm, to.params.pid).then(() => {
            next()
          })
        } else {
          next()
        }
      } else {
        next()
      }
    })
  },
  beforeRouteUpdate: function (to, from, next) {
    console.log('[' + to.params.pid + '] beforeRouteUpdate doc[' + this.$store.state.objectInfo + ']')
    if (!this.$store.state.objectInfo) {
      this.fetchAsyncData(this, to.params.pid).then(() => {
        next()
      })
    } else {
      next()
    }
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
</style>
