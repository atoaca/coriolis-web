import alt from '../alt'
import WizardActions from '../actions/WizardActions'

import { wizardConfig } from '../config'

class WizardStore {
  constructor() {
    this.data = {}
    this.currentPage = wizardConfig.pages[0]
    this.createdItem = null
    this.creatingItem = false

    this.bindListeners({
      handleUpdateData: WizardActions.UPDATE_DATA,
      handleClearData: WizardActions.CLEAR_DATA,
      handleSetCurrentPage: WizardActions.SET_CURRENT_PAGE,
      handleToggleInstanceSelection: WizardActions.TOGGLE_INSTANCE_SELECTION,
      handleUpdateOptions: WizardActions.UPDATE_OPTIONS,
      handleUpdateNetworks: WizardActions.UPDATE_NETWORKS,
      handleAddSchedule: WizardActions.ADD_SCHEDULE,
      handleUpdateSchedule: WizardActions.UPDATE_SCHEDULE,
      handleRemoveSchedule: WizardActions.REMOVE_SCHEDULE,
      handleCreate: WizardActions.CREATE,
      handleCreateSuccess: WizardActions.CREATE_SUCCESS,
      handleCreateFailed: WizardActions.CREATE_FAILED,
    })
  }

  handleUpdateData(data) {
    this.data = {
      ...this.data,
      ...data,
    }
  }

  handleClearData() {
    this.data = {}
    this.currentPage = wizardConfig.pages[0]
  }

  handleSetCurrentPage(page) {
    this.currentPage = page
  }

  handleToggleInstanceSelection(instance) {
    if (!this.data.selectedInstances) {
      this.data.selectedInstances = [instance]
      return
    }

    if (this.data.selectedInstances.find(i => i.id === instance.id)) {
      this.data.selectedInstances = this.data.selectedInstances.filter(i => i.id !== instance.id)
    } else {
      this.data.selectedInstances = [...this.data.selectedInstances, instance]
    }
  }

  handleUpdateOptions({ field, value }) {
    this.data.options = {
      ...this.data.options,
    }
    this.data.options[field.name] = value
  }

  handleUpdateNetworks({ sourceNic, targetNetwork }) {
    if (!this.data.networks) {
      this.data.networks = []
    }

    this.data.networks = this.data.networks.filter(n => n.sourceNic.id !== sourceNic.id)
    this.data.networks.push({ sourceNic, targetNetwork })
  }

  handleAddSchedule() {
    if (!this.data.schedules) {
      this.data.schedules = []
    }
    this.data.schedules.push({ id: new Date().getTime() })
  }

  handleUpdateSchedule({ scheduleId, data }) {
    let schedule = this.data.schedules.find(s => s.id === scheduleId)
    if (data.schedule) {
      schedule.schedule = {
        ...schedule.schedule,
        ...data.schedule,
      }
    } else {
      schedule = {
        ...schedule,
        ...data,
      }
    }

    this.data.schedules = this.data.schedules.filter(s => s.id !== scheduleId)
    this.data.schedules.push(schedule)
    this.data.schedules.sort((a, b) => a.id > b.id)
  }

  handleRemoveSchedule(scheduleId) {
    this.data.schedules = this.data.schedules.filter(s => s.id !== scheduleId)
  }

  handleCreate() {
    this.creatingItem = true
  }

  handleCreateSuccess(item) {
    this.createdItem = item
    this.creatingItem = false
  }

  handleCreateFailed() {
    this.creatingItem = false
  }
}

export default alt.createStore(WizardStore)
