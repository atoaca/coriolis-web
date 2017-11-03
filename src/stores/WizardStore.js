import alt from '../alt'
import WizardActions from '../actions/WizardActions'

import { wizardConfig } from '../config'

class WizardStore {
  constructor() {
    this.data = {}
    this.currentPage = wizardConfig.pages[0]

    this.bindListeners({
      handleUpdateData: WizardActions.UPDATE_DATA,
      handleClearData: WizardActions.CLEAR_DATA,
      handleSetCurrentPage: WizardActions.SET_CURRENT_PAGE,
      handleToggleInstanceSelection: WizardActions.TOGGLE_INSTANCE_SELECTION,
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
}

export default alt.createStore(WizardStore)
