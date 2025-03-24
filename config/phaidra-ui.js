export default {
  defaultinstance: 'default',
  global: {
    title: process.env.TITLE || 'Phaidra Docker',
    showinstanceswitch: 0,
    enablelogin: 1,
    enabledelete: 1,
    suggesters: {
      geonames: 'https://ws.gbv.de/suggest/geonames/'
    },
    search: {
      selectionlimit: 100
    },
    apis: {
      doi: {
        baseurl: 'https://doi.org',
        accept: 'application/vnd.citationstyles.csl+json',
        citationstyles: 'https://citation.crosscite.org/styles/'
      },
      ror: {
        baseurl: 'https://api.ror.org'
      },
      sherparomeo: {
        url: 'https://v2.sherpa.ac.uk/romeo/api/search',
        key: 'V9cjsv6PTJE'
      },
      vocserver: {
        ns: 'https://vocab.phaidra.org/vocabulary/',
        url: 'https://vocab.phaidra.org/fuseki/',
        dataset: 'vocab'
      },
      dante: {
        search: 'https://api.dante.gbv.de/search',
        resolve: 'https://api.dante.gbv.de/data',
        limit: 50
      },
      yarm: {
        baseurl: 'https://yarm.phaidra.org'
      }
    },
    monitor: {
      sentry: {
        dsn: ''
      }
    }
  },
  instances: {
    'default': {
      title: process.env.INSTANCE_TITLE || 'Phaidra - Docker',
      institution: 'My institution',
      institutionurl: 'https://phaidra.org',
      address: 'My institution | address | here',
      phone: '+00-0-000-0',
      email: 'support email',
      since: '2023-01-01',
      // only uncomment for wildcard purposes
      // cookiedomain: '<HOST_WITH_OR_WITHOUT_PORT>',
      languages: 'eng,deu'
    }
  }
}