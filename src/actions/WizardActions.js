import alt from '../alt'

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
}

export default alt.createActions(WizardActions)
