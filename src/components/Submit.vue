<template>
  <v-container>
    <v-row>
      <v-col cols="2" class="mx-2">
        <v-hover v-slot:default="{ hover }">
          <router-link :to="{ name: 'submitresource', params: { cmodel: 'picture' } }">
            <v-row align="center">
              <icon name="material-image-image" :color="hover ? $vuetify.theme.themes.light.primary : 'grey'" width="48px" height="48px"></icon>
              <span class="title font-weight-light ml-2 primary--text">{{ $t("Picture") }}</span>
            </v-row>
          </router-link>
        </v-hover>
      </v-col>
      <v-col cols="2" class="mx-2">
        <v-hover v-slot:default="{ hover }">
          <router-link :to="{ name: 'submitresource', params: { cmodel: 'audio' } }">
            <v-row align="center">
              <icon name="fontello-music" :color="hover ? $vuetify.theme.themes.light.primary : 'grey'" width="48px" height="48px"></icon>
              <span class="title font-weight-light ml-2 primary--text">{{ $t("Audio") }}</span>
            </v-row>
          </router-link>
        </v-hover>
      </v-col>
      <v-col cols="2" class="mx-2">
        <v-hover v-slot:default="{ hover }">
          <router-link :to="{ name: 'submitresource', params: { cmodel: 'video' } }">
            <v-row align="center">
              <icon name="material-movie-creation" :color="hover ? $vuetify.theme.themes.light.primary : 'grey'" width="48px" height="48px"></icon>
              <span class="title font-weight-light ml-2 primary--text">{{ $t("Video") }}</span>
            </v-row>
          </router-link>
        </v-hover>
      </v-col>
      <v-col cols="2" class="mx-2">
        <v-hover v-slot:default="{ hover }">
          <router-link :to="{ name: 'submitresource', params: { cmodel: 'data' } }">
            <v-row align="center">
              <icon name="fontello-doc" :color="hover ? $vuetify.theme.themes.light.primary : 'grey'" width="48px" height="48px"></icon>
              <span class="title font-weight-light ml-2 primary--text">{{ $t("Data") }}</span>
            </v-row>
          </router-link>
        </v-hover>
      </v-col>
    </v-row>
    <v-divider class="my-4"></v-divider>
    <v-row >
      <v-col cols="2" class="mx-2">
        <v-hover v-slot:default="{ hover }">
          <router-link :to="{ name: 'submit-ir' }">
            <v-row align="center">
              <icon name="material-social-school" :color="hover ? $vuetify.theme.themes.light.primary : 'grey'" width="48px" height="48px"></icon>
              <span class="title font-weight-light ml-2 primary--text">{{ $t("Publications") }}</span>
            </v-row>
          </router-link>
        </v-hover>
      </v-col>
      <v-col cols="3" class="mx-2">
        <v-hover v-slot:default="{ hover }">
          <router-link :to="{ name: 'submitresource', params: { cmodel: 'document' } }">
            <v-row align="center">
              <icon name="fontello-doc-text" :color="hover ? $vuetify.theme.themes.light.primary : 'grey'" width="48px" height="48px"></icon>
              <span class="title font-weight-light ml-2 primary--text">{{ $t("Other documents") }}</span>
            </v-row>
          </router-link>
        </v-hover>
      </v-col>
    </v-row>
    <v-divider class="my-4"></v-divider>
    <v-row >
      <v-col cols="2" class="mx-2">
        <v-hover v-slot:default="{ hover }">
          <router-link :to="{ name: 'submitresource', params: { cmodel: 'collection' } }">
            <v-row align="center">
              <icon name="fontello-layers" :color="hover ? $vuetify.theme.themes.light.primary : 'grey'" width="48px" height="48px"></icon>
              <span class="title font-weight-light ml-2 primary--text">{{ $t("Collection") }}</span>
            </v-row>
          </router-link>
        </v-hover>
      </v-col>
      <v-col cols="2" class="mx-2">
        <v-hover v-slot:default="{ hover }">
          <router-link :to="{ name: 'submitform', params: { cmodel: 'resource', submitform: 'general' } }">
            <v-row align="center">
              <icon name="material-content-link" :color="hover ? $vuetify.theme.themes.light.primary : 'grey'" width="48px" height="48px"></icon>
              <span class="title font-weight-light ml-2 primary--text">{{ $t("Resource") }}</span>
            </v-row>
          </router-link>
        </v-hover>
      </v-col>
    </v-row>
    <v-divider class="my-4"></v-divider>
    <v-row >
      <v-col cols="2" class="mx-2">
        <v-hover v-slot:default="{ hover }">
          <router-link :to="'/submit/ksa-eda'">
            <v-row align="center">
              <v-img src="../assets/EDAlogo_k.png" max-width="50px" class="logo" alt="logo"/>
              <span class="title font-weight-light ml-2 primary--text">{{ $t("EDA") }}</span>
            </v-row>
          </router-link>
        </v-hover>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import '@/compiled-icons/fontello-music'
import '@/compiled-icons/fontello-doc'
import '@/compiled-icons/fontello-doc-text'
import '@/compiled-icons/fontello-layers'
import '@/compiled-icons/material-image-image'
import '@/compiled-icons/material-movie-creation'
import '@/compiled-icons/material-content-link'
import '@/compiled-icons/material-social-school'
import '@/compiled-icons/material-action-account-balance'
import '@/compiled-icons/material-toggle-star'

export default {
  name: 'submit'
}
</script>

<style scoped>
.v-application a {
  color: #333
}
</style>
