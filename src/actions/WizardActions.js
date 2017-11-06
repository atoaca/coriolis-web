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
}

export default alt.createActions(WizardActions)
