const state = {
  username: '',
  firstname: '',
  lastname: '',
  email: '',
  token: ''
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
  },
  initStore (state) {
    state.username = ''
    state.firstname = ''
    state.lastname = ''
    state.email = ''
    state.token = ''
    document.cookie = 'X-XSRF-TOKEN='
  }
}

const actions = {
  login ({ commit, dispatch, state, rootState }, credentials) {
    return new Promise((resolve, reject) => {
      commit('initStore')
      commit('setUsername', credentials.username)
      fetch(rootState.settings.instance.api + '/signin', {
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
            document.cookie = 'X-XSRF-TOKEN=' + json['XSRF-TOKEN']
            resolve()
          }
        })
        .catch(function (error) {
          console.log(error)
          reject()
        })
    })
  },
  getUserData ({ commit, dispatch, state, rootState }) {
    return new Promise((resolve, reject) => {
      // if sign in was successful, get user's data (name, email, etc)
      fetch(rootState.settings.instance.api + '/directory/user/' + state.username + '/data', {
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
    })
  },
  logout ({ commit, dispatch, state, rootState }) {
    document.cookie = 'X-XSRF-TOKEN='
    return new Promise((resolve, reject) => {
      fetch(rootState.settings.instance.api + '/signout', {
        method: 'GET',
        mode: 'cors',
        headers: {
          'X-XSRF-TOKEN': state.token
        }
      })
        .then(function (response) { return response.json() })
        .then(function (json) {
          commit('initStore')
          if (json.alerts && json.alerts.length > 0) {
            commit('setAlerts', json.alerts)
          }
          resolve()
        })
        .catch(function (error) {
          console.log(error)
          commit('initStore')
          resolve()
        })
    })
  }
}

export default {
  state,
  mutations,
  actions
}
