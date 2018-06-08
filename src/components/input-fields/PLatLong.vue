<template>
  <v-layout row>
    <v-flex xs8>
      <v-text-field         
        :value="value" 
        v-on:input="$emit('input', $event)" 
        :label="label" 
        :required="required"
        :rules="required ? [ v => !!v || 'Required'] : []"
      ></v-text-field>
    </v-flex>    
    <v-flex xs2>
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
  name: 'p-lat-long',
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
    multiplicable: {
      type: Boolean
    }
  }
}
</script>
