import alt from '../alt'
import InstanceActions from '../actions/InstanceActions'

class InstanceStore {
  constructor() {
    this.instances = []
    this.instancesLoading = false

    this.bindListeners({
      handleLoadInstances: InstanceActions.LOAD_INSTANCES,
      handleLoadInstancesSuccess: InstanceActions.LOAD_INSTANCES_SUCCESS,
    })
  }

  handleLoadInstances() {
    this.instancesLoading = true
  }

  handleLoadInstancesSuccess(instances) {
    this.instances = instances
    this.instancesLoading = false
  }
}

export default alt.createStore(InstanceStore)
