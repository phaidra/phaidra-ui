<template>
  <v-container>
    <v-layout column>
      <template v-if="$route.params.cmodel === 'document'">
        <v-flex>
          <v-btn raised color="primary" :to="{ name: 'submitform', params: { cmodel: 'document', submitform: 'digital' } }">
            {{$t('Born-digital')}}
          </v-btn>
          {{$t('This material originates in digital form.')}}
        </v-flex>
        <v-divider class="my-4"></v-divider>
        <v-flex>
          <v-btn raised color="primary" :to="{ name: 'submitform', params: { cmodel: 'document', submitform: 'poster' } }">
            {{$t('Research data poster')}}
          </v-btn>
          {{$t('Research data poster')}}
        </v-flex>
        <v-divider class="my-4"></v-divider>
        <v-flex>
          <v-btn raised color="primary" :to="{ name: 'submitform', params: { cmodel: 'document', submitform: 'digitized' } }">
            {{$t('Digitized')}}
          </v-btn>
          {{$t('This material originates in analog form.')}}
        </v-flex>
      </template>
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
      <template v-if="$route.params.cmodel === 'audio'">
        <v-flex>
          <v-btn raised color="primary" :to="{ name: 'submitform', params: { cmodel: 'audio', submitform: 'digital' } }">
            {{$t('Born-digital')}}
          </v-btn>
          {{$t('This material originates in digital form.')}}
        </v-flex>
        <v-divider class="my-4"></v-divider>
        <v-flex>
          <v-btn raised color="primary" :to="{ name: 'submitform', params: { cmodel: 'audio', submitform: 'digitized' } }">
            {{$t('Digitized')}}
          </v-btn>
          {{$t('This material was copied from a physical carrier.')}}
        </v-flex>
      </template>
      <template v-if="$route.params.cmodel === 'video'">
        <v-flex>
          <v-btn raised color="primary" :to="{ name: 'submitform', params: { cmodel: 'video', submitform: 'digital' } }">
            {{$t('Born-digital')}}
          </v-btn>
          {{$t('This material originates in digital form.')}}
        </v-flex>
        <v-divider class="my-4"></v-divider>
        <v-flex>
          <v-btn raised color="primary" :to="{ name: 'submitform', params: { cmodel: 'video', submitform: 'digitized' } }">
            {{$t('Digitized')}}
          </v-btn>
          {{$t('This material was copied from a physical carrier.')}}
        </v-flex>
      </template>
      <template v-if="$route.params.cmodel === 'data'">
        <v-flex>
          <v-btn raised color="primary" :to="{ name: 'submitform', params: { cmodel: 'data', submitform: 'general' } }">
            {{$t('General')}}
          </v-btn>
          {{$t('Anything.')}}
        </v-flex>
        <v-divider class="my-4"></v-divider>
        <v-flex>
          <v-btn raised color="primary" :to="{ name: 'submitform', params: { cmodel: 'data', submitform: 'researchdata' } }">
            {{$t('Research data')}}
          </v-btn>
          {{$t('Research data.')}}
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
