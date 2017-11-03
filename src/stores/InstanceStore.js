import alt from '../alt'
import InstanceActions from '../actions/InstanceActions'

import { wizardConfig } from '../config'

class InstanceStoreUtils {
  static hasNextPage(instances) {
    let result = false
    if (instances.length - 1 === wizardConfig.instancesItemsPerPage) {
      result = true
      instances.pop()
    }

    return result
  }

  static loadFromCache(cache, page) {
    let startIndex = wizardConfig.instancesItemsPerPage * (page - 1)
    let endIndex = startIndex + wizardConfig.instancesItemsPerPage
    return cache.filter((item, index) => {
      if (index >= startIndex && index < endIndex) {
        return true
      }

      return false
    })
  }
}

class InstanceStore {
  constructor() {
    this.instances = []
    this.instancesLoading = false
    this.searching = false
    this.loadingPage = false
    this.currentPage = 1
    this.hasNextPage = false
    this.cachedHasNextPage = false
    this.cachedInstances = []

    this.bindListeners({
      handleLoadInstances: InstanceActions.LOAD_INSTANCES,
      handleLoadInstancesSuccess: InstanceActions.LOAD_INSTANCES_SUCCESS,
      handleSearchInstances: InstanceActions.SEARCH_INSTANCES,
      handleSearchInstancesSuccess: InstanceActions.SEARCH_INSTANCES_SUCCESS,
      handleSearchInstancesFailed: InstanceActions.SEARCH_INSTANCES_FAILED,
      handleLoadNextPage: InstanceActions.LOAD_NEXT_PAGE,
      handleLoadNextPageSuccess: InstanceActions.LOAD_NEXT_PAGE_SUCCESS,
      handleLoadNextPageFailed: InstanceActions.LOAD_NEXT_PAGE_FAILED,
      handleLoadPreviousPage: InstanceActions.LOAD_PREVIOUS_PAGE,
    })
  }

  handleLoadInstances() {
    this.instancesLoading = true
  }

  handleLoadInstancesSuccess(instances) {
    this.currentPage = 1
    this.hasNextPage = InstanceStoreUtils.hasNextPage(instances)
    this.instances = instances
    this.cachedInstances = instances
    this.instancesLoading = false
  }

  handleSearchInstances() {
    this.searching = true
  }

  handleSearchInstancesSuccess(instances) {
    this.currentPage = 1
    this.hasNextPage = InstanceStoreUtils.hasNextPage(instances)
    this.instances = instances
    this.cachedInstances = instances
    this.searching = false
  }

  handleSearchInstancesFailed() {
    this.searching = false
  }

  handleLoadNextPage({ fromCache }) {
    if (!fromCache) {
      this.loadingPage = true
      return
    }
    this.currentPage = this.currentPage + 1
    let numCachedPages = Math.ceil(this.cachedInstances.length / wizardConfig.instancesItemsPerPage)
    if (this.currentPage === numCachedPages) {
      this.hasNextPage = this.cachedHasNextPage
    } else {
      this.hasNextPage = true
    }
    this.instances = InstanceStoreUtils.loadFromCache(this.cachedInstances, this.currentPage)
  }

  handleLoadNextPageSuccess(instances) {
    this.hasNextPage = InstanceStoreUtils.hasNextPage(instances)
    this.cachedHasNextPage = this.hasNextPage
    this.cachedInstances = [...this.cachedInstances, ...instances]
    this.instances = instances
    this.loadingPage = false
    this.currentPage = this.currentPage + 1
  }

  handleLoadNextPageFailed() {
    this.loadingPage = false
  }

  handleLoadPreviousPage() {
    this.hasNextPage = true
    this.currentPage = this.currentPage - 1
    this.instances = InstanceStoreUtils.loadFromCache(this.cachedInstances, this.currentPage)
  }
}

export default alt.createStore(InstanceStore)
