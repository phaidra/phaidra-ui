<template>

  <v-container mt-5>
    <v-layout row wrap>

      <v-flex xs4 offset-xs4>
        <v-card>
          <v-card-text>
            <v-flex xs10 offset-xs1>
              <v-form v-model="valid">
                <v-text-field :label="$t('Username')" v-model="credentials.username" required></v-text-field>
                <v-text-field
                  :label="$t('Password')"
                  v-model="credentials.password"
                  required
                  :append-icon="e1 ? 'visibility' : 'visibility_off'"
                  :append-icon-cb="() => (e1 = !e1)"
                  :type="e1 ? 'password' : 'text'"
                ></v-text-field>
              </v-form>
            </v-flex>
          </v-card-text>
          <v-divider class="mt-5"></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click="submit">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>

    </v-layout>
  </v-container>

</template>

<script>
export default {
  name: 'login',
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
    submit: function () {
      this.$store.dispatch('login', this.credentials).then(() => {
        this.$router.push('/')
      })
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
