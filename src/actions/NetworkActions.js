import alt from '../alt'

import NetworkSource from '../sources/NetworkSource'

class NetworkActions {
  loadNetworks(endpointId) {
    NetworkSource.loadNetworks(endpointId).then(
      networks => { this.loadNetworksSuccess(networks) },
      response => { this.loadNetworksFailed(response) }
    )

    return true
  }

  loadNetworksSuccess(networks) {
    return networks
  }

  loadNetworksFailed(response) {
    return response || true
  }
}

export default alt.createActions(NetworkActions)
