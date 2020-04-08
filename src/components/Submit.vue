<template>
  <v-container>
    <v-row class="my-6" justify="start">
      <v-col cols="12">
        <v-btn large class="primary" :to="{ name: 'submit-simple' }">
          <v-icon dark class="mr-4">mdi-plus-circle</v-icon> {{ $t("Simple submit") }}
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="my-6" justify="start">
      <v-col cols="12">
        <span class="title font-weight-light primary--text">{{ $t("Custom") }}</span>
        <v-divider></v-divider>
      </v-col>
    </v-row>
    <v-row class="my-6" justify="start">
      <v-col cols="12">
        <v-dialog class="pb-4" v-model="templateDialog" width="700px">
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" large dark color="grey" class="mr-8">
              <v-icon dark class="mr-4">mdi-script</v-icon> {{ $t("Choose template") }}
            </v-btn>
            <v-btn large dark color="grey white--text mr-8" :to="{ name: 'submit-empty' }">
              <v-icon dark class="mr-4">mdi-script-outline</v-icon> {{ $t("Create new template") }}
            </v-btn>
          </template>
          <v-card>
            <v-card-title dark class="title font-weight-light grey white--text">{{ $t("Choose template") }}</v-card-title>
            <v-card-text>
              <p-templates class="mt-4" ref="templates" :items-per-page="5" :id-only="true" v-on:load-template="loadTemplate($event)"></p-templates>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer><v-btn @click="templateDialog = false">{{ $t('Cancel') }}</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
    <v-row class="my-6" justify="start">
      <v-col cols="12">
        <span class="title font-weight-light primary--text">{{ $t("Advanced") }}</span>
        <v-divider></v-divider>
      </v-col>
    </v-row>
    <v-row class="my-6">
      <v-col cols="12">
        <v-btn large dark color="grey white--text mr-8" :to="{ name: 'submitresource', params: { cmodel: 'picture' } }">
          <v-icon dark class="mr-4">mdi-image</v-icon> {{ $t("Picture") }}
        </v-btn>
        <v-btn large dark color="grey white--text mr-8" :to="{ name: 'submitresource', params: { cmodel: 'audio' } }">
          <v-icon dark class="mr-4">mdi-volume-high</v-icon> {{ $t("Audio") }}
        </v-btn>
        <v-btn large dark color="grey white--text mr-8" :to="{ name: 'submitresource', params: { cmodel: 'video' } }">
          <v-icon dark class="mr-4">mdi-video</v-icon> {{ $t("Video") }}
        </v-btn>
        <v-btn large dark color="grey white--text mr-8" :to="{ name: 'submitresource', params: { cmodel: 'data' } }">
          <v-icon dark class="mr-4">mdi-file</v-icon> {{ $t("Data") }}
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="my-6">
      <v-col cols="12">
        <v-btn large dark color="grey white--text mr-8" href="https://uscholar.univie.ac.at/">
          <v-icon dark class="mr-4">mdi-school</v-icon> {{ $t("Publications") }}
        </v-btn>
        <v-btn large dark color="grey white--text mr-8" :to="{ name: 'submitresource', params: { cmodel: 'document' } }">
          <v-icon dark class="mr-4">mdi-file-pdf</v-icon> {{ $t("Other documents") }}
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="my-6">
      <v-col cols="12">
        <v-btn large dark color="grey white--text mr-8" :to="{ name: 'submitresource', params: { cmodel: 'collection' } }">
          <v-icon dark class="mr-4">mdi-folder-open</v-icon> {{ $t("Collection") }}
        </v-btn>
        <v-btn large dark color="grey white--text mr-8" :to="{ name: 'submitform', params: { cmodel: 'resource', submitform: 'general' } }">
          <v-icon dark class="mr-4">mdi-link</v-icon> {{ $t("Resource") }}
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="my-6" justify="start">
      <v-col cols="12">
        <span class="title font-weight-light primary--text">{{ $t("Extra") }}</span>
        <v-divider></v-divider>
      </v-col>
    </v-row>
    <v-row class="my-6" justify="start">
      <v-col cols="12">
        <v-btn large dark color="grey white--text mr-8" :to="'/submit/ksa-eda'">
          <v-icon dark class="mr-4">mdi-file-star</v-icon> {{ $t("EDA") }}
        </v-btn>
        <v-btn large dark color="grey white--text mr-8" :to="{ name: 'submit-bruckneruni' }">
          <v-icon dark class="mr-4">mdi-file-star</v-icon> {{ $t("Bruckneruni") }}
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="my-6" justify="start">
      <v-col cols="12">
        <span class="title font-weight-light primary--text">{{ $t("Legacy") }}</span>
        <v-divider></v-divider>
      </v-col>
    </v-row>
    <v-row class="my-6" justify="start">
      <v-col cols="12">
        <v-btn large dark color="grey white--text" :to="{ name: 'submit-uwm' }">
          <v-icon dark class="mr-4">mdi-history</v-icon> {{ $t("Uwmetadata") }}
        </v-btn>
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
  name: 'submit',
  methods: {
    loadTemplate: async function (templateid) {
      this.$router.push({ name: 'submit-custom', params: { templateid: templateid } })
      this.templateDialog = false
    }
  },
  data () {
    return {
      templateDialog: false
    }
  }
}
</script>

<style scoped>
.v-application a {
  color: #333
}
</style>
