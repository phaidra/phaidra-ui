<template>

  <v-container fluid>
    <v-row v-if="objectInfo">
      <v-col v-if="objectInfo.metadata['JSON-LD']">
        <code>{{ objectInfo.metadata['JSON-LD'] }}</code>
      </v-col>
    </v-row>
  </v-container>

</template>

<script>
import configjs from '../config/phaidra-ui'
import axios from 'axios'
import { context } from '../mixins/context'
import { config } from '../mixins/config'

export default {
  name: 'metadata',
  mixins: [ context, config ],
  computed: {
    routepid: function () {
      return this.$store.state.route.params.pid
    },
    objectInfo: function () {
      return this.$store.state.objectInfo
    }
  },
  data () {
    return {
      active: null
    }
  },
  methods: {
    async fetchAsyncData (self, pid) {
      await self.$store.dispatch('fetchObjectInfo', pid)
    }
  },
  serverPrefetch () {
    console.log('[' + this.$store.state.route.params.pid + '] prefetch')
    return this.fetchAsyncData(this, this.$store.state.route.params.pid)
  },
  beforeRouteEnter: async function (to, from, next) {
    let inforesponse
    try {
      console.log('[' + to.params.pid + '] fetching object info')
      inforesponse = await axios.get(configjs.instances[configjs.defaultinstance].api + '/object/' + to.params.pid + '/info')
      console.log('[' + to.params.pid + '] fetching object info done')
    } catch (error) {
      console.error(error)
    }
    next(vm => {
      if (inforesponse) {
        if (inforesponse.data) {
          vm.$store.commit('setObjectInfo', inforesponse.data.info)
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
