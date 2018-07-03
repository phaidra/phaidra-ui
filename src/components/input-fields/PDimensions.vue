<template>
  <v-layout row>
    <v-flex xs3>
      <v-select 
        v-on:input="$emit('input-source', $event)" 
        :label="'Source'"
        :items="vocabularies['getty-aat-photo'].terms" 
        :value="source"
        box
      ></v-select>                 
    </v-flex>
    <v-flex xs1>
      <v-select 
        v-on:input="$emit('input-unit', $event)" 
        :label="'Unit'"
        :items="vocabularies['un-cefact'].terms" 
        :value="unit"
        box
      ></v-select>                 
    </v-flex>
    <v-flex xs2>
      <v-text-field
        :value="width" 
        v-on:input="$emit('input-width', $event)" 
        :label="'Width'"
        box
      ></v-text-field>
    </v-flex>
    <v-flex xs2>
      <v-text-field
        :value="height" 
        v-on:input="$emit('input-height', $event)" 
        :label="'Height'"
        box
      ></v-text-field>
    </v-flex>    
    <v-flex xs2 v-if="multiplicable" >
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
  name: 'p-dimensions',
  computed: {
    vocabularies: function () {
      return this.$store.state.vocabulary.vocabularies
    }
  },
  props: {
    source: {
      type: String
    },
    unit: {
      type: String
    },
    width: {
      type: String
    },
    height: {
      type: String
    },
    label: {
      type: String,
      required: true
    },
    multiplicable: {
      type: Boolean
    }
  }
}
</script>

<style scoped>
.v-btn {
  margin: 0;
}
</style>