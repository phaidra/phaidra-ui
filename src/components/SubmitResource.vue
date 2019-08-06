<template>
  <v-container>
    <v-layout column>
      <v-flex>
        <p-breadcrumbs :items="breadcrumbs"></p-breadcrumbs>
      </v-flex>
      <template v-if="cmodelparam === 'picture'">
        <v-flex>
          <v-btn raised color="primary" :to="{ name: 'submitform', params: { cmodel: 'picture', submitform: 'digital' } }">
            {{$t('Born-digital')}}
          </v-btn>
          {{$t('This material originates in digital form.')}}
        </v-flex>
        <v-divider class="my-4"></v-divider>
        <v-flex>
          <v-btn raised color="primary" :to="{ name: 'submitform', params: { cmodel: 'picture', submitform: 'digitized' } }">
            {{$t('Digitized')}}
          </v-btn>
          {{$t('This material originates in analog form.')}}
        </v-flex>
        <v-divider class="my-4"></v-divider>
        <v-flex>
          <v-btn raised color="primary" :to="{ name: 'submitform', params: { cmodel: 'picture', submitform: 'map' } }">
            {{$t('Map')}}
          </v-btn>
          {{$t('A digitized map')}}
        </v-flex>
      </template>
    </v-layout>
  </v-container>
</template>

<script>
import { breadcrumbs } from '../mixins/breadcrumbs'

export default {
  name: 'submitform',
  mixins: [ breadcrumbs ],
  computed: {
    cmodelparam: function () {
      return this.$route.params.cmodel
    },
    cmodel: function () {
      for (let cm of this.contentmodels) {
        if (cm.cmodelparam === this.cmodelparam) {
          return cm
        }
      }
      return { text: '' }
    }
  },
  methods: {
    updateBreadcrumbs: function () {
      this.breadcrumbs = this.getRootBreadcrumbs()
      this.breadcrumbs.push(
        {
          text: this.$t('Submit'),
          to: '/submit'
        }
      )
      this.breadcrumbs.push(
        {
          text: this.$t('Submit') + ' ' + this.$t(this.cmodel.text),
          disabled: true,
          to: { name: 'submitresource', params: { cmodel: this.cmodel } }
        }
      )
    }
  },
  data () {
    return {
      contentmodels: [
        {
          text: 'Data',
          cmodelparam: 'data',
          value: 'https://pid.phaidra.org/vocabulary/7AVS-Y482'
        },
        {
          text: 'Picture',
          cmodelparam: 'picture',
          value: 'https://pid.phaidra.org/vocabulary/44TN-P1S0'
        },
        {
          text: 'Audio',
          cmodelparam: 'audio',
          value: 'https://pid.phaidra.org/vocabulary/8YB5-1M0J'
        },
        {
          text: 'Video',
          cmodelparam: 'video',
          value: 'https://pid.phaidra.org/vocabulary/B0Y6-GYT8'
        },
        {
          text: 'Document',
          cmodelparam: 'document',
          value: 'https://pid.phaidra.org/vocabulary/69ZZ-2KGX'
        },
        {
          text: 'Resource',
          cmodelparam: 'resource',
          value: 'https://pid.phaidra.org/vocabulary/8MY0-BQDQ'
        }
      ],
      form: { sections: [] }
    }
  },
  beforeRouteEnter: function (to, from, next) {
    next(vm => { vm.updateBreadcrumbs() })
  },
  beforeRouteUpdate: function (to, from, next) {
    this.updateBreadcrumbs()
  }

}
</script>
