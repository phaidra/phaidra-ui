<template>
  <v-layout row>
    <v-flex xs8>
      <v-text-field         
        :value="value" 
        v-on:input="$emit('input', $event)" 
        :label="label" 
        :required="required"
        :rules="required ? [ v => !!v || 'Required'] : []"
        :multi-line="multiline"
      ></v-text-field>
    </v-flex>
    <v-flex xs2 v-if="multilingual">
      <v-select 
        v-on:input="$emit('input-language', $event)" 
        :label="'Language'"
        :required="required"
        :rules="required ? [ v => !!v || 'Required'] : []"
        :items="vocabularies['lang'].terms" 
        :value="language"
      ></v-select>                      
    </v-flex>
    <v-flex xs2>
      <v-container fill-height>
        <v-layout row>
          <v-flex class="pt-4">
            <v-btn flat icon slot="activator" v-on:click.native="$emit('add', $event)">
              <icon v-if="multiplicable" name="material-content-add" width="24px" height="24px"></icon>
            </v-btn>
            <v-btn flat icon slot="activator" v-on:click.native="$emit('remove', $event)">
              <icon v-if="multiplicable" name="material-content-remove" width="24px" height="24px"></icon>
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
import '@/compiled-icons/material-hardware-arrow-down'
import '@/compiled-icons/material-hardware-arrow-up'

export default {
  name: 'p-text-field',
  computed: {
    vocabularies: function () {
      return this.$store.state.vocabulary.vocabularies
    }
  },
  props: {
    value: {
      type: String,
      required: true
    },
    language: {
      type: String
    },
    label: {
      type: String,
      required: true
    },
    required: {
      type: Boolean
    },
    multiline: {
      type: Boolean
    },
    multilingual: {
      type: Boolean
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
