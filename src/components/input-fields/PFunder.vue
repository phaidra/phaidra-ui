<template>

    <v-layout row>

      <v-flex xs10>

        <v-layout column>
          <v-layout row>
            <v-flex xs6>
              <v-text-field
                :value="name"
                :label="'Funder name'"
                v-on:input="$emit('input-name', $event)"
                box
              ></v-text-field>
            </v-flex>
            <v-flex xs2>
              <v-select 
                v-on:input="$emit('input-name-language', $event)" 
                :label="'Language'"
                :items="vocabularies['lang'].terms" 
                :value="nameLanguage"
                box
              ></v-select>                      
            </v-flex>
            <v-flex xs4>
              <v-text-field
                :value="identifier"
                :label="'Funder identifier'"
                v-on:input="$emit('input-identifier', $event)"
                box
              ></v-text-field>
            </v-flex>    
          </v-layout>
        </v-layout>
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
  name: 'p-funder',
  computed: {
    vocabularies: function () {
      return this.$store.state.vocabulary.vocabularies
    }
  },
  props: {
    name: {
      type: String
    },
    nameLanguage: {
      type: String
    },
    identifier: {
      type: String
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
.vertical-center {
 align-items: center;
}
</style>
