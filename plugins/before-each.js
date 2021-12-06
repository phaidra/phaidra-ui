import config from '../config/phaidra-ui'
import qs from 'qs'
import axios from 'axios'

export default async ({app}) => {
  app.router.beforeEach(async(to, from, next) => {
    if (to.path.includes('notfound')) {
      if (/^\/o:\d+$/.test(from.fullPath)) {
        console.log('beforeeach true')
        let pid = from.fullPath
        pid = pid.replace('/', '')
        if (process.browser) {
          // on client-side, find out if we want to redirect
          let params = { q: '*:*', defType: 'edismax', wt: 'json', start: 0, rows: 1, fq: 'pid:"' + pid + '"' }
          try {
            let response = await axios.request({
              method: 'POST',
              url: config.instances[config.defaultinstance].solr + '/select',
              data: qs.stringify(params, { arrayFormat: 'repeat' }),
              headers: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              params: params
            })
            let docs = response.data.response.docs
            console.log(docs)
            if (docs.length < 1) {
              let route = app.localePath('/detail')
              app.router.push((`${route}/${pid}`))
            } else {
              let doc = docs[0]
              if (doc['cmodel']) {
                if (doc['cmodel'] === 'Book') {
                  window.location = config.instances[config.defaultinstance].fedora + '/objects/' + pid + '/methods/bdef:Book/view'
                }
              }
              if (doc['isinadminset']) {
                for (let adminset of doc['isinadminset']) {
                  if (adminset === 'phaidra:ir.univie.ac.at') {
                    window.location = 'https://' + config.instances[config.defaultinstance].irbaseurl + '/' + pid
                  }
                }
              }
              let route = app.localePath('/detail')
              app.router.push((`${route}/${pid}`))
            }
          } catch (error) {
            console.log(error)
            next()
          } finally {
            next()
          }
        } else {
          // on server-side, render object detail
          let route = app.localePath('/detail')
          app.router.push((`${route}/${pid}`))
        }
      } else {
        console.log('false')
        next()
      }
    } else {
      next()
    }
  });
}
