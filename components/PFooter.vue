<template>
  <v-row>
    <v-col cols="12" md="8" offset-md="2">
      <v-row class="my-5">
        <v-col cols="auto" class="text-left">
          <span class="grey--text text--darken-2"
            ><address>
              {{ instanceconfig.address }} | <abbr title="Telefon">T</abbr>
              {{ instanceconfig.phone }}
            </address></span
          >
        </v-col>
        <v-col class="text-right">
          <nuxt-link :to="localePath('impressum')">Impressum</nuxt-link> |
          <nuxt-link :to="localePath('termsofuse')">Terms of Use</nuxt-link> |
          <nuxt-link :to="localePath('repostats')">Statistics</nuxt-link>

          <!-- <router-link :to="'impressum'">Impressum</router-link> |
          <router-link :to="'termsofuse'">Terms of Use</router-link> |
          <router-link :to="'/repostats'">Statistics</router-link> -->
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { config } from "@/mixins/config";

export default {
  name: "p-footer",
  mixins: [config],
};
</script>
