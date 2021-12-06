<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <template v-if="$route.params.cmodel === 'document'">
          <v-btn raised color="primary mr-2" :to="localePath('/submit/document/digital')">
            {{$t('Born-digital')}}
          </v-btn>
          {{$t('This material originates in digital form.')}}
          <v-divider class="my-4"></v-divider>
          <v-btn raised color="primary mr-2" :to="localePath('/submit/document/poster')">
            {{$t('Research data poster')}}
          </v-btn>
          {{$t('Research data poster')}}
          <v-divider class="my-4"></v-divider>
          <v-btn raised color="primary mr-2" :to="localePath('/submit/document/digitized')">
            {{$t('Digitized')}}
          </v-btn>
          {{$t('This material originates in analog form.')}}
        </template>
        <template v-if="$route.params.cmodel === 'picture'">
          <v-btn raised color="primary mr-2" :to="localePath('/submit/picture/digital')">
            {{$t('Born-digital')}}
          </v-btn>
          {{$t('This material originates in digital form.')}}
          <v-divider class="my-4"></v-divider>
          <v-btn raised color="primary mr-2" :to="localePath('/submit/picture/physicalobject')">
            {{$t('Physical object')}}
          </v-btn>
          {{$t('This image represents a physical object.')}}
          <v-divider class="my-4"></v-divider>
          <v-btn raised color="primary mr-2" :to="localePath('/submit/picture/digitized')">
            {{$t('Digitized')}}
          </v-btn>
          {{$t('This material originates in analog form.')}}
          <v-divider class="my-4"></v-divider>
          <v-btn raised color="primary mr-2" :to="localePath('/submit/picture/map')">
            {{$t('Map')}}
          </v-btn>
          {{$t('A digitized map')}}
        </template>
        <template v-if="$route.params.cmodel === 'audio'">
          <v-btn raised color="primary mr-2" :to="localePath('/submit/audio/digital')">
            {{$t('Born-digital')}}
          </v-btn>
          {{$t('This material originates in digital form.')}}
          <v-divider class="my-4"></v-divider>
          <v-btn raised color="primary mr-2" :to="localePath('/submit/audio/digitized')">
            {{$t('Digitized')}}
          </v-btn>
          {{$t('This material was copied from a physical carrier.')}}
        </template>
        <template v-if="$route.params.cmodel === 'video'">
          <v-btn raised color="primary mr-2" :to="localePath('/submit/video/digital')">
            {{$t('Born-digital')}}
          </v-btn>
          {{$t('This material originates in digital form.')}}
          <v-divider class="my-4"></v-divider>
          <v-btn raised color="primary mr-2" :to="localePath('/submit/video/digitized')">
            {{$t('Digitized')}}
          </v-btn>
          {{$t('This material was copied from a physical carrier.')}}
        </template>
        <template v-if="$route.params.cmodel === 'data'">
          <v-btn raised color="primary mr-2" :to="localePath('/submit/data/general')">
            {{$t('General')}}
          </v-btn>
          {{$t('Anything.')}}
          <v-divider class="my-4"></v-divider>
          <v-btn raised color="primary mr-2" :to="localePath('/submit/data/researchdata')">
            {{$t('Research data')}}
          </v-btn>
          {{$t('Research data.')}}
        </template>
        <template v-if="$route.params.cmodel === 'collection'">
          <v-btn raised color="primary mr-2" :to="localePath('/submit/collection/digital')">
            {{$t('Digital')}}
          </v-btn>
          {{$t('A born-digital ("virtual") collection.')}}
          <v-divider class="my-4"></v-divider>
          <v-btn raised color="primary mr-2" :to="localePath('/submit/collection/digitized')">
            {{$t('Digitized')}}
          </v-btn>
          {{$t('I.e. a physical collection which needs to be ontologically described in a similar way to a digitized object.')}}
        </template>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: 'main'
}
</script>
