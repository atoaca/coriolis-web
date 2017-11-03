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
      instanceStore.currentPage,
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
}

export default alt.createActions(InstanceActions)
