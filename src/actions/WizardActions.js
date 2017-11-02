import alt from '../alt'

class WizardActions {
  updateData(data) {
    return data
  }

  clearData() {
    return true
  }

  setCurrentPage(page) {
    return page
  }
}

export default alt.createActions(WizardActions)
