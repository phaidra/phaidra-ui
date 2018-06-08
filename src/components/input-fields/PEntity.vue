<template>
  <v-layout row>
    <v-flex xs2>
      <v-text-field
        :value="firstname"
        :label="'Firstname'"
        v-on:input="$emit('input-firstname', $event)"
      ></v-text-field>
    </v-flex>
    <v-flex xs2>
      <v-text-field
        :value="lastname"
        :label="'Lastname'"
        v-on:input="$emit('input-lastname', $event)"
      ></v-text-field>
    </v-flex>
    <v-flex xs2 v-if="showrole">
      <v-select 
        v-on:input="$emit('input-role', $event)" 
        :label="'Role'" 
        :items="vocabularies['http://id.loc.gov/vocabulary/iso639-2'].terms" 
        :value="role"        
      ></v-select>                      
    </v-flex>
    <v-flex xs2 v-if="showdate">
      <v-menu
        ref="datepicker"
        v-model="datepicker"
        :return-value.sync="date"
        lazy
        transition="fade-transition"
        offset-y
        full-width
        min-width="290px"
      >
        <v-text-field
          slot="activator"
          v-model="selectedDate"
          :label="'Date'"
          append-icon="event"
        ></v-text-field>
        <v-date-picker v-model="selectedDate" :value="date" v-on:input="$emit('input-date', $event)" :reactive="true"></v-date-picker>
      </v-menu>
    </v-flex>
    <v-flex xs2>
      <v-container fill-height>
        <v-layout row>
          <v-flex class="pt-4">
            <icon v-if="multiplicable" name="material-content-add" width="24px" height="24px" v-on:click.native="$emit('add', $event)"></icon>
            <icon v-if="multiplicable" name="material-content-remove" width="24px" height="24px" v-on:click.native="$emit('remove', $event)"></icon>
            <icon v-if="ordered" name="material-hardware-arrow-down" width="24px" height="24px" v-on:click.native="$emit('down', $event)"></icon>
            <icon v-if="ordered" name="material-hardware-arrow-up" width="24px" height="24px" v-on:click.native="$emit('up', $event)"></icon>
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
  name: 'p-entity',
  computed: {
    vocabularies: function () {
      return this.$store.state.vocabulary.vocabularies
    }
  },
  props: {
    firstname: {
      type: String
    },
    lastname: {
      type: String
    },
    role: {
      type: String
    },
    date: {
      type: String
    },
    required: {
      type: Boolean
    },
    multiplicable: {
      type: Boolean
    },
    ordered: {
      type: Boolean
    },
    showrole: {
      type: Boolean,
      default: true
    },
    showdate: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      datepicker: false,
      selectedDate: ''
    }
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
