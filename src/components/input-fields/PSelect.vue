<template>
  <v-layout row>
    <v-flex xs8>
      <v-autocomplete
        :value="value"
        :required="required"
        v-on:input="$emit('input', $event)"
        :rules="required ? [ v => !!v || 'Required'] : []"
        :items="vocabularies[vocabulary].terms"
        :loading="loading"
        hide-no-data
        hide-selected
        item-text="text"
        item-value="value"
        :label="label"
        box
      ></v-autocomplete>
    </v-flex>
    <v-flex xs4 v-if="multiplicable" >
      <v-container fill-height>
        <v-layout row>
          <v-flex>
            <v-btn flat icon slot="activator" v-on:click.native="$emit('add', $event)">
              <icon name="material-content-add" width="24px" height="24px"></icon>
            </v-btn>
            <v-btn flat icon slot="activator" v-on:click.native="$emit('remove', $event)">
              <icon name="material-content-remove" width="24px" height="24px"></icon>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script>
import '@/compiled-icons/material-content-add'
import '@/compiled-icons/material-content-remove'

export default {
  name: 'p-select',
  computed: {
    vocabularies: function () {
      return this.$store.state.vocabulary.vocabularies
    }
  },
  props: {
    value: {
      type: [String, Object],
      required: true
    },
    label: {
      type: String,
      required: true
    },
    required: {
      type: Boolean
    },
    multiplicable: {
      type: Boolean
    },
    vocabulary: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      loading: false
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      this.loading = true
      // check vocabulary loaded?
      this.loading = false
    })
  }
}
</script>

<style scoped>
.btn {
  margin: 0;
}
</style>
