<template>
  <v-layout column>
    <v-flex>
      <v-breadcrumbs :items="breadcrumbs" divider="/"></v-breadcrumbs>
    </v-flex>
    <v-flex v-if="signedin">
      <p-m-sort v-if="members.length > 0" :pid="pid" :cmodel="loadedcmodel" :members="members" @input="members=$event" @order-saved="orderSaved($event)"></p-m-sort>
      <p-m-delete v-if="settings.global.enabledelete" :pid="pid" :cmodel="loadedcmodel" :members="members" @object-deleted="objectDeleted($event)"></p-m-delete>
    </v-flex>
  </v-layout>
</template>

<script>
import qs from 'qs'

export default {
  name: 'manage',
  computed: {
    loadedcmodel: function () {
      return 'cmodel' in this.doc ? this.doc.cmodel : 'unknown'
    },
    signedin () {
      return this.$store.state.user.token ? 1 : 0
    },
    pid () {
      return this.$route.params.pid
    },
    breadcrumbs: function () {
      let bc = [
        {
          text: this.$t('Search'),
          to: { name: 'search', path: '/' }
        },
        {
          text: this.$t('Detailpage') + ' ' + this.parentpid,
          to: { name: 'detail', params: { pid: this.parentpid } }
        },
        {
          text: this.$t('Manage') + ' ' + this.$route.params.pid,
          disabled: true,
          to: { name: 'manage', params: { pid: this.$route.params.pid } }
        }
      ]
      return bc
    },
    instance () {
      return this.$store.state.settings.instance
    },
    settings () {
      return this.$store.state.settings
    }
  },
  data () {
    return {
      members: [],
      doc: {},
      parentpid: ''
    }
  },
  methods: {
    loadManagement: function (self, pid) {
      return self.loadDoc(self, pid)
        .then(function (response) {
          return self.loadMembers(self, pid)
        })
    },
    loadDoc: function (self, pid) {
      this.members = []

      var params = {
        q: 'pid:"' + pid + '"',
        defType: 'edismax',
        wt: 'json',
        qf: 'pid^5'
      }

      var query = qs.stringify(params, { encodeValuesOnly: true, indices: false })
      var url = self.instance.solr + '/select?' + query
      var promise = fetch(url, {
        method: 'GET',
        mode: 'cors'
      })
        .then(function (response) { return response.json() })
        .then(function (json) {
          if (json.response.numFound > 0) {
            self.doc = json.response.docs[0]
          } else {
            self.doc = {}
          }
        })
        .catch(function (error) {
          console.log(error)
        })

      return promise
    },
    loadMembers (self, pid) {
      this.members = []

      var params = {
        q: 'ismemberof:"' + pid + '"',
        defType: 'edismax',
        wt: 'json',
        qf: 'ismemberof^5',
        fl: 'pid,cmodel,dc_title,created',
        sort: 'pos_in_' + pid.replace(':', '_') + ' asc'
      }

      var query = qs.stringify(params, { encodeValuesOnly: true, indices: false })
      var url = self.instance.solr + '/select?' + query
      var promise = fetch(url, {
        method: 'GET',
        mode: 'cors'
      })
        .then(function (response) { return response.json() })
        .then(function (json) {
          if (json.response.numFound > 0) {
            self.members = json.response.docs
          } else {
            self.members = []
          }
        })
        .catch(function (error) {
          console.log(error)
        })

      return promise
    },
    orderSaved: function (event) {
      this.$store.commit('setAlerts', [{ type: 'success', msg: 'Order for object ' + event + ' saved' }])
    },
    objectDeleted: function (event) {
      this.$store.commit('setAlerts', [{ type: 'success', msg: 'Object' + this.pid + ' was successfully deleted.' }])
      if (this.pid === this.parentpid) {
        this.$router.push({ name: 'search' })
      } else {
        this.$router.push({ name: 'detail', params: { pid: this.parentpid } })
      }
    }
  },
  beforeRouteEnter: function (to, from, next) {
    next(vm => {
      vm.parentpid = from.params.pid
      vm.loadManagement(vm, to.params.pid).then(() => {
        next()
      })
    })
  },
  beforeRouteUpdate: function (to, from, next) {
    this.parentpid = from.params.pid
    this.loadManagement(this, to.params.pid).then(() => {
      next()
    })
  }
}
</script>

<style>
.list {
  max-height: 80vh;
  margin: 0 auto;
  padding: 0;
  overflow: auto;
  background-color: #f3f3f3;
  border: 1px solid #efefef;
  border-radius: 3;
}
.list-item {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  width: 100%;
  padding: 20px;
  background-color: #fff;
  border-bottom: 1px solid #efefef;
  box-sizing: border-box;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  color: #333;
  font-weight: 400;
}
.list-item-title {
  padding-left: 20px;
}
</style>
