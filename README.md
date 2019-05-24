# phaidra-ui

> User interface components using phaidra-api

## Prerequisities

``` bash
# install nodejs
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
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
    showinstanceswitch: 1,
    enablelogin: 1
  },
  instances: {
    'myinstance.example.com': {
      baseurl: 'myinstance.example.com',
      api: 'https://services.myinstance.example.com/api',
      solr: 'https://solr.myinstance.example.com:8983/solr/myinstance',
      primary: '#000000',
      address: 'Institution | Street | City',
      phone: '+number',
      email: 'support.phaidra@example.com'
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
