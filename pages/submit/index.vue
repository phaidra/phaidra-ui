<template>
  <v-container fluid>
    <v-row class="my-6" justify="start">
      <v-col cols="12">
        <span class="title font-weight-light primary--text">{{
          $t("Research data")
        }}</span>
        <v-divider></v-divider>
      </v-col>
    </v-row>
    <v-row class="my-6" justify="start">
      <v-col cols="12">
        <v-btn large class="primary" @click="$router.push(localeLocation({path: '/submit/upload'}))">
          <v-icon dark class="mr-4">mdi-plus-circle</v-icon> {{ $t("Upload") }}
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="my-6" justify="start">
      <v-col cols="12">
        <span class="title font-weight-light primary--text">{{
          $t("Publications")
        }}</span>
        <v-divider></v-divider>
      </v-col>
    </v-row>
    <v-row class="my-6" justify="start">
      <v-col cols="12">
        <v-btn
          large
          class="primary"
          :href="'https://uscholar.univie.ac.at/login'"
        >
          <v-icon dark class="mr-4">mdi-school</v-icon> {{ $t("u:scholar") }}
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="my-6" justify="start">
      <v-col cols="12">
        <span class="title font-weight-light primary--text">{{
          $t("Templates")
        }}</span>
        <v-divider></v-divider>
      </v-col>
    </v-row>
    <v-row class="my-6" justify="start">
      <v-col cols="12">
        <v-dialog class="pb-4" v-model="templateDialog" width="700px">
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" large dark color="grey" class="mr-8">
              <v-icon dark class="mr-4">mdi-script</v-icon>
              {{ $t("Choose template") }}
            </v-btn>
          </template>
          <v-card>
            <v-card-title
              dark
              class="title font-weight-light grey white--text"
              >{{ $t("Choose template") }}</v-card-title
            >
            <v-card-text>
              <p-templates
                class="mt-4"
                ref="templates"
                :items-per-page="5"
                :id-only="true"
                v-on:load-template="loadTemplate($event)"
              ></p-templates>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer
              ><v-btn @click="templateDialog = false">{{ $t("Cancel") }}</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-btn
          large
          dark
          color="grey white--text mr-8"
          :to="localePath({ path: '/submit/empty'})"
        >
          <v-icon dark class="mr-4">mdi-script-outline</v-icon>
          {{ $t("Create new template") }}
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="my-6" justify="start">
      <v-col cols="12">
        <span class="title font-weight-light primary--text">{{
          $t("Legacy (Uwmetadata)")
        }}</span>
        <v-divider></v-divider>
      </v-col>
    </v-row>
    <v-row class="my-6" justify="start">
      <v-col cols="12">
        <v-btn
          large
          dark
          color="grey white--text mr-8"
          :to="localePath({ path: '/submit/uwm/asset'})"
        >
          {{ $t("File") }}
        </v-btn>
        <v-btn
          large
          dark
          color="grey white--text mr-8"
          :to="localePath({ path: '/submit/uwm/collection'})"
        >
          {{ $t("Collection") }}
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="my-6" justify="start">
      <v-col cols="12">
        <span class="title font-weight-light primary--text">{{
          $t("Extra")
        }}</span>
        <v-divider></v-divider>
      </v-col>
    </v-row>
    <v-row class="my-6" justify="start">
      <v-col cols="12">
        <v-btn large dark color="grey white--text mr-8" :to="localePath('/submit/ksa-eda')">
          <v-icon dark class="mr-4">mdi-file-star</v-icon> {{ $t("EDA") }}
        </v-btn>
        <v-btn
          large
          dark
          color="grey white--text mr-8"
          :to="localePath('/submit/fb-psychologie')"
        >
          <v-icon dark class="mr-4">mdi-file-star</v-icon>
          {{ $t("FB Psychologie") }}
        </v-btn>
        <v-btn
          large
          dark
          color="grey white--text mr-8"
          :to="localePath('/submit/bruckneruni')"
        >
          <v-icon dark class="mr-4">mdi-file-star</v-icon>
          {{ $t("Bruckneruni") }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: "main",
    watch: {
    templateDialog (opened) {
      if (opened) {
        // this.$refs.templates.loadTemplates()
      }
    }
  },
  methods: {
    loadTemplate: async function (templateid) {
      this.$router.push(this.localeLocation({ path: `submit/custom/${templateid}`}))
      this.templateDialog = false
    }
  },
  data () {
    return {
      templateDialog: false
    }
  }
};
</script>
