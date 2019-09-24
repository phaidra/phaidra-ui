<template>
  <v-container>
    <v-row>
      <v-col>
        <template v-if="$route.params.cmodel === 'ir'">
          <v-btn raised color="primary mr-2" :to="{ name: 'submit-ir', params: { submitform: 'journal-article' } }">
            {{$t('Journal article')}}
          </v-btn>
          {{$t('Journal article.')}}
          <v-divider class="my-4"></v-divider>
          <v-btn raised color="primary mr-2" :to="{ name: 'submit-ir', params: { submitform: 'book' } }">
            {{$t('Book')}}
          </v-btn>
          {{$t('Book.')}}
          <v-divider class="my-4"></v-divider>
          <v-btn raised color="primary mr-2" :to="{ name: 'submit-ir', params: { submitform: 'book-part' } }">
            {{$t('Book chapter')}}
          </v-btn>
          {{$t('Book chapter.')}}
        </template>
        <template v-if="$route.params.cmodel === 'document'">
          <v-btn raised color="primary mr-2" :to="{ name: 'submitform', params: { cmodel: 'document', submitform: 'digital' } }">
            {{$t('Born-digital')}}
          </v-btn>
          {{$t('This material originates in digital form.')}}
          <v-divider class="my-4"></v-divider>
          <v-btn raised color="primary mr-2" :to="{ name: 'submitform', params: { cmodel: 'document', submitform: 'poster' } }">
            {{$t('Research data poster')}}
          </v-btn>
          {{$t('Research data poster')}}
          <v-divider class="my-4"></v-divider>
          <v-btn raised color="primary mr-2" :to="{ name: 'submitform', params: { cmodel: 'document', submitform: 'digitized' } }">
            {{$t('Digitized')}}
          </v-btn>
          {{$t('This material originates in analog form.')}}
        </template>
        <template v-if="$route.params.cmodel === 'picture'">
          <v-btn raised color="primary mr-2" :to="{ name: 'submitform', params: { cmodel: 'picture', submitform: 'digital' } }">
            {{$t('Born-digital')}}
          </v-btn>
          {{$t('This material originates in digital form.')}}
          <v-divider class="my-4"></v-divider>
          <v-btn raised color="primary mr-2" :to="{ name: 'submitform', params: { cmodel: 'picture', submitform: 'physicalobject' } }">
            {{$t('Physical object')}}
          </v-btn>
          {{$t('This image represents a physical object.')}}
          <v-divider class="my-4"></v-divider>
          <v-btn raised color="primary mr-2" :to="{ name: 'submitform', params: { cmodel: 'picture', submitform: 'digitized' } }">
            {{$t('Digitized')}}
          </v-btn>
          {{$t('This material originates in analog form.')}}
          <v-divider class="my-4"></v-divider>
          <v-btn raised color="primary mr-2" :to="{ name: 'submitform', params: { cmodel: 'picture', submitform: 'map' } }">
            {{$t('Map')}}
          </v-btn>
          {{$t('A digitized map')}}
        </template>
        <template v-if="$route.params.cmodel === 'audio'">
          <v-btn raised color="primary mr-2" :to="{ name: 'submitform', params: { cmodel: 'audio', submitform: 'digital' } }">
            {{$t('Born-digital')}}
          </v-btn>
          {{$t('This material originates in digital form.')}}
          <v-divider class="my-4"></v-divider>
          <v-btn raised color="primary mr-2" :to="{ name: 'submitform', params: { cmodel: 'audio', submitform: 'digitized' } }">
            {{$t('Digitized')}}
          </v-btn>
          {{$t('This material was copied from a physical carrier.')}}
        </template>
        <template v-if="$route.params.cmodel === 'video'">
          <v-btn raised color="primary mr-2" :to="{ name: 'submitform', params: { cmodel: 'video', submitform: 'digital' } }">
            {{$t('Born-digital')}}
          </v-btn>
          {{$t('This material originates in digital form.')}}
          <v-divider class="my-4"></v-divider>
          <v-btn raised color="primary mr-2" :to="{ name: 'submitform', params: { cmodel: 'video', submitform: 'digitized' } }">
            {{$t('Digitized')}}
          </v-btn>
          {{$t('This material was copied from a physical carrier.')}}
        </template>
        <template v-if="$route.params.cmodel === 'data'">
          <v-btn raised color="primary mr-2" :to="{ name: 'submitform', params: { cmodel: 'data', submitform: 'general' } }">
            {{$t('General')}}
          </v-btn>
          {{$t('Anything.')}}
          <v-divider class="my-4"></v-divider>
          <v-btn raised color="primary mr-2" :to="{ name: 'submitform', params: { cmodel: 'data', submitform: 'researchdata' } }">
            {{$t('Research data')}}
          </v-btn>
          {{$t('Research data.')}}
        </template>
        <template v-if="$route.params.cmodel === 'collection'">
          <v-btn raised color="primary mr-2" :to="{ name: 'submitform', params: { cmodel: 'collection', submitform: 'digital' } }">
            {{$t('Digital')}}
          </v-btn>
          {{$t('A born-digital ("virtual") collection.')}}
          <v-divider class="my-4"></v-divider>
          <v-btn raised color="primary mr-2" :to="{ name: 'submitform', params: { cmodel: 'collection', submitform: 'digitized' } }">
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
  name: 'submitform'
}
</script>
