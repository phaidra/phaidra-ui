<template>

  <v-container>
    <v-layout row>
      <v-flex >
        <p-i-form :mode="'edit'" ref="edit" v-on:object-saved="objectSaved($event)"></p-i-form>
      </v-flex>
    </v-layout>
  </v-container>

</template>

<script>
export default {
  name: 'metadata-editor',
  computed: {
    pid: function () {
      return this.$route.params.pid
    }
  },
  methods: {
    objectSaved: function (event) {
      this.$store.commit('setAlerts', [{ type: 'success', msg: 'Metadata for object ' + event + ' saved' }])
      this.$router.push({ name: 'detail', params: { pid: event } })
      this.$vuetify.goTo(0)
    }
  },
  mounted: function () {
    this.$refs.edit.loadMetadata(this.pid)
  }
}
</script>
