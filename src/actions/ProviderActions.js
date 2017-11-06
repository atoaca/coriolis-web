import alt from '../alt'

import ProviderSource from '../sources/ProviderSource'

class ProviderActions {
  getConnectionInfoSchema(providerName) {
    ProviderSource.getConnectionInfoSchema(providerName).then(
      schema => { this.getConnectionInfoSchemaSuccess(schema) },
      response => { this.getConnectionInfoSchemaFailed(response) },
    )
    return true
  }

  getConnectionInfoSchemaSuccess(schema) {
    return schema
  }

  getConnectionInfoSchemaFailed(response) {
    return response || true
  }

  loadProviders() {
    ProviderSource.loadProviders().then(
      providers => { this.loadProvidersSuccess(providers) },
      response => { this.loadProvidersFailed(response) },
    )

    return true
  }

  loadProvidersSuccess(providers) {
    return providers
  }

  loadProvidersFailed(response) {
    return response || true
  }

  loadOptionsSchema(providerName, schemaType) {
    ProviderSource.loadOptionsSchema(providerName, schemaType).then(
      schema => { this.loadOptionsSchemaSuccess(schema) },
      response => { this.loadOptionsSchemaFailed(response) },
    )
    return true
  }

  loadOptionsSchemaSuccess(schema) {
    return schema
  }

  loadOptionsSchemaFailed(response) {
    return response || true
  }
}

export default alt.createActions(ProviderActions)
