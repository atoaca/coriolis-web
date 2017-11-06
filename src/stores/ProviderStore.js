import alt from '../alt'
import ProviderActions from '../actions/ProviderActions'

class ProviderStore {
  constructor() {
    this.connectionInfoSchema = []
    this.providers = null
    this.providersLoading = false
    this.optionsSchema = []
    this.optionsSchemaLoading = false

    this.bindListeners({
      handleGetConnectionInfoSchemaSuccess: ProviderActions.GET_CONNECTION_INFO_SCHEMA_SUCCESS,
      handleLoadProviders: ProviderActions.LOAD_PROVIDERS,
      handleLoadProvidersSuccess: ProviderActions.LOAD_PROVIDERS_SUCCESS,
      handleLoadOptionsSchema: ProviderActions.LOAD_OPTIONS_SCHEMA,
      handleLoadOptionsSchemaSuccess: ProviderActions.LOAD_OPTIONS_SCHEMA_SUCCESS,
      handleLoadOptionsSchemaFailed: ProviderActions.LOAD_OPTIONS_SCHEMA_FAILED,
    })
  }

  handleGetConnectionInfoSchemaSuccess(schema) {
    this.connectionInfoSchema = schema
  }

  handleLoadProviders() {
    this.providers = null
    this.providersLoading = true
  }

  handleLoadProvidersSuccess(providers) {
    this.providers = providers
    this.providersLoading = false
  }

  handleLoadOptionsSchema() {
    this.optionsSchemaLoading = true
  }

  handleLoadOptionsSchemaSuccess(schema) {
    this.optionsSchemaLoading = false
    this.optionsSchema = schema
  }

  handleLoadOptionsSchemaFailed() {
    this.optionsSchemaLoading = false
  }
}

export default alt.createStore(ProviderStore)
