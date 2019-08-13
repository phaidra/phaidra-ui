<template>
  <v-container>
    <v-layout column>
      <template v-if="$route.params.cmodel === 'picture'">
        <v-flex>
          <v-btn raised color="primary" :to="{ name: 'submitform', params: { cmodel: 'picture', submitform: 'digital' } }">
            {{$t('Born-digital')}}
          </v-btn>
          {{$t('This material originates in digital form.')}}
        </v-flex>
        <v-divider class="my-4"></v-divider>
        <v-flex>
          <v-btn raised color="primary" :to="{ name: 'submitform', params: { cmodel: 'picture', submitform: 'physicalobject' } }">
            {{$t('Physical object')}}
          </v-btn>
          {{$t('This image represents a physical object.')}}
        </v-flex>
        <v-divider class="my-4"></v-divider>
        <v-flex>
          <v-btn raised color="primary" :to="{ name: 'submitform', params: { cmodel: 'picture', submitform: 'digitized' } }">
            {{$t('Digitized')}}
          </v-btn>
          {{$t('This material originates in analog form.')}}
        </v-flex>
        <v-divider class="my-4"></v-divider>
        <v-flex>
          <v-btn raised color="primary" :to="{ name: 'submitform', params: { cmodel: 'picture', submitform: 'map' } }">
            {{$t('Map')}}
          </v-btn>
          {{$t('A digitized map')}}
        </v-flex>
      </template>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'submitform'
}
</script>
