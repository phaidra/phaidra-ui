# phaidra-ui

> User interface using phaidra-api

## Prerequisities

``` bash
# install nodejs
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## Install

``` bash
# install dependencies
git clone git@github.com:phaidra/phaidra-ui.git
cd phaidra-ui
npm install
```

## Configure

/etc/phaidra/phaidra-ui.js
```js
export default {
  defaultinstance: 'myinstance.example.com',
  global: {
    title: 'phaidra-ui',
    showinstanceswitch: 0,
    enablelogin: 1,
    enabledelete: 1,
    iraccount: 'iraccount',
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
        accept: 'application/vnd.citationstyles.csl+json'
      },
      sherparomeo: {
        url: 'https://v2.sherpa.ac.uk/cgi/retrieve',
        key: 'xxx'
      },
      vocserver: {
        ns: 'https://vocab.phaidra.org/vocabulary/',
        url: 'https://vocab.phaidra.org/fuseki/',
        dataset: 'vocab'
      }
    }
  },
  instances: {
    'myinstance.example.com': {
      title: 'Phaidra - myinstance',
      baseurl: 'myinstance.example.com',
      fedora: 'https://fedora.myinstance.example.com/fedora',
      api: 'https://services.myinstance.example.com/api',
      solr: 'https://myinstance.example.com/search/solr/phaidra',
      primary: '#000',
      institution: 'My institution',
      address: 'My institution adress',
      phone: '+00-0-000-0',
      email: 'support email'
    }
  }
}
```

## Run (dev server)

```bash
# serve with hot reload at localhost:8080
npm run dev
```

## Build for production

```bash
# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```


For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
