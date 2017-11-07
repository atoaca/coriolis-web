import cookie from 'js-cookie'

import Api from '../utils/ApiCaller'

import { servicesUrl, wizardConfig } from '../config'

class InstanceSource {
  static loadInstances(endpointId, searchText, lastInstanceId) {
    return new Promise((resolve, reject) => {
      let projectId = cookie.get('projectId')
      let url = `${servicesUrl.coriolis}/${projectId}/endpoints/${endpointId}/instances?limit=${wizardConfig.instancesItemsPerPage + 1}`

      if (searchText) {
        url = `${url}&name=${searchText}`
      }

      if (lastInstanceId) {
        url = `${url}&marker=${lastInstanceId}`
      }

      Api.sendAjaxRequest({
        url,
        method: 'GET',
      }).then(response => {
        resolve(response.data.instances)
      }, reject).catch(reject)
    })
  }

  static loadInstanceDetails(endpointId, instanceName) {
    return new Promise((resolve, reject) => {
      let projectId = cookie.get('projectId')

      Api.sendAjaxRequest({
        url: `${servicesUrl.coriolis}/${projectId}/endpoints/${endpointId}/instances/${btoa(instanceName)}`,
        method: 'GET',
      }).then(response => {
        resolve(response.data.instance)
      }, reject).catch(reject)
    })
  }
}

export default InstanceSource
