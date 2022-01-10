export default {
  defaultinstance: 'phaidra.univie.ac.at',
  global: {
    title: 'phaidra-ui',
    showinstanceswitch: 0,
    enablelogin: 1,
    enabledelete: 1,
    suggesters: {
      getty: 'https://ws.gbv.de/suggest/getty/',
      gnd: 'https://ws.gbv.de/suggest/gnd/',
      geonames: 'https://ws.gbv.de/suggest/geonames/'
    },
    search: {
      selectionlimit: 5000
    },
    apis: {
      doi: {
        baseurl: 'doi.org',
        accept: 'application/vnd.citationstyles.csl+json',
        citationstyles: 'https://citation.crosscite.org/styles/'
      },
      sherparomeo: {
        url: 'http://www.sherpa.ac.uk/romeo/api29.php',
        key: 'V9cjsv6PTJE'
      },
      vocserver: {
        ns: 'https://vocab.phaidra.org/vocabulary/',
        url: 'https://vocab.phaidra.org/fuseki/',
        dataset: 'vocab'
      },
      geonames: {
        search: 'https://secure.geonames.org/searchJSON',
        username: 'phaidra',
        maxRows: 50
      },
      dante: {
        search: 'https://api.dante.gbv.de/search',
        resolve: 'https://api.dante.gbv.de/data',
        limit: 50
      }
    },
    monitor: {
      sentry: {
        dsn: 'https://b5965fde216a4023b655d6188e751d22@sentry.phaidra.org/6'
      }
    }
  },
  instances: {
    'phaidra-devel.univie.ac.at': {
      title: 'Phaidra - Devel',
      baseurl: 'phaidra-devel.univie.ac.at',
      irbaseurl: 'uscholar-devel.univie.ac.at',
      fedora: 'https://fedora.phaidra-devel.univie.ac.at/fedora',
      api: 'https://services.phaidra-devel.univie.ac.at/api',
      solr: 'https://services.phaidra-devel.univie.ac.at/search/solr/phaidra_devel',
      primary: '#ab830f',
      institution: 'University of Vienna',
      institutionurl: 'https://www.univie.ac.at',
      address: 'Universität Wien | Universitätsring 1 | 1010 Wien',
      phone: '+43-1-4277-0',
      email: 'support.phaidra@univie.ac.at',
      stats: {
        trackerbaseurl: 'phaidra-stat.univie.ac.at/piwik',
        siteid: 18
      },
      ui: {
        languages: ['deu', 'eng']
      }
    },
    'phaidra-sandbox.univie.ac.at': {
      title: 'Phaidra - Sandbox',
      baseurl: 'phaidra-sandbox.univie.ac.at',
      irbaseurl: 'uscholar-sandbox.univie.ac.at',
      fedora: 'https://fedora.phaidra-sandbox.univie.ac.at/fedora',
      api: 'https://services.phaidra-sandbox.univie.ac.at/api',
      solr: 'https://app01.cc.univie.ac.at/solr/phaidra_sandbox',
      primary: '#DD4814',
      institution: 'University of Vienna',
      institutionurl: 'https://www.univie.ac.at',
      address: 'Universität Wien | Universitätsring 1 | 1010 Wien',
      phone: '+43-1-4277-0',
      email: 'support.phaidra@univie.ac.at',
      stats: {
        trackerbaseurl: 'phaidra-stat.univie.ac.at/piwik',
        siteid: 3
      },
      ui: {
        languages: ['eng', 'deu']
      }
    },
    'phaidra.univie.ac.at': {
      title: 'Phaidra',
      baseurl: 'phaidra.univie.ac.at',
      irbaseurl: 'uscholar.univie.ac.at',
      fedora: 'https://fedora.phaidra.univie.ac.at/fedora',
      api: 'https://services.phaidra.univie.ac.at/api',
      solr: 'https://app01.cc.univie.ac.at/solr/phaidra',
      primary: '#1a74b0',
      institution: 'University of Vienna',
      institutionurl: 'https://www.univie.ac.at',
      address: 'Universität Wien | Universitätsring 1 | 1010 Wien',
      phone: '+43-1-4277-0',
      email: 'support.phaidra@univie.ac.at',
      stats: {
        trackerbaseurl: 'phaidra-stat.univie.ac.at/piwik',
        siteid: 4
      },
      ui: {
        languages: ['deu', 'eng']
      }
    }
  }
}
