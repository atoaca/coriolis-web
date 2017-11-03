import cookie from 'js-cookie'

import Api from '../utils/ApiCaller'

import { servicesUrl, wizardConfig } from '../config'

class InstanceSource {
  static loadInstances(endpointId) {
    return new Promise((resolve, reject) => {
      let projectId = cookie.get('projectId')

      Api.sendAjaxRequest({
        url: `${servicesUrl.coriolis}/${projectId}/endpoints/${endpointId}/instances?limit=${wizardConfig.instancesItemsPerPage}`,
        method: 'GET',
      }).then(response => {
        resolve(response.data.instances)
      }, reject).catch(reject)
    })
  }
}

export default InstanceSource
