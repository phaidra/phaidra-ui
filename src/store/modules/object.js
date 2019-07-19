import qs from 'qs'

const state = {
  pid: '',
  doc: null,
  metadata: null,
  members: [],
  owner: '',
  rights: ''
}

const mutations = {
  setPid (state, pid) {
    state.pid = pid
  },
  setDoc (state, doc) {
    state.doc = doc
  },
  setMetadata (state, data) {
    state.metadata = data
  },
  setMembers (state, members) {
    for (var i = 0; i < members.length; i++) {
      members[i]['jsonld'] = {}
    }
    state.members = members
  },
  setOwner (state, owner) {
    state.owner = owner
  },
  setRights (state, rights) {
    state.rights = rights
  },
  initStore (state) {
    state.pid = ''
    state.doc = null
    state.metadata = null
    state.members = []
    state.owner = ''
    state.rights = ''
  }
}

const actions = {
  loadDetail ({ dispatch, commit, state, rootState }, pid) {
    commit('setPid', pid)

    // TODO: if this is a page, load the index from api

    var params = {
      q: 'pid:"' + pid + '"',
      defType: 'edismax',
      wt: 'json',
      qf: 'pid^5'
    }

    var query = qs.stringify(params, { encodeValuesOnly: true, indices: false })
    var url = rootState.settings.instance.solr + '/select?' + query
    var promise = fetch(url, {
      method: 'GET',
      mode: 'cors'
    })
      .then(function (response) { return response.json() })
      .then(function (json) {
        if (json.response.numFound > 0) {
          commit('setDoc', json.response.docs[0])
          dispatch('loadOwner', json.response.docs[0].owner)
          dispatch('loadRights', pid)
          dispatch('loadMembers', pid)
        } else {
          commit('setDoc', false)
        }
      })
      .catch(function (error) {
        console.log(error)
      })

    return promise
  },
  loadMembers ({ dispatch, commit, state, rootState }, pid) {
    commit('setMembers', [])

    // TODO: if this is a page, load the index from api

    var params = {
      q: 'ismemberof:"' + pid + '"',
      defType: 'edismax',
      wt: 'json',
      qf: 'ismemberof^5',
      fl: 'pid,cmodel'
    }

    var query = qs.stringify(params, { encodeValuesOnly: true, indices: false })
    var url = rootState.settings.instance.solr + '/select?' + query
    var promise = fetch(url, {
      method: 'GET',
      mode: 'cors'
    })
      .then(function (response) { return response.json() })
      .then(function (json) {
        if (json.response.numFound > 0) {
          commit('setMembers', json.response.docs)
        } else {
          commit('setMembers', [])
        }
      })
      .catch(function (error) {
        console.log(error)
      })

    return promise
  },
  loadJsonld ({ dispatch, commit, state, rootState }, pid) {
    var url = rootState.settings.instance.api + '/object/' + pid + '/metadata?mode=resolved'
    var promise = fetch(url, {
      method: 'GET',
      mode: 'cors'
    })
      .then(function (response) { return response.json() })
      .then(function (json) {
        commit('setJsonld', json.metadata['JSON-LD'])
      })
      .catch(function (error) {
        console.log(error)
      })

    return promise
  },
  loadOwner ({ commit, state, rootState }, username) {
    var url = rootState.settings.instance.api + '/directory/user/' + username + '/data'
    var promise = fetch(url, {
      method: 'GET',
      mode: 'cors'
    })
      .then(function (response) { return response.json() })
      .then(function (json) {
        commit('setOwner', json.user_data)
      })
      .catch(function (error) {
        console.log(error)
      })

    return promise
  },
  loadRights ({ commit, state, rootState }, pid) {
    var url = rootState.settings.instance.api + '/authz/check/' + pid
    // check if we have write rights
    fetch(url + '/rw/', {
      method: 'GET',
      mode: 'cors',
      headers: {
        'X-XSRF-TOKEN': rootState.user.token
      }
    })
      .then(function (response) {
        if (response.status === 200) {
          commit('setRights', 'rw')
        } else {
        // if not, check if we have read rights
          fetch(url + '/ro/', {
            method: 'GET',
            mode: 'cors',
            headers: {
              'X-XSRF-TOKEN': rootState.user.token
            }
          })
            .then(function (response) {
              if (response.status === 200) {
                commit('setRights', 'ro')
              }
            })
            .catch(function (error) {
              console.log(error)
            })
        }
      })
      .catch(function (error) {
        console.log(error)
      })
  }
}

export default {
  state,
  mutations,
  actions
}
