<template>

  <v-container fluid grid-list-md>
    <v-layout column v-if="metadata">

      <v-flex>
        <router-link :to="{ name: 'detail', params: { pid: pid } }">&laquo; {{ pid }}</router-link>
      </v-flex>

      <v-flex>

        <v-tabs v-model="active" dark>
          <v-tabs-bar>
            <v-tabs-item v-for="(node,i) in metadata.uwmetadata" :key="i" :href="'#' + node.xmlname" ripple>{{ $t('uwm_' + node.xmlname) }}</v-tabs-item>
            <v-tabs-slider color="white"></v-tabs-slider>
          </v-tabs-bar>
          <v-tabs-items>
            <v-tabs-content v-for="(node,i) in metadata.uwmetadata" :key="i" :id="node.xmlname">
              <v-card flat class="grey lighten-5">
                <v-card-text>
                  <metadatarenderer v-for="(child,i) in node.children" :key="i" :node="child" :path="'uwm_' + node.xmlname"></metadatarenderer>
                </v-card-text>
              </v-card>
            </v-tabs-content>
          </v-tabs-items>
        </v-tabs>

      </v-flex>
    </v-layout>

  </v-container>

</template>

<script>
import Metadatarenderer from '@/components/Metadatarenderer'

export default {

  name: 'metadata',
  components: {
    Metadatarenderer
  },
  computed: {
    pid: function () {
      return this.$route.params.pid
    },
    metadata: function () {
      return this.$store.state.object.metadata
    },
    config () {
      return this.$store.state.config
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


