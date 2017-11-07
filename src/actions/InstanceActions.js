import alt from '../alt'

import InstanceSource from '../sources/InstanceSource'
import InstanceStore from '../stores/InstanceStore'
import { wizardConfig } from '../config'

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

  searchInstances(endpointId, searchText) {
    InstanceSource.loadInstances(endpointId, searchText).then(
      instances => { this.searchInstancesSuccess(instances) },
      response => { this.searchInstancesFailed(response) },
    )
    return true
  }

  searchInstancesSuccess(instances) {
    return instances
  }

  searchInstancesFailed(response) {
    return response || true
  }

  loadNextPage(endpointId, searchText) {
    let instanceStore = InstanceStore.getState()

    if (instanceStore.cachedInstances.length > wizardConfig.instancesItemsPerPage * instanceStore.currentPage) {
      return { fromCache: true }
    }

    InstanceSource.loadInstances(
      endpointId,
      searchText,
      instanceStore.instances[instanceStore.instances.length - 1].id
    ).then(
      instances => { this.loadNextPageSuccess(instances) },
      response => { this.loadNextPageFailed(response) },
    )
    return { fromCache: false }
  }

  loadNextPageFromCache() {
    return true
  }

  loadNextPageSuccess(instances) {
    return instances
  }

  loadNextPageFailed(response) {
    return response || true
  }

  loadPreviousPage() {
    return true
  }

  reloadInstances(endpointId, searchText) {
    InstanceSource.loadInstances(endpointId, searchText).then(
      instances => { this.reloadInstancesSuccess(instances) },
      response => { this.reloadInstancesFailed(response) },
    )

    return true
  }

  reloadInstancesSuccess(instances) {
    return instances
  }

  reloadInstancesFailed(response) {
    return response || true
  }

  loadInstancesDetails(endpointId, instances) {
    instances.forEach(instance => {
      InstanceSource.loadInstanceDetails(endpointId, instance.instance_name).then(
        instance => { this.loadInstanceDetailsSuccess(instance) },
        response => { this.loadInstanceDetailsFailed(response) },
      )
    })

    return { count: instances.length }
  }

  loadInstanceDetails(endpointId, instanceName) {
    InstanceSource.loadInstanceDetails(endpointId, instanceName).then(
      instance => { this.loadInstanceDetailsSuccess(instance) },
      response => { this.loadInstanceDetailsFailed(response) },
    )

    return true
  }

  loadInstanceDetailsSuccess(instance) {
    return instance
  }

  loadInstanceDetailsFailed(response) {
    return response || true
  }
}

export default alt.createActions(InstanceActions)
