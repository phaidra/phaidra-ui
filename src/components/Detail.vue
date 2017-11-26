<template>

  <v-container fluid grid-list-md>

    <v-layout row>

      <v-flex xs12 md8>
        <v-layout column>

          <v-flex class="text-xs-center">
            <a :href="config.api + '/object/' + doc.pid + '/diss/Content/get'">
              <img :src="'https://' + config.instance + '/preview/' + doc.pid + '/Document/preview/480'" />
            </a>
          </v-flex>

          <v-flex v-for="(title,i) in titles" :key="i" class="mt-3">
            <v-container fluid>
              <v-layout row>
                <v-flex class="caption grey--text" xs2>
                  {{ $t('Title') }} ({{ title.lang }})
                </v-flex>
                <v-flex xs10>
                  {{ title.value }}
                </v-flex>
              </v-layout>
            </v-container>
          </v-flex>

          <v-flex v-for="(role,i) in roles" :key="i" class="mt-3">
            <v-container fluid>
              <v-layout row>
                <v-flex class="caption grey--text" xs2>
                  {{ role.label }}
                </v-flex>
                <v-flex xs10>
                  <v-layout column>
                    <v-flex v-for="(entity,j) in role.entities" :key="j">
                      {{ entity.firstname }} {{ entity.lastname }} <span class="grey--text">{{ entity.institution }}</span>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-container>
          </v-flex>

        </v-layout>
      </v-flex>
      <v-flex xs12 md4>

      </v-flex>

    </v-layout>
      <v-btn :href="config.api + '/object/' + doc.pid + '/diss/Content/get'" flat>{{ $t('View') }}</v-btn>
      <v-btn :href="config.api + '/object/' + doc.pid + '/diss/Content/download'" flat>{{ $t('Download') }}</v-btn>
      <v-flex>
        <router-link :to="{ name: 'search' }">{{ $t('Back') }}</router-link>
      </v-flex>

    </v-layout>

  </v-container>

</template>

<script>

export default {
  name: 'detail',
  computed: {
    doc: function () {
      return this.$store.state.object.doc
    },
    config () {
      return this.$store.state.config
    },
    titles: function () {
      var titles = []
      var doc = this.$store.state.object.doc
      Object.keys(doc).forEach(function (field) {
        if (field.startsWith('dc_title_')) {
          for (var i = 0; i < doc[field].length; i++) {
            titles.push({ value: doc[field][i], lang: field.substr(field.length - 3) })
          }
        }
      })
      return titles
    },
    roles: function () {
      var rolesHash = {}
      var sortedContr = JSON.parse(this.$store.state.object.doc.uwm_roles_json).sort(function (a, b) {
        return a.data_order - b.data_order
      })
      for (var i = 0; i < sortedContr.length; i++) {
        sortedContr[i].entities = sortedContr[i].entities.sort(function (a, b) {
          return a.data_order - b.data_order
        })
        // merge multiple entities and multiple contributions if they have the same role
        if (!rolesHash[sortedContr[i].role]) {
          rolesHash[sortedContr[i].role] = {
            role: sortedContr[i].role,
            label: sortedContr[i].role === 'aut' ? this.$t('Author') : this.$t(this.$store.state.search.marcRoles[sortedContr[i].role]),
            entities: []
          }
        }
        for (var j = 0; j < sortedContr[i].entities.length; j++) {
          rolesHash[sortedContr[i].role]['entities'].push(sortedContr[i].entities[j])
        }
      }

      var roles = []
      Object.keys(rolesHash).forEach(function (r) {
        roles.push(rolesHash[r])
      })
      return roles
    }
  },
  beforeRouteEnter: function (to, from, next) {
    next(vm => {
      vm.$store.dispatch('loadDoc', to.params.pid).then(() => {
        next()
      })
    })
  },
  beforeRouteUpdate: function (to, from, next) {
    this.$store.dispatch('loadDoc', to.params.pid).then(() => {
      next()
    })
  },
  created: function () {
    this.$store.commit('setDoc', null)
    this.$store.dispatch('loadDoc', this.$route.params.pid)
  }
}
</script>

<style scoped>


</style>
