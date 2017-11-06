import cookie from 'js-cookie'

import Api from '../utils/ApiCaller'

import { servicesUrl } from '../config'

class NetworkSource {
  static loadNetworks(enpointId) {
    return new Promise((resolve, reject) => {
      let projectId = cookie.get('projectId')

      Api.sendAjaxRequest({
        url: `${servicesUrl.coriolis}/${projectId}/endpoints/${enpointId}/networks`,
        method: 'GET',
      }).then(response => {
        resolve(response.data.networks)
      }, reject).catch(reject)
    })
  }
}

export default NetworkSource
