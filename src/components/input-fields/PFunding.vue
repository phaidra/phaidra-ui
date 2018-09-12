<template>

    <v-layout row>

      <v-flex xs10>

        <v-layout column>

          <v-layout row>
            <v-flex xs6>
              <v-text-field
                :value="projectName"
                :label="'Project name'"
                v-on:input="$emit('input-project-name', $event)"
                box
              ></v-text-field>
            </v-flex>
            <v-flex xs2>
              <v-select 
                v-on:input="$emit('input-project-name-language', $event)" 
                :label="'Language'"
                :items="vocabularies['lang'].terms" 
                :value="projectNameLanguage"
                box
              ></v-select>                      
            </v-flex>
            <v-flex xs4>
              <v-text-field
                :value="projectId"
                :label="'Project ID'"
                v-on:input="$emit('input-project-id', $event)"
                box
              ></v-text-field>
            </v-flex>    
          </v-layout>

          <v-layout row>
            <v-flex xs6>
              <v-text-field
                :value="funderName"
                :label="'Funder name'"
                v-on:input="$emit('input-funder-name', $event)"
                box
              ></v-text-field>
            </v-flex>
            <v-flex xs2>
              <v-select 
                v-on:input="$emit('input-funder-name-language', $event)" 
                :label="'Language'"
                :items="vocabularies['lang'].terms" 
                :value="funderNameLanguage"
                box
              ></v-select>                      
            </v-flex>
            <v-flex xs4>
              <v-text-field
                :value="funderId"
                :label="'Funder ID'"
                v-on:input="$emit('input-funder-id', $event)"
                box
              ></v-text-field>
            </v-flex>    
          </v-layout>
        </v-layout>
      </v-flex>
      
      <v-flex xs1>
        <v-container fill-height>
          <v-layout class="vertical-center" row>
            <v-flex>
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
  name: 'p-funding',
  computed: {
    vocabularies: function () {
      return this.$store.state.vocabulary.vocabularies
    }
  },
  props: {
    projectName: {
      type: String
    },
    projectNameLanguage: {
      type: String
    },
    projectId: {
      type: String
    },
    funderName: {
      type: String
    },
    funderNameLanguage: {
      type: String
    },
    funderId: {
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
