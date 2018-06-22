<template>
  <v-layout row>
    <v-flex xs2>
      <v-select 
        v-on:input="$emit('input-source', $event)" 
        :label="'Source'"
        :items="vocabularies['http://id.loc.gov/vocabulary/iso639-2'].terms" 
        :value="source"
      ></v-select>                 
    </v-flex>
    <v-flex xs1>
      <v-select 
        v-on:input="$emit('input-unit', $event)" 
        :label="'Unit'"
        :items="vocabularies['http://id.loc.gov/vocabulary/iso639-2'].terms" 
        :value="unit"
      ></v-select>                 
    </v-flex>
    <v-flex xs1>
      <v-text-field
        :value="length" 
        v-on:input="$emit('input-length', $event)" 
        :label="'Length'"
      ></v-text-field>
    </v-flex>    
    <v-flex xs1>
      <v-text-field
        :value="width" 
        v-on:input="$emit('input-width', $event)" 
        :label="'Width'"
      ></v-text-field>
    </v-flex>
    <v-flex xs1>
      <v-text-field
        :value="height" 
        v-on:input="$emit('input-height', $event)" 
        :label="'Height'"
      ></v-text-field>
    </v-flex>
    <v-flex xs2>
      <v-text-field
        :value="circumference" 
        v-on:input="$emit('input-circumference', $event)" 
        :label="'Circumference'"
      ></v-text-field>
    </v-flex>
    <v-flex xs2>
      <v-container fill-height>
        <v-layout row>
          <v-flex class="pt-4">
            <v-btn v-if="multiplicable" flat icon slot="activator" v-on:click.native="$emit('add', $event)">
              <icon name="material-content-add" width="24px" height="24px"></icon>
            </v-btn>
            <v-btn v-if="multiplicable" flat icon slot="activator" v-on:click.native="$emit('remove', $event)">
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
    length: {
      type: String
    },
    width: {
      type: String
    },
    height: {
      type: String
    },
    circumference: {
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
.btn {
  margin: 0;
}
</style>