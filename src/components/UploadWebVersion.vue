<template>
  <v-col>
    <v-card>
      <v-toolbar flat>
        <v-toolbar-title>{{ $t('Upload web version of') }} {{this.parentpid}}</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-file-input :label="$t('Select file')"></v-file-input>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script>
import { context } from '../mixins/context'

export default {
  name: 'upload-web-version',
  mixins: [ context ],
  data () {
    return {
      parentpid: ''
    }
  },
  methods: {
  },
  beforeRouteEnter: function (to, from, next) {
    next(vm => {
      vm.parentpid = from.params.pid
    })
  },
  beforeRouteUpdate: function (to, from, next) {
    this.parentpid = from.params.pid
  }
}
</script>
