import cookie from 'js-cookie'

import Api from '../utils/ApiCaller'

import { servicesUrl } from '../config'

class NetworkSource {
  static loadNetworks(enpointId, environment) {
    return new Promise((resolve, reject) => {
      let projectId = cookie.get('projectId')
      let url = `${servicesUrl.coriolis}/${projectId}/endpoints/${enpointId}/networks`
      if (environment) {
        url = `${url}?env=${btoa(JSON.stringify(environment))}`
      }

      Api.sendAjaxRequest({
        url,
        method: 'GET',
      }).then(response => {
        let networks = response.data.networks
        networks.sort((a, b) => a.name.localeCompare(b.name))
        resolve(response.data.networks)
      }, reject).catch(reject)
    })
  }
}

export default NetworkSource
