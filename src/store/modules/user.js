const state = {
  username: '',
  firstname: '',
  lastname: '',
  email: '',
  token: ''
}

const actions = {
  login ({ commit, state, rootState }, credentials) {
    return new Promise((resolve, reject) => {
      commit('clearAlerts')
      commit('clearUser')

      commit('setUsername', credentials.username)

      fetch(rootState.config.api + '/signin', {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Authorization': 'Basic ' + btoa(credentials.username + ':' + credentials.password)
        }
      })
      .then(function (response) { return response.json() })
      .then(function (json) {
        if (json.alerts && json.alerts.length > 0) {
          commit('setAlerts', json.alerts)
        }
        if (json.status === 200) {
          commit('setToken', json['XSRF-TOKEN'])

          // if sign in was successful, get user's data (name, email, etc)
          fetch(rootState.config.api + '/directory/user/' + state.username + '/data', {
            method: 'GET',
            mode: 'cors',
            headers: {
              'X-XSRF-TOKEN': state.token
            }
          })
          .then(function (response) { return response.json() })
          .then(function (json) {
            if (json.alerts && json.alerts.length > 0) {
              commit('setAlerts', json.alerts)
            }
            if (json.status === 200) {
              commit('setLoginData', {
                firstname: json.user_data.firstname,
                lastname: json.user_data.lastname,
                email: json.user_data.email
              })
              resolve()
            }
          })
          .catch(function (error) {
            console.log(error)
            reject()
          })
        }
      })
      .catch(function (error) {
        console.log(error)
        reject()
      })
    })
  },
  logout ({ commit, state, rootState }) {
    return new Promise((resolve, reject) => {
      commit('clearAlerts')

      fetch(rootState.config.api + '/signout', {
        method: 'GET',
        mode: 'cors',
        headers: {
          'X-XSRF-TOKEN': state.token
        }
      })
      .then(function (response) { return response.json() })
      .then(function (json) {
        if (json.alerts && json.alerts.length > 0) {
          commit('setAlerts', json.alerts)
        }
        commit('clearUser')
        resolve()
      })
      .catch(function (error) {
        console.log(error)
        commit('clearUser')
        resolve()
      })
    })
  }
}

const mutations = {
  setLoginData (state, logindata) {
    state.firstname = logindata.firstname
    state.lastname = logindata.lastname
    state.email = logindata.email
  },
  setUsername (state, username) {
    state.username = username
  },
  clearUser (state) {
    state.username = ''
    state.firstname = ''
    state.lastname = ''
    state.email = ''
    state.token = ''
  },
  setToken (state, token) {
    state.token = token
  }
}

export default {
  state,
  actions,
  mutations
}
