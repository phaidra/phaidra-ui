<template>
  <v-container>
    <v-layout column>
      <v-flex>
        <p-breadcrumbs :items="breadcrumbs"></p-breadcrumbs>
      </v-flex>
      <v-flex>
        <v-layout row>
          <v-flex xs2 class="mx-2">
            <v-btn fab color="primary" :to="{ name: 'submitresource', params: { cmodel: 'picture' } }">
              <icon left dark name="material-image-image" width="36px" height="36px"></icon>
            </v-btn>
            <router-link class="display-2 submit-link ml-2" :to="{ name: 'submitresource', params: { cmodel: 'picture' } }">{{ $t("Picture") }}</router-link>
          </v-flex>
          <v-flex xs2 class="mx-2">
            <v-btn fab dark color="primary" :to="{ name: 'submitresource', params: { cmodel: 'audio' } }">
              <icon left dark name="fontello-music" width="28px" height="28px"></icon>
            </v-btn>
            <router-link class="display-2 submit-link ml-2" :to="{ name: 'submitresource', params: { cmodel: 'audio' } }">{{ $t("Audio") }}</router-link>
          </v-flex>
          <v-flex xs2 class="mx-2">
            <v-btn fab dark color="primary" :to="{ name: 'submitresource', params: { cmodel: 'video' } }">
              <icon left dark name="material-movie-creation" width="36px" height="36px"></icon>
            </v-btn>
            <router-link class="display-2 submit-link ml-2" :to="{ name: 'submitresource', params: { cmodel: 'video' } }">{{ $t("Video") }}</router-link>
          </v-flex>
          <v-flex xs3 class="mx-2">
            <v-btn fab dark color="primary" :to="{ name: 'submitresource', params: { cmodel: 'document' } }">
              <icon left dark name="fontello-doc-text" width="28px" height="28px"></icon>
            </v-btn>
            <router-link class="display-2 submit-link ml-2" :to="{ name: 'submitresource', params: { cmodel: 'document' } }">{{ $t("Document") }}</router-link>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-divider class="my-4"></v-divider>
      <v-flex>
        <v-layout row>
          <v-flex xs2 class="mx-2">
            <v-btn fab dark color="primary" :to="{ name: 'submitresource', params: { cmodel: 'resource' } }">
              <icon left dark name="material-content-link" width="36px" height="36px"></icon>
            </v-btn>
            <router-link class="display-2 submit-link ml-2" :to="{ name: 'submitresource', params: { cmodel: 'resource' } }">{{ $t("Resource") }}</router-link>
          </v-flex>
          <v-flex xs2 class="mx-2">
            <v-btn fab dark color="primary" :to="{ name: 'submitresource', params: { cmodel: 'data' } }">
              <icon left dark name="fontello-doc" width="28px" height="28px"></icon>
            </v-btn>
            <router-link class="display-2 submit-link ml-2" :to="{ name: 'submitresource', params: { cmodel: 'data' } }">{{ $t("Data") }}</router-link>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-divider class="my-4"></v-divider>
      <v-flex>
        <v-flex xs3 class="mx-2">
          <v-btn fab dark color="primary" :to="'/'">
            <icon left dark name="fontello-layers" width="36px" height="36px"></icon>
          </v-btn>
          <router-link class="display-2 submit-link ml-2" :to="'/'">{{ $t("Collection") }}</router-link>
        </v-flex>
      </v-flex>
      <v-divider class="my-4"></v-divider>
      <v-flex xs2 class="mx-2">
        <v-layout row>
          <v-flex xs 2class="mx-2">
            <v-btn fab dark color="primary" :href="'https://uscholar.univie.ac.at/submit/submitform'">
              <icon left dark name="material-social-school" width="36px" height="36px"></icon>
            </v-btn>
            <a class="display-2 submit-link ml-2" :href="'https://uscholar.univie.ac.at/submit/submitform'" target="_blank">{{ $t("u:scholar") }}</a>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-divider class="my-4"></v-divider>
      <v-flex xs2 class="mx-2">
        <v-layout row>
          <v-flex xs2><v-btn raiser dark color="primary" :to="'/submit/ksa-eda'">{{ $t("KSA EDA") }}</v-btn></v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { breadcrumbs } from '../mixins/breadcrumbs'
import '@/compiled-icons/fontello-music'
import '@/compiled-icons/fontello-doc'
import '@/compiled-icons/fontello-doc-text'
import '@/compiled-icons/fontello-layers'
import '@/compiled-icons/material-image-image'
import '@/compiled-icons/material-movie-creation'
import '@/compiled-icons/material-content-link'
import '@/compiled-icons/material-social-school'
import '@/compiled-icons/material-action-account-balance'

export default {
  name: 'submit',
  mixins: [ breadcrumbs ],
  methods: {
    updateBreadcrumbs: function () {
      this.breadcrumbs = this.getRootBreadcrumbs()
      this.breadcrumbs.push(
        {
          text: this.$t('Submit'),
          disabled: true
        }
      )
    }
  },
  mounted: function () {
    this.updateBreadcrumbs()
  }
}
</script>

<style scoped>
.submit-link {
  color: #333333;
}
</style>
