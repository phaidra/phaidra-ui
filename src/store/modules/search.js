import Vue from 'vue'
import qs from 'qs'

const state = {
  // static (only defined here)
  facetLabels: {
    datastreams: 'Access',
    resourcetype: 'Resource type',
    dc_license: 'License',
    tcreated: 'Created',
    tsize: 'Size'
  },
  resourcetypeLabels: {
    image: 'Image',
    book: 'Book',
    journalarticle: 'Journal article',
    text: 'Text',
    collection: 'Collection',
    video: 'Video',
    other: 'Other',
    dataset: 'Dataset',
    map: 'Map',
    interactiveresource: 'Resource',
    sound: 'Sound'
  },
  marcRoles: {
    'initiator': 'Initiator',
    'evaluator': 'Evaluator',
    'technicalinspector': 'Technical inspector',
    'textprocessor': 'Textprocessor',
    'pedagogicexpert': 'Pedagogic expert',
    'interpreter': 'Interpreter',
    'digitiser': 'Digitiser',
    'keeperoftheoriginal': 'Keeper of the original',
    'adviser': 'Adviser',
    'degreegrantor': 'Degree grantor',
    'uploader': 'Uploader',
    'dtc': 'Data contributor',
    // 'aut': 'Author', has a separate input box
    'pbl': 'Publisher',
    'edt': 'Editor',
    'dsr': 'Designer',
    'trl': 'Translator',
    'exp': 'Expert',
    'oth': 'Other',
    'art': 'Artist',
    'dnr': 'Donor',
    'pht': 'Photographer',
    'jud': 'Judge',
    'prf': 'Performer',
    'wde': 'Wood engraver',
    'rce': 'Recording engineer',
    'sce': 'Scenarist',
    'ths': 'Thesis advisor',
    'sds': 'Sound designer',
    'lyr': 'Lyricist',
    'ilu': 'Illuminator',
    'eng': 'Engineer',
    'cnd': 'Conductor',
    'dto': 'Dedicator',
    'opn': 'Opponent',
    'cmp': 'Composer',
    'ctg': 'Cartographer',
    'dub': 'Dubious author',
    'wam': 'Writer of accompanying material',
    'arc': 'Architect',
    'vdg': 'Videographer',
    'scl': 'Sculptor',
    'aus': 'Screenwriter',
    'own': 'Owner',
    'fmo': 'Former owner',
    'mus': 'Musician',
    'ive': 'Interviewee',
    'ill': 'Illustrator',
    'cng': 'Cinematographer',
    'dte': 'Dedicatee',
    'sad': 'Scientific advisor',
    'mte': 'Metal-engraver',
    'arr': 'Arranger',
    'etr': 'Etcher',
    'dis': 'Dissertant',
    'prt': 'Printer',
    'flm': 'Film editor',
    'rev': 'Reviewer',
    'pro': 'Producer',
    'att': 'Attributed name',
    'lbt': 'Librettist',
    'ivr': 'Interviewer',
    'egr': 'Engraver',
    'msd': 'Musical director',
    'ard': 'Artistic director',
    'chr': 'Choreographer',
    'com': 'Compiler',
    'sng': 'Singer',
    'act': 'Actor',
    'adp': 'Adapter'
  },
  // inited in initStore
  suggestions: {},
  q: '',
  docs: [],
  total: 0,
  page: 1,
  pagesize: 10,
  lang: 'en',
  searchDef: {},
  sortdef: [],
  facet_counts: null,
  facet_filter: [],
  owner: '',
  showOwnerFilter: false,
  pers_authors: [],
  showAuthorFilter: false,
  corp_authors: [],
  showRoleFilter: false,
  roles: [],
  query_input: '',
  collection: '',
  facetQueries: []
}

const getters = {
  getMarcRoleLabel: function (state, r) {
    return state.marcRoles[r] ? state.marcRoles[r] : r
  }
}

const mutations = {
  initStore (state) {
    state.suggestions = {}
    state.q = ''
    state.docs = []
    state.total = 0
    state.page = 1
    state.pagesize = 10
    state.lang = 'en'
    state.searchDef = {
      query: '',
      link: ''
    }
    state.sortdef = [
      {
        id: 'title asc',
        active: false,
        def: {
          'en': 'sort_eng_dc_title asc,sort_dc_title asc',
          'de': 'sort_deu_dc_title asc,sort_dc_title asc',
          'it': 'sort_ita_dc_title asc,sort_dc_title asc'
        }
      },
      {
        id: 'title desc',
        active: false,
        def: {
          'en': 'sort_eng_dc_title desc,sort_dc_title desc',
          'de': 'sort_deu_dc_title desc,sort_dc_title desc',
          'it': 'sort_ita_dc_title desc,sort_dc_title desc'
        }
      },
      {
        id: 'created asc',
        active: false,
        def: 'created asc'
      },
      {
        id: 'created desc',
        active: false,
        def: 'created desc'
      }
    ]
    state.facet_counts = null
    state.facet_filter = []
    state.owner = ''
    state.showOwnerFilter = false
    state.pers_authors = [
      {
        field: 'bib_roles_pers_aut',
        label: 'Author',
        values: []
      }
    ]
    state.showAuthorFilter = false
    state.corp_authors = [
      {
        field: 'bib_roles_corp_aut',
        label: 'Author',
        values: []
      }
    ]
    state.showRoleFilter = false
    state.roles = []
    state.query_input = ''
    state.collection = ''
    state.facetQueries = [
      {
        label: 'Access',
        field: 'datastreams',
        id: 'datastreams',
        exclusive: 1,
        show: 0,
        queries: [
          {
            id: 'restricted',
            query: 'datastreams:POLICY',
            label: 'Restricted'
          },
          {
            id: 'unrestricted',
            query: '-datastreams:POLICY',
            label: 'Unrestricted'
          }
        ]
      },
      {
        label: 'Type',
        field: 'resourcetype',
        id: 'resourcetype',
        show: 1,
        queries: [
          {
            id: 'image',
            query: 'resourcetype:image',
            label: 'Image'
          },
          {
            id: 'book',
            query: 'resourcetype:book',
            label: 'Book'
          },
          {
            id: 'article',
            query: 'resourcetype:journalarticle',
            label: 'Article'
          },
          {
            id: 'text',
            query: 'resourcetype:text',
            label: 'Text'
          },
          {
            id: 'collection',
            query: 'resourcetype:collection',
            label: 'Collection'
          },
          {
            id: 'video',
            query: 'resourcetype:video',
            label: 'Video'
          },
          {
            id: 'other',
            query: 'resourcetype:other',
            label: 'Data'
          },
          {
            id: 'dataset',
            query: 'resourcetype:dataset',
            label: 'Container'
          },
          {
            id: 'map',
            query: 'resourcetype:map',
            label: 'Map'
          },
          {
            id: 'resource',
            query: 'resourcetype:interactiveresource',
            label: 'Resource'
          },
          {
            id: 'sound',
            query: 'resourcetype:sound',
            label: 'Sound'
          }
        ]
      },
      {
        label: 'Size',
        field: 'tsize',
        id: 'size',
        show: 0,
        queries: [
          {
            id: 'less10',
            query: 'tsize:[0 TO 10485760]',
            label: 'less 10MB'
          },
          {
            id: '10to50',
            query: 'tsize:[10485760 TO 52428800]',
            label: '10MB - 50MB'
          },
          {
            id: '50to100',
            query: 'tsize:[52428800 TO 104857600]',
            label: '50MB - 100MB'
          },
          {
            id: '100to200',
            query: 'tsize:[104857600 TO 209715200]',
            label: '100MB - 200MB'
          },
          {
            id: '200to500',
            query: 'tsize:[209715200 TO 524288000]',
            label: '200MB - 500MB'
          },
          {
            id: '500to1000',
            query: 'tsize:[524288000 TO 1073741824]',
            label: '500MB - 1GB'
          },
          {
            id: 'more1000',
            query: 'tsize:[1073741824 TO *]',
            label: 'more 1GB'
          }
        ]
      },
      {
        label: 'License',
        field: 'dc_license',
        id: 'license',
        show: 0,
        queries: [
          {
            id: 'all-rights-reserved',
            query: 'dc_license:\'All rights reserved\'',
            label: 'All rights reserved'
          },
          {
            id: 'gplv3',
            query: 'dc_license:\'GPLv3\'',
            label: 'GPLv3'
          },
          {
            id: 'pdm',
            query: 'dc_license:\'Public Domain Mark\'',
            label: 'Public Domain Mark'
          },
          {
            id: 'cc-by',
            query: '(dc_license:\'CC BY 2.0 AT\' OR dc_license:\'CC BY 2.0 Generic\' OR dc_license:\'CC BY 3.0 AT\' OR dc_license:\'CC BY 3.0 Unported\' OR dc_license:\'CC BY 4.0 International\')',
            label: 'CC BY'
          },
          {
            id: 'cc-by-sa',
            query: '(dc_license:\'CC BY-SA 2.0 AT\' OR dc_license:\'CC BY-SA 2.0 Generic\' OR dc_license:\'CC BY-SA 3.0 AT\' OR dc_license:\'CC BY-SA 3.0 Unported\' OR dc_license:\'CC BY-SA 4.0 International\')',
            label: 'CC BY-SA'
          },
          {
            id: 'cc-by-nc',
            query: '(dc_license:\'CC BY-NC 2.0 AT\' OR dc_license:\'CC BY-NC 2.0 Generic\' OR dc_license:\'CC BY-NC 3.0 AT\' OR dc_license:\'CC BY-NC 3.0 Unported\' OR dc_license:\'CC BY-NC 4.0 International\')',
            label: 'CC BY-NC'
          },
          {
            id: 'cc-by-nd',
            query: '(dc_license:\'CC BY-ND 2.0 AT\' OR dc_license:\'CC BY-ND 2.0 Generic\' OR dc_license:\'CC BY-ND 3.0 AT\' OR dc_license:\'CC BY-ND 3.0 Unported\' OR dc_license:\'CC BY-ND 4.0 International\')',
            label: 'CC BY-ND'
          },
          {
            id: 'cc-by-nc-sa',
            query: '(dc_license:\'CC BY-NC-SA 2.0 AT\' OR dc_license:\'CC BY-NC-SA 2.0 Generic\' OR dc_license:\'CC BY-NC-SA 3.0 AT\' OR dc_license:\'CC BY-NC-SA 3.0 Unported\' OR dc_license:\'CC BY-NC-SA 4.0 International\')',
            label: 'CC BY-NC-SA'
          },
          {
            id: 'cc-by-nc-nd',
            query: '(dc_license:\'CC BY-NC-ND 2.0 AT\' OR dc_license:\'CC BY-NC-ND 2.0 Generic\' OR dc_license:\'CC BY-NC-ND 3.0 AT\' OR dc_license:\'CC BY-NC-ND 3.0 Unported\' OR dc_license:\'CC BY-NC-ND 4.0 International\')',
            label: 'CC BY-NC-ND'
          }
        ]
      }
    ]

    var months31 = [1, 3, 5, 7, 8, 10, 12]
    var months30 = [4, 6, 9, 11]
    var startYear = 2008
    var currYear = new Date().getFullYear()
    var yearsFacet = {
      label: 'Date',
      field: 'tcreated',
      id: 'created',
      show: 0,
      queries: []
    }

    for (var year = startYear; year <= currYear; year++) {
      var monthsFacet = {
        label: 'Months of ' + year,
        field: 'tcreated',
        id: 'months-' + year,
        queries: []
      }

      for (var month = 1; month <= 12; month++) {
        var daysOfMonth
        if (months30.indexOf(month) > -1) {
          daysOfMonth = 30
        } else {
          if (months31.indexOf(month) > -1) {
            daysOfMonth = 31
          } else {
            var isLeap = ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)
            if (isLeap) {
              daysOfMonth = 29
            } else {
              daysOfMonth = 28
            }
          }
        }

        var daysFacet = {
          label: 'Days of ' + month + '.' + year,
          field: 'tcreated',
          id: 'days-' + year + '-' + month,
          queries: []
        }

        for (var day = 1; day <= daysOfMonth; day++) {
          if (day < 10) {
            day = '0' + day
          }
          daysFacet.queries.push({
            query: 'tcreated:[' + year + '-' + month + '-' + day + 'T00:00:00Z TO ' + year + '-' + month + '-' + day + 'T23:59:59Z]',
            id: year + '-' + month + '-' + day,
            label: day + '.' + month + '.' + year
          })
        }

        monthsFacet.queries.push({
          query: 'tcreated:[' + year + '-' + month + '-01T00:00:00Z TO ' + year + '-' + month + '-' + daysOfMonth + 'T00:00:00Z]',
          id: year + '-' + month,
          label: month + '.' + year,
          childFacet: daysFacet
        })
      }

      yearsFacet.queries.push({
        query: 'tcreated:[' + year + '-01-01T00:00:00Z TO ' + year + '-12-31T00:00:00Z]',
        id: year,
        label: year,
        childFacet: monthsFacet
      })
    }

    state.facetQueries.push(yearsFacet)
  },
  setSearchResults (state, results) {
    state.searchResults = results
  },
  setSearchDef (state, query) {
    state.searchDef.query = query
    state.searchDef.link = location.protocol + '//' + location.host + '/#/search?' + query
  },
  setSuggestions (state, params) {
    Vue.set(state.suggestions, params.suggester, params.suggestions)
  },
  setDocs (state, docs) {
    state.docs = docs
  },
  setTotal (state, total) {
    state.total = total
  },
  setFacetCounts (state, facetCounts) {
    state.facet_counts = facetCounts
  },
  setQuery (state, query) {
    state.q = query
  },
  resetFacets (state) {
    state.facets = []
  },
  updateFacetQueries (state, facetCounts) {
    Object.keys(facetCounts.facet_queries).forEach(function (key, index) {
      for (var i = 0; i < state.facetQueries.length; i++) {
        for (var j = 0; j < state.facetQueries[i].queries.length; j++) {
          if (state.facetQueries[i].queries[j].query === key) {
            Vue.set(state.facetQueries[i].queries[j], 'count', facetCounts.facet_queries[key])
          }
          if (state.facetQueries[i].queries[j].childFacet) {
            var lvl1 = state.facetQueries[i].queries[j].childFacet
            for (var k = 0; k < lvl1.queries.length; k++) {
              if (lvl1.queries[k].query === key) {
                Vue.set(lvl1.queries[k], 'count', facetCounts.facet_queries[key])
              }
              if (lvl1.queries[k].childFacet) {
                var lvl2 = lvl1.queries[k].childFacet
                for (var l = 0; l < lvl2.queries.length; l++) {
                  if (lvl2.queries[l].query === key) {
                    Vue.set(lvl2.queries[l], 'count', facetCounts.facet_queries[key])
                  }
                }
              }
            }
          }
        }
      }
    })
  },
  toggleFacet (state, params) {
    Vue.set(params.q, 'active', !params.q.active)

    state.page = 1

    if (params.f.exclusive) {
      for (var i = 0; i < params.f.queries.length; i++) {
        if (params.f.queries[i] !== params.q) {
          Vue.set(params.f.queries[i], 'active', 0)
        }
      }
    }
  },
  showFacet (state, f) {
    Vue.set(f, 'show', !f.show)

    if (!f.show) {
      // when hiding facet, remove it's filters
      for (var i = 0; i < f.queries.length; i++) {
        f.queries[i].active = false
        if (f.childFacet) {
          var lvl1 = f.childFacet
          for (var j = 0; j < lvl1.queries.length; j++) {
            lvl1.queries[j].active = false
            if (lvl1.childFacet) {
              var lvl2 = f.childFacet
              for (var k = 0; k < lvl2.queries.length; k++) {
                lvl2.queries[k].active = false
              }
            }
          }
        }
      }
    }
  },
  setOwnerFilter (state, owner) {
    state.owner = owner
  },
  clearOwnerFilter (state) {
    state.owner = ''
  },
  setPersAuthors (state, values) {
    state.pers_authors[0].values = values
  },
  setCorpAuthors (state, values) {
    state.corp_authors[0].values = values
  },
  addRoleFilter (state, role) {
    state.roles.push(role)
  },
  removeRoleFilter (state, role) {
    state.roles.splice(state.roles.indexOf(role), 1)
  },
  setRoleFilterValues (state, role) {
    state.roles[state.roles.indexOf(role)].values = role.values
  },
  removeRoleFilterValue (state, params) {
    state.roles[state.roles.indexOf(params.role)].values.splice(state.roles[state.roles.indexOf(params.role)].values.indexOf(params.value), 1)
  },
  toggleShowOwnerFilter (state) {
    state.showOwnerFilter = !state.showOwnerFilter
  },
  toggleShowAuthorFilter (state) {
    state.showAuthorFilter = !state.showAuthorFilter
  },
  toggleShowRoleFilter (state) {
    state.showRoleFilter = !state.showRoleFilter
  },
  clearRoleFilter (state) {
    state.roles = []
  },
  setPage (state, page) {
    state.page = page
  },
  setSearchParams (state, params) {
    if (params.q) {
      state.q = params.q
    }

    if (params.page) {
      state.page = parseInt(params.page)
    }

    if (params.pagesize) {
      state.pagesize = parseInt(params.pagesize)
    }

    if (params.sortdef) {
      for (var i = 0; i < state.sortdef.length; i++) {
        if (state.sortdef[i].id === params.sortdef) {
          state.sortdef[i].active = true
        }
      }
    }

    if (params.owner) {
      state.owner = params.owner
      state.showOwnerFilter = true
    }

    if (params.collection) {
      state.collection = params.collection
    }

    if (params.fq) {
      if (typeof params.fq === 'string') {
        params.fq = [params.fq]
      }
      for (var n = 0; n < params.fq.length; n++) {
        var fqa = params.fq[n].split('_')
        var facetId = fqa[0]
        var queryId = fqa[1]
        for (var j = 0; j < state.facetQueries.length; j++) {
          if (state.facetQueries[j].id === facetId) {
            state.facetQueries[j].show = 1
            for (var k = 0; k < state.facetQueries[j].queries.length; k++) {
              if (state.facetQueries[j].queries[k].id === queryId) {
                state.facetQueries[j].queries[k].active = 1
              }
              if (state.facetQueries[j].queries[k].childFacet) {
                var lvl1 = state.facetQueries[j].queries[k].childFacet
                for (var l = 0; l < lvl1.queries.length; l++) {
                  if (lvl1.queries[l].id === queryId) {
                    lvl1.queries[l].active = 1
                    state.facetQueries[j].queries[k].active = 1
                  }
                  if (lvl1.queries[l].childFacet) {
                    var lvl2 = lvl1.queries[l].childFacet
                    for (var m = 0; m < lvl2.queries.length; m++) {
                      if (lvl2.queries[m].id === queryId) {
                        lvl2.queries[m].active = 1
                        lvl1.queries[l].active = 1
                        state.facetQueries[j].queries[k].active = 1
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    if (params.fr) {
      if (typeof params.fr === 'string') {
        params.fr = [params.fr]
      }
      var roles = {}
      for (var o = 0; o < params.fr.length; o++) {
        var idx = params.fr[o].lastIndexOf('_')
        var role = params.fr[o].substring(0, idx)
        var value = params.fr[o].substring(idx + 1)

        if (roles[role]) {
          roles[role].values.push(value)
        } else {
          roles[role] = { values: [value] }
        }
      }

      Object.keys(roles).forEach(function (role) {
        var label = state.marcRoles[role]
        if (role === 'bib_roles_pers_aut') {
          state.pers_authors[0].values = roles[role].values
          state.showAuthorFilter = true
        } else {
          if (role === 'bib_roles_corp_aut') {
            state.corp_authors[0].values = roles[role].values
            state.showAuthorFilter = true
          } else {
            state.roles.push({
              field: role,
              label: label,
              values: roles[role].values,
              type: role.includes('_pers_') ? 'pers' : 'corp'
            })
            state.showRolesFilter = true
          }
        }
      })
    }
  },
  setSort (state, sort) {
    for (var i = 0; i < state.sortdef.length; i++) {
      if (state.sortdef[i].id === sort) {
        state.sortdef[i].active = !state.sortdef[i].active
      } else {
        state.sortdef[i].active = false
      }
    }
  },
  setCollection (state, collection) {
    state.collection = collection
  }
}

const actions = {
  setCollection ({ dispatch, commit }, collection) {
    commit('setCollection', collection)
    dispatch('search')
  },
  toggleAuthorFilter ({ dispatch, commit, state }) {
    commit('toggleShowAuthorFilter')
    if (!state.showAuthorFilter) {
      dispatch('clearAuthorFilter')
    }
  },
  toggleRoleFilter ({ dispatch, commit, state }) {
    commit('toggleShowRoleFilter')
    if (!state.showRoleFilter) {
      dispatch('clearRoleFilter')
    }
  },
  toggleOwnerFilter ({ dispatch, commit, state }) {
    commit('toggleShowOwnerFilter')
    if (!state.showOwnerFilter) {
      dispatch('clearOwnerFilter')
    }
  },
  setSort ({ dispatch, commit }, sort) {
    commit('setSort', sort)
    dispatch('search')
  },
  setPage ({ dispatch, commit }, page) {
    commit('setPage', page)
    dispatch('search')
  },
  setRoleFilterValues ({ dispatch, commit }, params) {
    commit('setRoleFilterValues', params)
    dispatch('search')
  },
  removeRoleFilterValue ({ dispatch, commit }, params) {
    commit('removeRoleFilterValue', params)
    dispatch('search')
  },
  addRoleFilter ({ dispatch, commit }, role) {
    commit('addRoleFilter', role)
    dispatch('search')
  },
  removeRoleFilter ({ dispatch, commit }, role) {
    commit('removeRoleFilter', role)
    dispatch('search')
  },
  clearRoleFilter ({ dispatch, commit }) {
    commit('clearRoleFilter')
    dispatch('search')
  },
  setPersAuthors ({ dispatch, commit }, values) {
    commit('setPersAuthors', values)
    dispatch('search')
  },
  setCorpAuthors ({ dispatch, commit }, values) {
    commit('setCorpAuthors', values)
    dispatch('search')
  },
  clearAuthorFilter ({ dispatch, commit }) {
    commit('setPersAuthors', [])
    commit('setCorpAuthors', [])
    dispatch('search')
  },
  setOwnerFilter ({ dispatch, commit }, owner) {
    commit('setOwnerFilter', owner)
    dispatch('search')
  },
  clearOwnerFilter ({ dispatch, commit }) {
    commit('clearOwnerFilter')
    dispatch('search')
  },
  showFacet ({ dispatch, commit, state }, f) {
    commit('showFacet', f)
    dispatch('search')
  },
  toggleFacet ({ dispatch, commit, state }, params) {
    commit('toggleFacet', params)
    dispatch('search')
  },
  search ({ commit, state, rootState }) {
    var i, j, k, l, field, v
    var start = (state.page - 1) * state.pagesize
    var params = {
      q: state.q,
      defType: 'edismax',
      wt: 'json',
      qf: 'pid^5 dc_title^4 dc_creator^3 dc_subject^2 _text_',
      start: start,
      rows: state.pagesize,
      sort: '',
      facet: true,
      'facet.query': []
    }

    if (state.q === '' || state.q === null) {
      params.q = '*:*'
      params.sort = 'created desc'
    }

    var searchdefarr = []

    for (i = 0; i < state.sortdef.length; i++) {
      if (state.sortdef[i].active) {
        if ((state.sortdef[i].id === 'title asc') || (state.sortdef[i].id === 'title desc')) {
          params.sort = state.sortdef[i].def[state.lang]
        } else {
          params.sort = state.sortdef[i].def
        }
        searchdefarr.push('sortdef=' + window.encodeURIComponent(state.sortdef[i].id))
      }
    }

    if (state.q) {
      searchdefarr.push('q=' + window.encodeURIComponent(state.q))
    }
    searchdefarr.push('page=' + state.page)
    if (state.pagesize) {
      searchdefarr.push('pagesize=' + state.pagesize)
    }

    for (i = 0; i < state.facetQueries.length; i++) {
      if (state.facetQueries[i].show) {
        for (j = 0; j < state.facetQueries[i].queries.length; j++) {
          // exclude '{!ex=' + state.facetQueries[i].id + '}' +
          if (state.facetQueries[i].queries[j].active && state.facetQueries[i].queries[j].childFacet) {
            var childFacetLvl1 = state.facetQueries[i].queries[j].childFacet
            for (k = 0; k < childFacetLvl1.queries.length; k++) {
              if (childFacetLvl1.queries[k].active && childFacetLvl1.queries[k].childFacet) {
                var childFacetLvl2 = childFacetLvl1.queries[k].childFacet
                for (l = 0; l < childFacetLvl2.queries.length; l++) {
                  // days
                  params['facet.query'].push(childFacetLvl2.queries[l].query)
                }
              }
              // months
              params['facet.query'].push(childFacetLvl1.queries[k].query)
            }
          }

          params['facet.query'].push(state.facetQueries[i].queries[j].query)
        }
      }
    }

    var ands = []
    for (i = 0; i < state.facetQueries.length; i++) {
      var ors = []
      for (j = 0; j < state.facetQueries[i].queries.length; j++) {
        if (state.facetQueries[i].queries[j].active) {
          // tag '{!tag=' + state.facetQueries[i].id + '}' +
          if (state.facetQueries[i].queries[j].childFacet) {
            // there are two levels, only take the lowest active levels
            var lvl1 = state.facetQueries[i].queries[j].childFacet
            var foundActiveLvl1Query = false
            for (k = 0; k < lvl1.queries.length; k++) {
              if (lvl1.queries[k].active) {
                foundActiveLvl1Query = true

                var lvl2 = lvl1.queries[k].childFacet
                var foundActiveLvl2Query = false
                for (l = 0; l < lvl2.queries.length; l++) {
                  if (lvl2.queries[l].active) {
                    foundActiveLvl2Query = true
                    ors.push(lvl2.queries[l].query)
                    searchdefarr.push('fq=' + state.facetQueries[i].id + '_' + lvl2.queries[l].id)
                  }
                }

                if (!foundActiveLvl2Query) {
                  ors.push(lvl1.queries[k].query)
                  searchdefarr.push('fq=' + state.facetQueries[i].id + '_' + lvl1.queries[k].id)
                }
              }
            }

            if (!foundActiveLvl1Query) {
              ors.push(state.facetQueries[i].queries[j].query)
              searchdefarr.push('fq=' + state.facetQueries[i].id + '_' + state.facetQueries[i].queries[j].id)
            }
          } else {
            ors.push(state.facetQueries[i].queries[j].query)
            searchdefarr.push('fq=' + state.facetQueries[i].id + '_' + state.facetQueries[i].queries[j].id)
          }
        }
      }
      if (ors.length > 0) {
        if (ors.length > 1) {
          ands.push('(' + ors.join(' OR ') + ')')
        } else {
          ands.push(ors[0])
        }
      }
    }

    for (i = 0; i < state.corp_authors.length; i++) {
      field = state.corp_authors[i]
      for (j = 0; j < field.values.length; j++) {
        v = field.values[j]
        if (v !== '') {
          ands.push('(' + field.field + ':"' + v + '")')
          searchdefarr.push('fr=' + field.field + '_' + window.encodeURIComponent(v))
        }
      }
    }

    for (i = 0; i < state.pers_authors.length; i++) {
      field = state.pers_authors[i]
      for (j = 0; j < field.values.length; j++) {
        v = field.values[j]
        if (v !== '') {
          ands.push('(' + field.field + ':"' + v + '")')
          searchdefarr.push('fr=' + field.field + '_' + window.encodeURIComponent(v))
        }
      }
    }

    for (i = 0; i < state.roles.length; i++) {
      field = state.roles[i]
      for (j = 0; j < field.values.length; j++) {
        v = field.values[j]
        if (v !== '') {
          ands.push('(' + field.field + ':"' + v + '")')
          searchdefarr.push('fr=' + field.field + '_' + window.encodeURIComponent(v))
        }
      }
    }

    if (state.owner) {
      ands.push('owner:"' + state.owner + '"')
      searchdefarr.push('owner=' + state.owner)
    } else {
      // an object should have at least an owner, else it's garbage
      ands.push('owner:*')
    }

    if (state.collection) {
      ands.push('ispartof:"' + state.collection + '"')
      searchdefarr.push('collection=' + state.collection)
    }

    commit('setSearchDef', searchdefarr.join('&'))

    if (ands.length > 0) {
      params['fq'] = ands.join(' AND ')
    }

    var query = qs.stringify(params, { encodeValuesOnly: true, indices: false })
    var url = rootState.settings.instance.solr + '/select?' + query
    var promise = fetch(url, {
      method: 'GET',
      mode: 'cors'
    })
    .then(function (response) { return response.json() })
    .then(function (json) {
      commit('setDocs', json.response.docs)
      commit('setTotal', json.response.numFound)
      commit('setFacetCounts', json.facet_counts)
      commit('updateFacetQueries', json.facet_counts)
      commit('resetFacets')
    })
    .catch(function (error) {
      console.log(error)
    })

    return promise
  },
  suggest ({ commit, state, rootState }, inputdata) {
    return new Promise((resolve, reject) => {
      var params = {
        suggest: true,
        'suggest.dictionary': inputdata.suggester,
        wt: 'json',
        'suggest.q': inputdata.value
      }

      var query = qs.stringify(params)

      fetch(rootState.settings.instance.solr + '/suggest?' + query, {
        method: 'GET',
        mode: 'cors'
      })
      .then(function (response) { return response.json() })
      .then(function (json) {
        commit('setSuggestions', { suggester: inputdata.suggester, suggestions: json.suggest[inputdata.suggester][inputdata.value].suggestions })
        resolve()
      })
      .catch(function (error) {
        console.log(error)
        reject()
      })
    })
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
