import alt from '../alt'

import WizardSource from '../sources/WizardSource'

class WizardActions {
  updateData(data) {
    return data
  }

  toggleInstanceSelection(instance) {
    return instance
  }

  clearData() {
    return true
  }

  setCurrentPage(page) {
    return page
  }

  updateOptions({ field, value }) {
    return { field, value }
  }

  updateNetworks({ sourceNic, targetNetwork }) {
    return { sourceNic, targetNetwork }
  }

  addSchedule() {
    return true
  }

  updateSchedule(scheduleId, data) {
    return { scheduleId, data }
  }

  removeSchedule(scheduleId) {
    return scheduleId
  }

  create(type, data) {
    WizardSource.create(type, data).then(
      item => { this.createSuccess(item) },
      response => { this.createFailed(response) }
    )

    return { type, data }
  }

  createSuccess(item) {
    return item
  }

  createFailed(reponse) {
    return reponse || true
  }

  createMultiple(type, data) {
    WizardSource.createMultiple(type, data).then(
      items => { this.createMultipleSuccess(items) },
      response => { this.createMultipleFailed(response) }
    )

    return { type, data }
  }

  createMultipleSuccess(items) {
    return items
  }

  createMultipleFailed(response) {
    return response || true
  }
}

export default alt.createActions(WizardActions)
