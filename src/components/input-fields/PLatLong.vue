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

<style scoped>
.btn {
  margin: 0;
}
</style>