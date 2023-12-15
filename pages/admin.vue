<template>
  <v-row class="my-6" justify="start">
    <div class="d-flex flex-row ml-6">
      <v-dialog class="pb-4" v-model="templateDialog" width="700px">
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" large dark color="grey">
            <v-icon dark class="mr-4">mdi-script</v-icon>
            {{ $t("Open template") }}
          </v-btn>
        </template>
        <v-card>
          <v-card-title dark class="title font-weight-light grey white--text">{{ $t("Open template") }}</v-card-title>
          <v-card-text>
            <p-templates class="mt-4" ref="templates" :items-per-page="5" :id-only="true" :isDefaultSelect="true"
              :selectedTemplateId="selectedTemplateId" v-on:load-template="onTemplateSelect($event)"></p-templates>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer><v-btn @click="templateDialog = false">{{ $t("Cancel") }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <div class="d-flex flex-row pt-3 ml-6">
      <span>
        {{
          $t(
            "Open a previously created upload template."
          )
        }}
      </span>
    </div>
  </v-row>
</template>
<script>

export default {
  data() {
    return {
      templateDialog: false,
      selectedTemplateId: null
    };
  },
  methods: {
    removeDefaultTemplate: async function () {
      this.onTemplateSelect("")
    },
    onTemplateSelect: async function (templateid) {
      var httpFormData = new FormData()
      httpFormData.append('settings', JSON.stringify({
        defaultTemplateId: templateid
      }))
      await this.$axios.request({
        method: 'POST',
        url: '/settings',
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-XSRF-TOKEN': this.$store.state.user.token
        },
        data: httpFormData
      })
      this.selectedTemplateId = templateid
      this.templateDialog = false;
    },
    getExistingSelectedDefaultTemplate: async function () {
      let response = await this.$axios.get("/settings", {
        headers: {
          "X-XSRF-TOKEN": this.$store.state.user.token,
        },
      });
      this.selectedTemplateId = response?.data?.settings?.defaultTemplateId
    }
  },
  mounted() {
    this.getExistingSelectedDefaultTemplate()
  },
}
</script>
