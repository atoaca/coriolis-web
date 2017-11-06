import cookie from 'js-cookie'

import Api from '../utils/ApiCaller'

import { servicesUrl, providerTypes } from '../config'
import { SchemaParser } from './Schemas'

class ProviderSource {
  static getConnectionInfoSchema(providerName) {
    return new Promise((resolve, reject) => {
      let projectId = cookie.get('projectId')

      Api.sendAjaxRequest({
        url: `${servicesUrl.coriolis}/${projectId}/providers/${providerName}/schemas/${providerTypes.CONNECTION}`,
        method: 'GET',
      }).then(response => {
        let schema = response.data.schemas.connection_info_schema
        schema = SchemaParser.connectionSchemaToFields(providerName, schema)
        resolve(schema)
      }, reject).catch(reject)
    })
  }

  static loadProviders() {
    return new Promise((resolve, reject) => {
      let projectId = cookie.get('projectId')

      Api.sendAjaxRequest({
        url: `${servicesUrl.coriolis}/${projectId}/providers`,
        method: 'GET',
      }).then(response => {
        resolve(response.data.providers)
      }, reject).catch(reject)
    })
  }

  static loadOptionsSchema(providerName, schemaType) {
    return new Promise((resolve, reject) => {
      let projectId = cookie.get('projectId')
      let schemaTypeInt = schemaType === 'migration' ? providerTypes.TARGET_MIGRATION : providerTypes.TARGET_REPLICA

      Api.sendAjaxRequest({
        url: `${servicesUrl.coriolis}/${projectId}/providers/${providerName}/schemas/${schemaTypeInt}`,
        method: 'GET',
      }).then(response => {
        let schema = response.data.schemas.destination_environment_schema
        let fields = SchemaParser.optionsSchemaToFields(providerName, schema)
        resolve(fields)
      }, reject).catch(reject)
    })
  }
}

export default ProviderSource
