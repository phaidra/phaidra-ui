<template>
  <v-container fluid grid-list-md>

    <v-layout row wrap>

        <v-flex xs12 md8 class="pr-1">
          <v-layout column>

            <v-flex>
              <v-breadcrumbs :items="breadcrumbs" divider="/"></v-breadcrumbs>
            </v-flex>
<!--
            <v-flex class="text-xs-center my-4">
              <a :href="instance.api + '/object/' + doc.pid + '/diss/Content/get'">
                <img v-if="(doc.cmodel === 'PDFDocument') && (instance.baseurl === 'e-book.fwf.ac.at')" :src="'https://fedora.e-book.fwf.ac.at/fedora/get/' + doc.pid + '/bdef:Document/preview?box=480'"  class="elevation-1">
                <img v-else-if="doc.cmodel === 'PDFDocument'" class="elevation-1" :src="'https://' + instance.baseurl + '/preview/' + doc.pid + '/Document/preview/480'" />
                <img v-else-if="doc.cmodel === 'Picture' || doc.cmodel === 'Page'" class="elevation-1" :src="'https://' + instance.baseurl + '/preview/' + doc.pid + '/ImageManipulator/boxImage/480/png'" />
                <img v-else-if="doc.cmodel === 'Book'" class="elevation-1" :src="'https://' + instance.baseurl + '/preview/' + coverPid + '/ImageManipulator/boxImage/480/png'" />
              </a>
              <center v-if="(doc.cmodel === 'Audio')">
                <audio controls>
                  <source :src="'https://' + instance.baseurl + '/open/' + doc.pid">
                  Your browser does not support the audio element.
                </audio>
              </center>
            </v-flex>
-->
            <!--
            <v-flex v-if="dshash['JSON-LD']">
              <p-d-jsonld
                :jsonld="displayjsonld[doc.pid]" :pid="doc.pid"
              ></p-d-jsonld>
            </v-flex>
            -->

            <!--
            <v-flex v-if="dshash['UWMETADATA']">
              <p-d-uwmetadata :indexdata="doc"></p-d-uwmetadata>
            </v-flex>
            -->
<!--
            <h3 class="display-2 grey--text ma-4">{{$t('Members')}} ({{members.length}})</h3>

            <v-flex v-if="members">
              <v-card class="mb-3 pt-4" v-for="(member) in members" :key="'member_'+member.pid">
                <a :href="instance.api + '/object/' + member.pid + '/diss/Content/get'">
                  <v-img class="mb-3" max-height="300" contain v-if="(member.cmodel === 'PDFDocument') && (instance.baseurl === 'e-book.fwf.ac.at')" :src="'https://fedora.e-book.fwf.ac.at/fedora/get/' + member.pid + '/bdef:Document/preview?box=480'"/>
                  <v-img class="mb-3" max-height="300" contain v-else-if="member.cmodel === 'PDFDocument'" :src="'https://' + instance.baseurl + '/preview/' + member.pid + '/Document/preview/480'" />
                  <v-img class="mb-3" max-height="300" contain v-else-if="member.cmodel === 'Picture' || member.cmodel === 'Page'" :src="'https://' + instance.baseurl + '/preview/' + member.pid + '/ImageManipulator/boxImage/480/png'" />
                </a>
                <center v-if="(member.cmodel === 'Audio')">
                  <audio controls>
                    <source :src="'https://' + instance.baseurl + '/open/' + member.pid">
                    Your browser does not support the audio element.
                  </audio>
                </center>
                <v-card-text class="ma-2">
                  <p-d-jsonld
                    :jsonld="displayjsonld[member.pid]" :pid="member.pid"
                  ></p-d-jsonld>
                </v-card-text>
                <v-divider light v-if="canRead"></v-divider>
                <v-card-actions class="pa-3" v-if="canRead">
                  <v-spacer></v-spacer>
                  <v-btn v-if="member.cmodel === 'Picture'" target="_blank" :href="'https://' + instance.baseurl + '/imageserver/' + member.pid" primary>{{ $t('View') }}</v-btn>
                  <v-btn :href="getMemberDownloadUrl(member)" primary>{{ $t('Download') }}</v-btn>
                  <v-menu offset-y v-if="canWrite">
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
                        <v-flex xs10 v-if="objectInfo">{{ 'https://' + instance.baseurl + '/' + objectInfo.pid }}</v-flex>
                        <!-- keep else here to keep the same number of children, otherwise hydration fails -->
                        <v-flex xs10 v-else>...</v-flex>
                      </v-layout>
                      <!--
                      <v-layout v-if="identifiers.length > 1" row wrap>
                        <v-flex class="caption grey--text" xs2>{{ $t('Other') }}</v-flex>
                        <v-layout column>
                          <v-flex xs10 v-for="(id,i) in identifiers" :key="i" v-show="id !== 'http://' + instance.baseurl + '/' + doc.pid">
                            {{ id }}
                          </v-flex>
                        </v-layout>
                      </v-layout>
                      -->
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
                          <a :href="'mailto:' + owner.email">{{ owner.firstname }} {{ owner.lastname }}</a>
                        </v-flex>
                        <v-flex xs8 v-if="doc">{{ doc.owner }}</v-flex>
                      </v-layout>
                      <v-layout row>
                        <v-flex class="caption grey--text" xs4>{{ $t('Object Type') }}</v-flex>
                        <v-flex xs8>{{ doc.cmodel }}</v-flex>
                      </v-layout>
                      <v-layout row v-if="doc.dc_format">
                        <v-flex class="caption grey--text" xs4>{{ $t('Format') }}</v-flex>
                        <v-flex xs8>
                          <v-layout column>
                            <v-flex v-for="(v,i) in doc.dc_format" :key="i">{{ v }}</v-flex>
                          </v-layout>
                        </v-flex>
                      </v-layout>
                      <v-layout row>
                        <v-flex class="caption grey--text" xs4>{{ $t('Created') }}</v-flex>
                        <v-flex xs8>{{ doc.created | time }}</v-flex>
                      </v-layout>
                      -->
                    </v-container>
                  </v-flex>
                </v-layout>
              </v-card-text>
              <v-divider></v-divider>
            </v-card>

<!--
            <v-card flat v-if="doc.ispartof || doc.hassuccessor || doc.isalternativeformatof || doc.isalternativeversionof || doc.isbacksideof">
              <v-card-text>
                <v-layout column>
                  <v-flex>
                    <h3 class="display-2">{{ $t('Relationships') }}</h3>
                  </v-flex>
                  <v-flex>
                    <v-container fluid grid-list-md>
                      <v-layout row v-if="doc.ispartof">
                        <v-flex class="caption grey--text" xs4>{{ $t('Is in collection') }}</v-flex>
                        <v-flex xs8>
                          <v-layout column>
                            <v-flex v-for="(v,i) in doc.ispartof" :key="i">
                              <router-link :to="{ name: 'detail', params: { pid: v } }">{{ v }}</router-link>
                            </v-flex>
                          </v-layout>
                        </v-flex>
                      </v-layout>
                      <v-layout row v-if="doc.hassuccessor">
                        <v-flex class="caption grey--text" xs4>{{ $t('Has newer version') }}</v-flex>
                        <v-flex xs8>
                          <v-layout column>
                            <v-flex v-for="(v,i) in doc.hassuccessor" :key="i">
                              <router-link :to="{ name: 'detail', params: { pid: v } }">{{ v }}</router-link>
                            </v-flex>
                          </v-layout>
                        </v-flex>
                      </v-layout>
                      <v-layout row v-if="doc.isalternativeformatof">
                        <v-flex class="caption grey--text" xs4>{{ $t('Is alternative format of') }}</v-flex>
                        <v-flex xs8>
                          <v-layout column>
                            <v-flex v-for="(v,i) in doc.isalternativeformatof" :key="i">
                              <router-link :to="{ name: 'detail', params: { pid: v } }">{{ v }}</router-link>
                            </v-flex>
                          </v-layout>
                        </v-flex>
                      </v-layout>
                      <v-layout row v-if="doc.isalternativeversionof">
                        <v-flex class="caption grey--text" xs4>{{ $t('Is alternative version of') }}</v-flex>
                        <v-flex xs8>
                          <v-layout column>
                            <v-flex v-for="(v,i) in doc.isalternativeversionof" :key="i">
                              <router-link :to="{ name: 'detail', params: { pid: v } }">{{ v }}</router-link>
                            </v-flex>
                          </v-layout>
                        </v-flex>
                      </v-layout>
                      <v-layout row v-if="doc.isbacksideof">
                        <v-flex class="caption grey--text" xs4>{{ $t('Is back side of') }}</v-flex>
                        <v-flex xs8>
                          <v-layout column>
                            <v-flex v-for="(v,i) in doc.isbacksideof" :key="i">
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
                      <a class="mb-1" v-if="dshash['UWMETADATA']" :href="instance.api + '/object/' + doc.pid + '/uwmetadata?format=xml'" target="_blank">{{ $t('Metadata XML') }}</a>
                      <a class="mb-1" :href="instance.api + '/object/' + doc.pid + '/index/dc'" target="_blank">{{ $t('Dublin Core') }}</a>
                      <a class="mb-1" :href="instance.api + '/object/' + doc.pid + '/datacite?format=xml'" target="_blank">{{ $t('Data Cite') }}</a>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-card-text>
              <v-divider></v-divider>
            </v-card>

            <v-card flat v-if="canWrite">
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

            <v-card flat v-if="viewable || downloadable || (doc.cmodel === 'Collection')">
              <v-card-text>
                <v-layout column>
                  <v-flex>
                    <h3 class="display-2">{{ $t('Links') }}</h3>
                  </v-flex>
                  <v-flex class="ma-2">
                    <v-layout column>
                      <a class="mb-1" v-if="viewable && canRead" :href="instance.api + '/object/' + doc.pid + '/diss/Content/get'" primary>{{ $t('View') }}</a>
                      <a class="mb-1" v-if="downloadable && canRead" :href="instance.api + '/object/' + doc.pid + '/diss/Content/download'" primary>{{ $t('Download') }}</a>
                      <a class="mb-1" v-if="doc.cmodel === 'Collection'" :href="'/?#/search/?collection=' + doc.pid" target="_blank">{{ $t('Show members') }}</a>
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
import qs from 'qs'
import Vue from 'vue'

export default {
  name: 'detail',
  data () {
    return {
      displayjsonld: {},
      docdata: null,
      metadata: null,
      members: [],
      // owner: '',
      rights: ''
    }
  },
  computed: {
    objectInfo: function () {
      return this.$store.state.objectInfo
    },
    breadcrumbs: function () {
      let bc = [
        {
          text: this.$t('Search'),
          to: { name: 'search', path: '/' }
        },
        {
          text: this.$t('Detailpage') + ' ' + this.$route.params.pid,
          disabled: true,
          to: { name: 'detail', params: { pid: this.$route.params.pid } }
        }
      ]
      return bc
    },
    downloadable: function () {
      switch (this.doc.cmodel) {
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
      switch (this.doc.cmodel) {
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
    canRead: function () {
      return this.signedin & true // (this.$store.state.object.rights === 'ro' || this.$store.state.object.rights === 'rw')
    },
    canWrite: function () {
      return this.signedin & true // (this.$store.state.object.rights === 'rw')
    },
    signedin () {
      return this.$store.state.user.token ? 1 : 0
    },
    instance () {
      return this.$store.state.settings.instance
    },
    dshash: function () {
      var dshash = {}
      for (var i = 0; i < this.doc.datastreams.length; i++) {
        dshash[this.doc.datastreams[i]] = true
      }
      return dshash
    },
    /*
    identifiers: function () {
      // TODO: add id from
      // https://services.phaidra.univie.ac.at/api/object/<pid>/id
      // in loadDetail and return store value
      return this.doc.dc_identifier
    },
    */
    coverPid: function () {
      // HACK
      var pidNumStr = this.doc.pid.substr(2)
      var coverPidNum = parseInt(pidNumStr) + 1
      return 'o:' + coverPidNum
    },
    owner: function () {
      return this.$store.state.currentOwner
    }
  },
  methods: {
    async loadDetail (self, pid) {
      self.pid = pid

      self.displayjsonld = {}
      self.members = []

      await self.loadRights(self, pid)

      var params = {
        q: 'pid:"' + pid + '"',
        defType: 'edismax',
        wt: 'json',
        qf: 'pid^5'
      }

      var query = qs.stringify(params, { encodeValuesOnly: true, indices: false })
      var url = self.$store.state.settings.instance.solr + '/select?' + query

      let promise = this.$http.get(url)

      promise.then(async function (response) {
        if (response.data.response.numFound > 0) {
          console.log('[' + pid + '] loaded doc')
          self.docdata = response.data.response.docs[0]
          try {
            // await self.loadOwner(self, response.data.response.docs[0].owner)
            if (self.dshash['JSON-LD']) {
              await self.loadJsonld(self, pid)
              await self.loadMembers(self, pid)
            }
          } catch (error) {
            console.log(error)
          }
        } else {
          self.docdata = null
        }
      }).catch(function (error) {
        console.log(error)
      })

      return promise
    },
    async loadJsonld (self, pid) {
      var url = self.$store.state.settings.instance.api + '/object/' + pid + '/metadata?mode=resolved'
      try {
        let response = await this.$http.get(url)
        console.log('[' + pid + '] loaded jsonld')
        Vue.set(self.displayjsonld, pid, response.data.metadata['JSON-LD'])
      } catch (error) {
        console.log(error)
      }
    },
    async loadMembers (self, pid) {
      for (let member of self.members) {
        member['jsonld'] = {}
      }

      var params = {
        q: 'ismemberof:"' + pid + '"',
        defType: 'edismax',
        wt: 'json',
        qf: 'ismemberof^5',
        fl: 'pid,cmodel',
        sort: 'pos_in_' + pid.replace(':', '_') + ' asc'
      }

      var query = qs.stringify(params, { encodeValuesOnly: true, indices: false })
      var url = self.$store.state.settings.instance.solr + '/select?' + query
      try {
        let response = await this.$http.get(url)
        console.log('[' + pid + '] loaded members[' + response.data.response.numFound + ']')
        if (response.data.response.numFound > 0) {
          self.members = response.data.response.docs
          for (let mem of self.members) {
            await self.loadJsonld(self, mem.pid)
          }
        } else {
          self.members = []
        }
      } catch (error) {
        console.log(error)
      }
    },
    fetchOwner (self, username) {
      console.log('[' + self.pid + '] loading owner for username[' + username + ']')
      return self.$store.dispatch('fetchOwner', username)
    },
    fetchObjectInfo (self, pid) {
      return self.$store.dispatch('fetchObjectInfo', pid)
    },
    async loadRights (self, pid) {
      var url = self.$store.state.settings.instance.api + '/authz/check/' + pid
      // check if we have write rights
      try {
        let response = await this.$http.get(url + '/rw/', { headers: { 'X-XSRF-TOKEN': self.$store.state.user.token } })
        if (response.status === 200) {
          self.rights = 'rw'
        } else {
          // if not, check if we have read rights
          let response2 = await this.$http.get(url + '/ro/', { headers: { 'X-XSRF-TOKEN': self.$store.state.user.token } })
          if (response2.status === 200) {
            self.rights = 'ro'
          }
        }
      } catch (error) {
        console.log('[' + pid + '] checking rw rights: ' + error.response.status)
      }
    },
    getMemberDownloadUrl: function (member) {
      if (member.cmodel === 'Asset' || member.cmodel === 'Video') {
        return this.instance.fedora + '/objects/' + member.pid + '/methods/bdef:Content/download'
      } else {
        return this.instance.api + '/object/' + member.pid + '/diss/Content/download'
      }
    }
  },
  serverPrefetch () {
    console.log('[' + this.$store.state.route.params.pid + '] prefetch')
    return this.fetchObjectInfo(this, this.$store.state.route.params.pid)
  },
  beforeRouteEnter: function (to, from, next) {
    next(vm => {
      if (typeof window !== 'undefined') {
        let fetch = true
        if (vm.$store.state.currentDoc) {
          console.log('beforeRouteEnter currentpid[' + vm.$store.state.currentDoc.pid + '] routepid[' + to.params.pid + ']')
          if (vm.$store.state.currentDoc.pid === to.params.pid) {
            fetch = false
          }
        }
        if (fetch) {
          vm.fetchObjectInfo(vm, to.params.pid).then(() => {
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
    console.log('client[' + typeof window + '] [' + to.params.pid + '] beforeRouteUpdate doc[' + this.$store.state.currentDoc + ']')
    if (!this.$store.state.currentDoc) {
      this.fetchObjectInfo(this, to.params.pid).then(() => {
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
