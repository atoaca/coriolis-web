import alt from '../alt'
import NetworkActions from '../actions/NetworkActions'

class NetworkStore {
  constructor() {
    this.networks = []
    this.loading = false

    this.bindListeners({
      handleLoadNetworks: NetworkActions.LOAD_NETWORKS,
      handleLoadNetworksSuccess: NetworkActions.LOAD_NETWORKS_SUCCESS,
      handleLoadNetworksFailed: NetworkActions.LOAD_NETWORKS_FAILED,
    })
  }

  handleLoadNetworks() {
    this.loading = true
  }

  handleLoadNetworksSuccess(networks) {
    this.loading = false
    this.networks = networks
  }

  handleLoadNetworksFailed() {
    this.loading = false
  }
}

export default alt.createStore(NetworkStore)
