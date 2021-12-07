<template>
  <v-container>
    <v-row class="mx-4">
      <v-col cols="12" md="8" offset-md="2">
        <v-row class="my-6">
          <v-text-field
            v-model="q"
            :placeholder="$t('Search...')"
            autocomplete="off"
            append-icon="mdi-magnify"
            v-on:keyup.enter="
              $router.push(localeLocation({ path: '/search', query: { q } }))
            "
            clearable
            solo
            hide-details
          >
          </v-text-field>
        </v-row>
        <v-row class="text-subtitle-1 font-weight-light text-center my-6">
          <v-col>{{ $t("PHAIDRA_IS") }}</v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-divider></v-divider>

    <v-row>
      <v-col cols="12" lg="10">
        <v-row>
          <h3 class="title font-weight-light primary--text pa-2">
            {{ "Featured collections" }}
          </h3>
        </v-row>

        <v-row justify="center">
          <v-col cols="12" lg="4" md="6" sm="12">
            <v-card flat>
              <img
                class="mb-4"
                src="../assets/ext/open-access.jpg"
                alt="oa"
                title="By Rafabollas [CC BY-SA 4.0  (https://creativecommons.org/licenses/by-sa/4.0)], from Wikimedia Commons"
              />
              <v-card-text class="pa-0">
                <h3 class="title font-weight-light primary--text pb-2">
                  Open Access Collection
                </h3>
                <div v-if="$i18n.locale === 'deu'">
                  PHAIDRA unterstützt
                  <a
                    href="https://openaccess.univie.ac.at/ueber-open-access/oa-policy-der-uni-wien/"
                    target="_blank"
                    >die Open-Access-Policy der Universität Wien</a
                  >. Hier finden Sie frei verfügbare Texte, Bilder, Videos und
                  Audiofiles.
                </div>
                <div v-else>
                  PHAIDRA supports the
                  <a
                    href="https://openaccess.univie.ac.at/en/about-open-access/university-of-vienna-oa-policy/"
                    target="_blank"
                    >Open Access Policy of the University of Vienna</a
                  >. The Open Access Collection contains freely available texts,
                  pictures, videos and audio files.
                </div>
              </v-card-text>
              <v-card-actions class="pl-0">
                <span
                  ><a
                    color="primary"
                    text
                    href="https://phaidra.univie.ac.at/search#?collection=o:168770"
                    target="_blank"
                    >Collection</a
                  ></span
                >
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="12" lg="4" md="6" sm="12">
            <v-card flat>
              <a href="https://phaidra.univie.ac.at/o:19958"
                ><img
                  class="mb-4"
                  src="../assets/ext/incunabel.jpg"
                  alt="eod"
                  title="Gaius Plinius Secundus: Historia naturalis: libri XXXVII. [© Universitätsbibliothek Wien]"
              /></a>
              <v-card-text class="pa-0">
                <h3 class="title font-weight-light primary--text pb-2">
                  E-Books on Demand
                </h3>
                <div v-if="$i18n.locale === 'deu'">
                  In dieser Collection finden Sie die im Rahmen des Services
                  eBooks on Demand (EOD) digitalisierten Bücher der
                  Universitätsbibliothek Wien.
                </div>
                <div v-else>
                  This collection includes books digitized by the Vienna
                  University Library as part of the eBooks on Demand (EOD)
                  service.
                </div>
              </v-card-text>
              <v-card-actions class="pl-0">
                <span
                  ><a
                    color="primary"
                    text
                    href="https://phaidra.univie.ac.at/o:3523"
                    target="_blank"
                    >Collection</a
                  ></span
                >
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="12" lg="4" md="6" sm="12">
            <v-card flat>
              <img
                class="mb-4"
                src="../assets/ext/uscholar.jpg"
                title="© Universität Wien/ derknopfdruecker.com"
                alt="u:scholar"
              />
              <v-card-text class="pa-0">
                <h3 class="title font-weight-light primary--text pb-2">
                  u:scholar
                </h3>
                <div v-if="$i18n.locale === 'deu'">
                  In der u:scholar-Collection von Phaidra finden Sie weltweit
                  frei zugängliche wissenschaftliche Publikationen von
                  Forschenden der Universität Wien.
                </div>
                <div v-else>
                  The u: scholar Collection of Phaidra includes scientific
                  publications by researchers of the University of Vienna that
                  are freely accessible worldwide.
                </div>
              </v-card-text>
              <v-card-actions class="pl-0">
                <a
                  color="primary"
                  text
                  :href="
                    $i18n.locale === 'deu'
                      ? 'http://openaccess.univie.ac.at/publikationsdienste/uscholar/'
                      : 'https://openaccess.univie.ac.at/en/publication-services/uscholar/'
                  "
                  target="_blank"
                  >{{ $t("More") }}</a
                >
                <span class="px-2">|</span>
                <a
                  color="primary"
                  text
                  href="http://uscholar.univie.ac.at/"
                  target="_blank"
                  >Collection</a
                >
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" md="2" class="border-left mt-2">
        <v-row>
          <v-col cols="12">
            <v-row>
              <h3 class="title font-weight-light primary--text pa-2">
                <icon
                  width="27px"
                  height="27px"
                  name="univie-kartenkontakte"
                  class="mr-2"
                ></icon
                >{{ "Contact" }}
              </h3>
            </v-row>
            <v-divider class="my-4"></v-divider>
            <v-row class="pl-2 mb-4">
              <a href="mailto:phaidra@univie.ac.at">phaidra@univie.ac.at</a>
            </v-row>
            <v-row class="pl-2 mb-4">
              {{ $t("If you have technical problems please contact") }}:
              <a href="mailto:support.phaidra@univie.ac.at"
                >support.phaidra@univie.ac.at</a
              >
            </v-row>
            <v-row class="pl-2 mb-4">
              <a
                :href="
                  $i18n.locale === 'deu'
                    ? 'https://datamanagement.univie.ac.at/ueber-phaidra/policy-von-phaidra/'
                    : 'https://datamanagement.univie.ac.at/en/about-phaidra/policy-of-phaidra/'
                "
                target="_blank"
                >{{ $t("Policy of Phaidra") }}</a
              >
            </v-row>
            <v-row class="pl-2 mb-4">
              <router-link :to="'/terms-of-use'">{{
                $t("Terms of Use")
              }}</router-link>
            </v-row>
            <v-row class="pl-2 mb-4">
              <a href="https://datamanagement.univie.ac.at/" target="_blank">{{
                $t("Service page")
              }}</a>
            </v-row>
            <v-row class="pl-2 mb-4">
              <a
                href="https://datamanagement.univie.ac.at/ueber-phaidra/downloads-und-anleitungen/"
                target="_blank"
                >{{ $t("User guides") }}</a
              >
            </v-row>
            <v-row class="pl-2 mb-4">
              <i18n path="HOME_SANDBOX" tag="p">
                <a
                  href="https://phaidra-sandbox.univie.ac.at"
                  target="_blank"
                  >{{ $t("test instance") }}</a
                >
              </i18n>
            </v-row>
            <v-divider class="my-4"></v-divider>
            <v-row>
              <a href="https://www.facebook.com/univienna/" target="_blank"
                ><icon
                  class="mx-2"
                  width="28px"
                  height="18px"
                  name="univie-facebook"
                ></icon
              ></a>
              <a href="https://twitter.com/univienna/" target="_blank"
                ><icon
                  class="ml-2 mr-4"
                  width="28px"
                  height="18px"
                  name="univie-twitter"
                ></icon
              ></a>
              <a href="https://www.youtube.com/univienna/" target="_blank"
                ><icon
                  class="mx-2"
                  width="28px"
                  height="18px"
                  name="univie-youtube"
                ></icon
              ></a>
              <a href="https://www.instagram.com/univienna/" target="_blank"
                ><icon
                  class="mx-2"
                  width="28px"
                  height="18px"
                  name="univie-instagram"
                ></icon
              ></a>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { context } from "@/mixins/context";
import "@/compiled-icons/univie-kartenkontakte";
import "@/compiled-icons/univie-facebook";
import "@/compiled-icons/univie-youtube";
import "@/compiled-icons/univie-twitter";
import "@/compiled-icons/univie-instagram";
export default {
  mixins: [context],
  data() {
    return {
      q: "",
    };
  },
};
</script>
