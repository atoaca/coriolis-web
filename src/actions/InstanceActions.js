import alt from '../alt'

import InstanceSource from '../sources/InstanceSource'

class InstanceActions {
  loadInstances(endpointId) {
    InstanceSource.loadInstances(endpointId).then(
      instances => { this.loadInstancesSuccess(instances) },
      response => { this.loadInstancesFailed(response) },
    )
    return true
  }

  loadInstancesSuccess(instances) {
    return instances
  }

  loadInstancesFailed(response) {
    return response || true
  }
}

export default alt.createActions(InstanceActions)
