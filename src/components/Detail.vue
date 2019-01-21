<template>

  <v-container fluid grid-list-md>

    <v-layout v-if="doc !== false" row>

      <v-flex xs12 md9 v-if="doc">
        <v-layout column>

          <v-flex>
            <router-link :to="{ name: 'search' }">&laquo; {{ $t('Back to search results') }}</router-link>
          </v-flex>

          <v-flex class="text-xs-center">
            <a :href="instance.api + '/object/' + doc.pid + '/diss/Content/get'">
              <img v-if="(doc.cmodel === 'PDFDocument') && (instance.baseurl === 'e-book.fwf.ac.at')" :src="'https://fedora.e-book.fwf.ac.at/fedora/get/' + doc.pid + '/bdef:Document/preview?box=480'"  class="elevation-1">
              <img v-else-if="doc.cmodel === 'PDFDocument'" class="elevation-1" :src="'https://' + instance.baseurl + '/preview/' + doc.pid + '/Document/preview/480'" />
              <img v-else-if="doc.cmodel === 'Picture' || doc.cmodel === 'Page'" class="elevation-1" :src="'https://' + instance.baseurl + '/preview/' + doc.pid + '/ImageManipulator/boxImage/480/png'" />
              <img v-else-if="doc.cmodel === 'Book'" class="elevation-1" :src="'https://' + instance.baseurl + '/preview/' + coverPid + '/ImageManipulator/boxImage/480/png'" />
            </a>
          </v-flex>

          <v-flex v-if="dshash['JSON-LD']">
            <p-d-jsonld :pid="doc.pid"></p-d-jsonld>
          </v-flex>

          <v-flex v-if="dshash['UWMETADATA']">
            <p-d-uwmetadata :indexdata="doc"></p-d-uwmetadata>
          </v-flex>

          <v-flex v-if="members">
            <v-card flat :key="p" class="ma-3">
              <h3 class="display-2 grey--text">Members ({{members.length}})</h3>
              <v-card-text class="ma-2"><p-d-jsonld v-for="(member) in members" :key="'member_'+member.pid" :pid="member.pid"></p-d-jsonld></v-card-text>
            </v-card>
          </v-flex>

          <v-flex v-else>

            
          </v-flex>

        </v-layout>
      </v-flex>

      <v-flex xs12 md3 v-if="doc">
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
                      <v-flex class="caption grey--text" xs2>PID</v-flex>
                      <v-flex xs10>{{ 'https://' + instance.baseurl + '/' + doc.pid }}</v-flex>
                    </v-layout>
                    <v-layout v-if="identifiers.length > 1" row wrap>
                      <v-flex class="caption grey--text" xs2>Other</v-flex>
                      <v-layout column>
                        <v-flex xs10 v-for="(id,i) in identifiers" :key="i" v-show="id !== 'http://' + instance.baseurl + '/' + doc.pid">
                          {{ id }}
                        </v-flex>
                      </v-layout>
                    </v-layout>
                  </v-container>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>

          <v-card flat>
            <v-card-text>
              <v-layout column>
                <v-flex>
                  <h3 class="display-2">{{ $t('Object data') }}</h3>
                </v-flex>
                <v-flex>
                  <v-container fluid grid-list-md>
                    <v-layout row>
                      <v-flex class="caption grey--text" xs4>Owner</v-flex>
                      <v-flex v-if="owner" xs8>
                        <a :href="'mailto:' + owner.email">{{ owner.firstname }} {{ owner.lastname }}</a>
                      </v-flex>
                      <v-flex v-else xs8>{{ doc.owner }}</v-flex>
                    </v-layout>
                    <v-layout row>
                      <v-flex class="caption grey--text" xs4>Object Type</v-flex>
                      <v-flex xs8>{{ doc.cmodel }}</v-flex>
                    </v-layout>
                    <v-layout row v-if="doc.dc_format">
                      <v-flex class="caption grey--text" xs4>Format</v-flex>
                      <v-flex xs8>
                        <v-layout column>
                          <v-flex v-for="(v,i) in doc.dc_format" :key="i">{{ v }}</v-flex>
                        </v-layout>
                      </v-flex>
                    </v-layout>
                    <v-layout row>
                      <v-flex class="caption grey--text" xs4>Created</v-flex>
                      <v-flex xs8>{{ doc.created | time }}</v-flex>
                    </v-layout>
                  </v-container>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>

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
          </v-card>


          <v-card flat>
            <v-card-text>
              <v-layout column>
                <v-flex>
                  <h3 class="display-2">{{ $t('Links') }}</h3>
                </v-flex>
                <v-flex class="pa-2">
                  <v-flex>
                    <router-link :to="{ name: 'metadata' }">{{ $t('Show metadata') }}</router-link>
                  </v-flex>
                  <v-flex>
                    <router-link  v-if="canWrite" :to="{ name: 'metadataeditor' }">{{ $t('Edit metadata') }}</router-link>
                  </v-flex>
                  <v-flex v-if="dshash['UWMETADATA']">
                    <a :href="instance.api + '/object/' + doc.pid + '/uwmetadata?format=xml'" target="_blank">{{ $t('Metadata XML') }}</a>
                  </v-flex>
                  <v-flex>
                    <a :href="instance.api + '/object/' + doc.pid + '/index/dc'" target="_blank">{{ $t('Dublin Core') }}</a>
                  </v-flex>
                  <v-flex>
                    <a :href="instance.api + '/object/' + doc.pid + '/datacite?format=xml'" target="_blank">{{ $t('Data Cite') }}</a>
                  </v-flex>
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-card-actions>
              <v-btn v-if="viewable && canRead" :href="instance.api + '/object/' + doc.pid + '/diss/Content/get'" primary>{{ $t('View') }}</v-btn>
              <v-btn v-if="downloadable && canRead" :href="instance.api + '/object/' + doc.pid + '/diss/Content/download'" primary>{{ $t('Download') }}</v-btn>
              <a :href="'/?#/search/?collection=' + doc.pid" target="_blank"><v-btn v-if="doc.cmodel === 'Collection'" primary>{{ $t('Show members') }}</v-btn></a>
            </v-card-actions>
          </v-card>


        </v-layout>

      </v-flex>


    </v-layout>

    <v-layout v-else>
      <v-flex>
        <v-alert :value="true" transition="slide-y-transition">{{$t('Object not found')}}</v-alert>
      </v-flex>
    </v-layout>

  </v-container>

</template>

<script>

export default {

  name: 'detail',
  computed: {
    downloadable: function () {
      switch (this.$store.state.object.doc.cmodel) {
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
      switch (this.$store.state.object.doc.cmodel) {
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
      return true // (this.$store.state.object.rights === 'ro' || this.$store.state.object.rights === 'rw')
    },
    canWrite: function () {
      return true // (this.$store.state.object.rights === 'rw')
    },
    doc: function () {
      return this.$store.state.object.doc
    },
    members: function () {
      return this.$store.state.object.members
    },
    instance () {
      return this.$store.state.settings.instance
    },
    owner: function () {
      return this.$store.state.object.owner
    },
    dshash: function () {
      var dshash = {}
      for (var i = 0; i < this.$store.state.object.doc.datastreams.length; i++) {
        dshash[this.$store.state.object.doc.datastreams[i]] = true
      }
      return dshash
    },
    identifiers: function () {
      // TODO: add id from
      // https://services.phaidra.univie.ac.at/api/object/<pid>/id
      // in loadDetail and return store value
      return this.$store.state.object.doc.dc_identifier
    },
    coverPid: function () {
      // HACK
      var pidNumStr = this.$store.state.object.doc.pid.substr(2)
      var coverPidNum = parseInt(pidNumStr) + 1
      return 'o:' + coverPidNum
    }
  },
  beforeRouteEnter: function (to, from, next) {
    next(vm => {
      vm.$store.dispatch('loadDetail', to.params.pid).then(() => {
        next()
      })
    })
  },
  beforeRouteUpdate: function (to, from, next) {
    this.$store.dispatch('loadDetail', to.params.pid).then(() => {
      next()
    })
  },
  mounted: function () {
    this.$store.dispatch('loadRoles')
  }
}
</script>

<style lang="stylus" scoped>

@require '../stylus/main'

h3
  color: $phaidragrey.darken-4
</style>

<style scoped>

.container {
  padding: 0px;
}

</style>
