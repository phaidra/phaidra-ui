<template>
  <v-container>
    <v-row v-show="showtou" justify="center">
      <v-col>
        <v-card tile>
          <v-card-title class="title font-weight-light grey white--text">{{ $t('Nutzungsbedingungen') }}</v-card-title>
          <v-card-text style="max-height: 500px; white-space: pre-wrap;" class="overflow-y-auto">{{ tou }}</v-card-text>
          <v-divider class="mt-5"></v-divider>
          <v-card-actions>
            <v-checkbox v-model="touCheckbox" @click="agree" :disabled="loading" :loading="loading" color="primary" :label="$t('I agree to the terms of use.')"></v-checkbox>
            <v-spacer></v-spacer>
            <v-btn @click="login" :disabled="loading || !touAgreed" :loading="loading" color="primary" raised>{{ $t('Continue') }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-show="!showtou" class="mt-5">
      <v-col cols="4" offset="4">
        <v-form v-model="valid">
          <v-card>
            <v-card-text>
              <v-col cols="10" offset="1">
                <v-text-field
                  :disabled="loading"
                  :label="$t('Username')"
                  v-model="credentials.username"
                  required
                  filled
                  single-line
                  :autocomplete="'username'"
                ></v-text-field>
                <v-text-field
                  :disabled="loading"
                  :label="$t('Password')"
                  v-model="credentials.password"
                  required
                  filled
                  single-line
                  :append-icon="passVisibility ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="toggleVisibility"
                  :type="passVisibility ? 'password' : 'text'"
                  :autocomplete="'current-password'"
                ></v-text-field>
              </v-col>
            </v-card-text>
            <v-divider class="mt-5"></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="login" :disabled="loading" :loading="loading" color="primary" raised>{{ $t('Login') }}</v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-col>
    </v-row>
  </v-container>

</template>

<script>
import { context } from '../mixins/context'
import { config } from '../mixins/config'

export default {
  name: 'login',
  mixins: [ context, config ],
  data () {
    return {
      passVisibility: true,
      credentials: {
        username: '',
        password: ''
      },
      valid: false,
      loading: false,
      showtou: false,
      tou: '',
      touCheckbox: false,
      touAgreed: false,
      touVersion: 0
    }
  },
  methods: {
    async agree () {
      if (this.touCheckbox) {
        this.loading = true
        try {
          let response = await this.$http.post(this.instanceconfig.api + '/termsofuse/agree/' + this.touVersion, undefined,
            {
              headers: {
                'Authorization': 'Basic ' + btoa(this.credentials.username + ':' + this.credentials.password)
              }
            }
          )
          if (response.data.alerts && response.data.alerts.length > 0) {
            this.$store.commit('setAlerts', response.data.alerts)
          }
          this.touAgreed = true
        } catch (error) {
          console.log(error)
          this.$store.commit('setAlerts', [ { type: 'danger', msg: error } ])
        } finally {
          this.loading = false
        }
      }
    },
    async login () {
      this.loading = true
      try {
        let response = await this.$http.get(this.instanceconfig.api + '/termsofuse/getagreed',
          {
            headers: {
              'Authorization': 'Basic ' + btoa(this.credentials.username + ':' + this.credentials.password)
            }
          }
        )
        if (response.data.alerts && response.data.alerts.length > 0) {
          this.$store.commit('setAlerts', response.data.alerts)
        }
        if (!response.data.agreed) {
          let toures = await this.$http.get(this.instanceconfig.api + '/termsofuse')
          if (toures.data.alerts && toures.data.alerts.length > 0) {
            this.$store.commit('setAlerts', toures.data.alerts)
          }
          this.tou = toures.data.terms
          this.touVersion = toures.data.version
          this.showtou = true
          return
        } else {
          await this.$store.dispatch('login', this.credentials)
          if (this.signedin) {
            this.$router.push('/')
          }
        }
      } catch (error) {
        console.log(error)
        this.$store.commit('setAlerts', [ { type: 'danger', msg: error } ])
      } finally {
        this.loading = false
      }
    },
    toggleVisibility: function () {
      this.passVisibility = !this.passVisibility
    }
  },
  beforeRouteEnter: async function (to, from, next) {
    next(async function (vm) {
      vm.showtou = false
    })
  },
  beforeRouteUpdate: async function (to, from, next) {
    this.showtou = false
    next()
  }
}
</script>
