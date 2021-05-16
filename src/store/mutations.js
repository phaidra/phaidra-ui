import Vue from 'vue'

export default {
  updateBreadcrumbs (state, transition) {
    state.breadcrumbs = [
      {
        text: state.instanceconfig.institution,
        external: true,
        to: state.instanceconfig.institutionurl
      },
      {
        text: state.instanceconfig.title,
        to: '/'
      }
    ]
    if (transition.to.name === 'repostats') {
      state.breadcrumbs.push(
        {
          text: 'Repository statistics',
          to: transition.to.name,
          disabled: true
        }
      )
    }
    if (transition.to.name === 'metadatafieldshelp') {
      state.breadcrumbs.push(
        {
          text: 'Metadata fields overview',
          to: transition.to.name,
          disabled: true
        }
      )
    }
    if (transition.to.name === 'impressum') {
      state.breadcrumbs.push(
        {
          text: 'Impressum',
          to: transition.to.name,
          disabled: true
        }
      )
    }
    if (transition.to.name === 'search') {
      state.breadcrumbs.push(
        {
          text: 'Search',
          to: transition.to.name,
          disabled: true
        }
      )
    }
    if (transition.to.name === 'detail') {
      if (transition.from.name === 'search') {
        state.breadcrumbs.push(
          {
            text: 'Search',
            to: '/search'
          }
        )
      }
      state.breadcrumbs.push(
        {
          text: 'Detail ' + transition.to.params.pid,
          to: { name: transition.to.name, params: { pid: transition.to.params.pid } },
          disabled: true
        }
      )
    }
    if (transition.to.name === 'metadataeditor') {
      if (transition.from.name === 'detail') {
        state.breadcrumbs.push(
          {
            text: 'Detail ' + transition.from.params.pid,
            to: { name: transition.from.name, params: { pid: transition.from.params.pid } }
          }
        )
      }
      state.breadcrumbs.push(
        {
          text: 'Metadata editor ' + transition.to.params.pid,
          to: { name: transition.to.name, params: { pid: transition.to.params.pid } },
          disabled: true
        }
      )
    }
    if (transition.to.name === 'uwmetadataeditor') {
      if (transition.from.name === 'detail') {
        state.breadcrumbs.push(
          {
            text: 'Detail ' + transition.from.params.pid,
            to: { name: transition.from.name, params: { pid: transition.from.params.pid } }
          }
        )
      }
      state.breadcrumbs.push(
        {
          text: 'Metadata editor ' + transition.to.params.pid,
          to: { name: transition.to.name, params: { pid: transition.to.params.pid } },
          disabled: true
        }
      )
    }
    if (transition.to.name === 'metadata') {
      if (transition.from.name === 'detail') {
        state.breadcrumbs.push(
          {
            text: 'Detail ' + transition.from.params.pid,
            to: { name: transition.from.name, params: { pid: transition.from.params.pid } }
          }
        )
      }
      state.breadcrumbs.push(
        {
          text: 'Metadata ' + transition.to.params.pid,
          to: { name: transition.to.name, params: { pid: transition.to.params.pid } },
          disabled: true
        }
      )
    }
    if (transition.to.name === 'rights') {
      if (transition.from.name === 'detail') {
        state.breadcrumbs.push(
          {
            text: 'Detail ' + transition.from.params.pid,
            to: { name: transition.from.name, params: { pid: transition.from.params.pid } }
          }
        )
      }
      state.breadcrumbs.push(
        {
          text: 'Access rights ' + transition.to.params.pid,
          to: { name: transition.to.name, params: { pid: transition.to.params.pid } },
          disabled: true
        }
      )
    }
    if (transition.to.name === 'sort') {
      if (transition.from.name === 'detail') {
        state.breadcrumbs.push(
          {
            text: 'Detail ' + transition.from.params.pid,
            to: { name: transition.from.name, params: { pid: transition.from.params.pid } }
          }
        )
      }
      state.breadcrumbs.push(
        {
          text: 'Sort ' + transition.to.params.pid,
          to: { name: transition.to.name, params: { pid: transition.to.params.pid } },
          disabled: true
        }
      )
    }
    if (transition.to.name === 'relationships') {
      if (transition.from.name === 'detail') {
        state.breadcrumbs.push(
          {
            text: 'Detail ' + transition.from.params.pid,
            to: { name: transition.from.name, params: { pid: transition.from.params.pid } }
          }
        )
      }
      state.breadcrumbs.push(
        {
          text: 'Relationships of ' + transition.to.params.pid,
          to: { name: transition.to.name, params: { pid: transition.to.params.pid } },
          disabled: true
        }
      )
    }
    if (transition.to.name === 'delete') {
      if (transition.from.name === 'detail') {
        state.breadcrumbs.push(
          {
            text: 'Detail ' + transition.from.params.pid,
            to: { name: transition.from.name, params: { pid: transition.from.params.pid } }
          }
        )
      }
      state.breadcrumbs.push(
        {
          text: 'Delete of ' + transition.to.params.pid,
          to: { name: transition.to.name, params: { pid: transition.to.params.pid } },
          disabled: true
        }
      )
    }
    if (transition.to.name === 'upload-webversion') {
      if (transition.from.name === 'detail') {
        state.breadcrumbs.push(
          {
            text: 'Detail ' + transition.from.params.pid,
            to: { name: transition.from.name, params: { pid: transition.from.params.pid } }
          }
        )
      }
      state.breadcrumbs.push(
        {
          text: 'Upload web version of ' + transition.to.params.pid,
          to: { name: transition.to.name, params: { pid: transition.to.params.pid } },
          disabled: true
        }
      )
    }
    if (transition.to.name === 'submit-related') {
      if (transition.from.name === 'detail') {
        state.breadcrumbs.push(
          {
            text: 'Detail ' + transition.from.params.pid,
            to: { name: transition.from.name, params: { pid: transition.from.params.pid } }
          }
        )
      }
      state.breadcrumbs.push(
        {
          text: 'Submit of an object related to ' + transition.from.params.pid,
          to: { name: transition.to.name, params: { relatedpid: transition.to.params.relatedpid } },
          disabled: true
        }
      )
    }
    if (transition.to.name === 'stats') {
      if (transition.from.name === 'detail') {
        state.breadcrumbs.push(
          {
            text: 'Detail ' + transition.from.params.pid,
            to: { name: transition.from.name, params: { pid: transition.from.params.pid } }
          }
        )
      }
      state.breadcrumbs.push(
        {
          text: 'Usage statistics for ' + transition.from.params.pid,
          to: { name: transition.to.name, params: { pid: transition.to.params.relatedpid } },
          disabled: true
        }
      )
    }
    if (transition.to.name === 'submit') {
      state.breadcrumbs.push(
        {
          text: 'Submit',
          disabled: true
        }
      )
    }
    if (transition.to.name === 'submitresource') {
      state.breadcrumbs.push(
        {
          text: 'Submit',
          to: '/submit'
        }
      )
      state.breadcrumbs.push(
        {
          text: 'Submit ' + transition.to.params.cmodel,
          disabled: true
        }
      )
    }
    if (transition.to.name === 'submitform') {
      state.breadcrumbs.push(
        {
          text: 'Submit',
          to: '/submit'
        }
      )
      if (transition.to.params.cmodel !== 'resource') {
        state.breadcrumbs.push(
          {
            text: 'Submit ' + transition.to.params.cmodel,
            to: { name: transition.from.name, params: { cmodel: transition.from.params.cmodel } }
          }
        )
      }
      if (transition.to.params.submitform !== 'general') {
        state.breadcrumbs.push(
          {
            text: 'Submit ' + transition.to.params.cmodel + ' ' + transition.to.params.submitform,
            disabled: true
          }
        )
      } else {
        state.breadcrumbs.push(
          {
            text: 'Submit ' + transition.to.params.cmodel,
            disabled: true
          }
        )
      }
    }
    if (transition.to.name === 'submit-simple') {
      state.breadcrumbs.push(
        {
          text: 'Submit',
          to: '/submit'
        }
      )
      state.breadcrumbs.push(
        {
          text: 'Simple submit',
          disabled: true
        }
      )
    }
    if (transition.to.name === 'submit-custom') {
      state.breadcrumbs.push(
        {
          text: 'Submit',
          to: '/submit'
        }
      )
      state.breadcrumbs.push(
        {
          text: 'Submit template ' + transition.to.params.templateid,
          disabled: true
        }
      )
    }
    if (transition.to.name === 'submit-uwm') {
      state.breadcrumbs.push(
        {
          text: 'Submit',
          to: '/submit'
        }
      )
      state.breadcrumbs.push(
        {
          text: 'Legacy submit (UWMetadata)',
          disabled: true
        }
      )
    }
    if (transition.to.name === 'submit-empty') {
      state.breadcrumbs.push(
        {
          text: 'Submit',
          to: '/submit'
        }
      )
      state.breadcrumbs.push(
        {
          text: 'New template',
          disabled: true
        }
      )
    }
    if (transition.to.name === 'submit-ksa-eda') {
      state.breadcrumbs.push(
        {
          text: 'Submit',
          to: '/submit'
        }
      )
      state.breadcrumbs.push(
        {
          text: 'KSA EDA',
          disabled: true
        }
      )
    }
    if (transition.to.name === 'submit-bruckneruni') {
      state.breadcrumbs.push(
        {
          text: 'Submit',
          to: '/submit'
        }
      )
      state.breadcrumbs.push(
        {
          text: 'Bruckneruni',
          disabled: true
        }
      )
    }
  },
  setLoading (state, loading) {
    state.loading = loading
  },
  setGroups (state, groups) {
    state.groups = groups
  },
  setObjectInfo (state, objectInfo) {
    state.objectInfo = objectInfo
  },
  setObjectMembers (state, objectMembers) {
    state.objectMembers = objectMembers
  },
  switchInstance (state, instance) {
    state.instance = state.config.instances[instance]
  },
  hideSnackbar (state) {
    state.snackbar = false
  },
  setAlerts (state, alerts) {
    for (let a of alerts) {
      if (a.type === 'success') {
        state.snackbar = true
      }
    }
    state.alerts = alerts
  },
  clearAlert (state, alert) {
    state.alerts = state.alerts.filter(e => e !== alert)
  },
  setUsername (state, username) {
    Vue.set(state.user, 'username', username)
  },
  setToken (state, token) {
    Vue.set(state.user, 'token', token)
  },
  setLoginData (state, logindata) {
    Vue.set(state.user, 'username', logindata.username)
    Vue.set(state.user, 'firstname', logindata.firstname)
    Vue.set(state.user, 'lastname', logindata.lastname)
    Vue.set(state.user, 'email', logindata.email)
    Vue.set(state.user, 'org_units_l1', logindata.org_units_l1)
    Vue.set(state.user, 'org_units_l2', logindata.org_units_l2)
  },
  clearUser (state) {
    state.user = {}
  },
  clearStore (state) {
    state.alerts = []
    state.objectInfo = null
    state.objectMembers = []
    state.user = {}
    state.groups = []
    // document.cookie = 'X-XSRF-TOKEN='
  }
}
