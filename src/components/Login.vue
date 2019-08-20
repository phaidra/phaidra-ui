<template>

  <v-container class="mt-5" >
    <v-row  >

      <v-col cols="4" offset="4">
        <v-form v-model="valid">
          <v-card>
            <v-card-text>
              <v-col cols="10" offset="1">
                <v-text-field
                  :label="$t('Username')"
                  v-model="credentials.username"
                  required
                  :autocomplete="'username'"
                ></v-text-field>
                <v-text-field
                  :label="$t('Password')"
                  v-model="credentials.password"
                  required
                  :append-icon="e1 ? 'visibility' : 'visibility_off'"
                  @click:append="toggleVisibility"
                  :type="e1 ? 'password' : 'text'"
                  :autocomplete="'current-password'"
                ></v-text-field>
              </v-col>
            </v-card-text>
            <v-divider class="mt-5"></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="login" color="primary" raised>{{ $t('Login') }}</v-btn>
            </v-card-actions>
          </v-card>
          </v-form>
      </v-col>

    </v-row>
  </v-container>

</template>

<script>
import { context } from '../mixins/context'

export default {
  name: 'login',
  mixins: [ context ],
  data () {
    return {
      e1: true,
      credentials: {
        username: '',
        password: ''
      },
      valid: false
    }
  },
  methods: {
    async login () {
      await this.$store.dispatch('login', this.credentials)
      this.$router.push('/')
    },
    toggleVisibility: function () {
      this.e1 = !this.e1
    }
  }
}
</script>

<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
