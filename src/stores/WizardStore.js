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
}

export default alt.createStore(WizardStore)
