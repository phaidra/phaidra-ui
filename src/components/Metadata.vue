<template>

  <v-container fluid grid-list-md>
    <v-layout column v-if="metadata">

      <v-flex>
        <router-link :to="{ name: 'detail', params: { pid: pid } }">&laquo; {{ pid }}</router-link>
      </v-flex>

      <v-flex v-if="metadata['uwmetadata']">
        <v-tabs v-model="active" slider-color="primary" color="lighten-3">
          <v-tab v-for="(node,i) in metadata.uwmetadata" :key="i" :href="'#' + node.xmlname" v-show="(node.xmlname !== 'etheses') && node.xmlname !== 'annotation'" ripple>{{ $t('uwm_' + node.xmlname) }}</v-tab>
        </v-tabs>
        <v-tabs-items v-model="active">
          <v-tab-item v-for="(node,i) in metadata.uwmetadata" :key="i" :id="node.xmlname" v-show="(node.xmlname !== 'etheses') && node.xmlname !== 'annotation'" class="pa-3">
            <v-card flat class="grey lighten-5">
              <v-card-text>
                <uwmetadata-renderer v-for="(child,i) in node.children" :key="i" :node="child" :path="'uwm_' + node.xmlname"></uwmetadata-renderer>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-flex>

      <v-flex v-if="metadata['JSON-LD']">
        <vue-json-pretty :data="metadata['JSON-LD']"></vue-json-pretty>
      </v-flex>

    </v-layout>

  </v-container>

</template>

<script>
import UwmetadataRenderer from '@/components/UwmetadataRenderer'
import VueJsonPretty from 'vue-json-pretty'

export default {

  name: 'metadata',
  components: {
    UwmetadataRenderer,
    VueJsonPretty
  },
  computed: {
    pid: function () {
      return this.$route.params.pid
    },
    metadata: function () {
      return this.$store.state.object.metadata
    }
  },
  data () {
    return {
      active: null
    }
  },
  methods: {
    next () {
      this.active = this.tabs[(this.tabs.indexOf(this.active) + 1) % this.tabs.length]
    }
  },
  beforeRouteEnter: function (to, from, next) {
    next(vm => {
      vm.$store.commit('setMetadata', null)
      vm.$store.dispatch('loadMetadata', to.params.pid).then(() => {
        next()
      })
    })
  },
  beforeRouteUpdate: function (to, from, next) {
    this.$store.commit('setMetadata', null)
    this.$store.dispatch('loadMetadata', to.params.pid).then(() => {
      next()
    })
  }
}
</script>
