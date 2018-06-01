<template>
  <v-layout row>
    <v-flex xs8>
      <v-select 
        v-if="required"
        :value="value" 
        v-on:input="$emit('input', $event)" 
        :label="label" 
        :required="required"
        :rules="[ v => !!v || 'Required' ]"
        :loading="loading"
        :items="vocabularies[vocabulary].terms"
        autocomplete
      ></v-select>
      <v-select 
        v-else
        :value="value" 
        v-on:input="$emit('input', $event)" 
        :label="label" 
        :loading="loading"
        :items="vocabularies[vocabulary].terms"
        autocomplete
      ></v-select>
    </v-flex>
    <v-flex xs4>
      <v-container fill-height>
        <v-layout row>
          <v-flex class="pt-4">
            <icon v-if="multiplicable" name="material-content-add" width="24px" height="24px" v-on:click.native="$emit('add', $event)"></icon>
            <icon v-if="multiplicable" name="material-content-remove" width="24px" height="24px" v-on:click.native="$emit('remove', $event)"></icon>
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
/*
.form-background {
  background-color: #f3f3f3;
}
*/
</style>
