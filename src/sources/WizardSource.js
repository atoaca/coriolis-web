import cookie from 'js-cookie'

import Api from '../utils/ApiCaller'
import NotificationActions from '../actions/NotificationActions'
import { servicesUrl, executionOptions } from '../config'

class WizardSourceUtils {
  static getDestinationEnv(data) {
    let env = {}
    let specialOptions = ['execute_now', 'separate_vm'].concat(executionOptions.map(o => o.name))

    if (data.options) {
      Object.keys(data.options).forEach(optionName => {
        if (specialOptions.find(o => o === optionName)
          || data.options[optionName] === null || data.options[optionName] === undefined) {
          return
        }
        env[optionName] = data.options[optionName]
      })
    }

    env.network_map = {}
    if (data.networks && data.networks.length) {
      data.networks.forEach(mapping => {
        env.network_map[mapping.sourceNic.network_name] = mapping.targetNetwork.name
      })
    }

    return env
  }
}

class WizardSource {
  static create(type, data) {
    return new Promise((resolve, reject) => {
      let projectId = cookie.get('projectId')

      let payload = {}
      payload[type] = {
        origin_endpoint_id: data.source.id,
        destination_endpoint_id: data.target.id,
        destination_environment: WizardSourceUtils.getDestinationEnv(data),
        instances: data.selectedInstances.map(i => i.instance_name),
        notes: '',
        security_groups: ['testgroup'],
      }

      Api.sendAjaxRequest({
        url: `${servicesUrl.coriolis}/${projectId}/${type}s`,
        method: 'POST',
        data: payload,
      }).then(response => {
        resolve(response.data[type])
      }, reject).catch(reject)
    })
  }

  static createMultiple(type, data) {
    return new Promise((resolve, reject) => {
      let items = []
      let count = 0

      data.selectedInstances.forEach(instance => {
        let newData = { ...data }
        newData.selectedInstances = [instance]
        WizardSource.create(type, newData).then(item => {
          count += 1
          items.push(item)
          if (count === data.selectedInstances.length) {
            if (items.length > 0) {
              resolve(items)
            } else {
              reject()
            }
          }
        }, () => {
          count += 1
          NotificationActions.notify(`Error while creating ${type} for instance ${instance.name}`, 'error')
        })
      })
    })
  }
}

export default WizardSource
