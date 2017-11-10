import alt from '../alt'
import ScheduleActions from '../actions/ScheduleActions'

class ScheduleStore {
  constructor() {
    this.scheduling = false

    this.bindListeners({
      handleScheduleMultiple: ScheduleActions.SCHEDULE_MULTIPLE,
      handleScheduleMultipleSuccess: ScheduleActions.SCHEDULE_MULTIPLE_SUCCESS,
      handleScheduleMultipleFailed: ScheduleActions.SCHEDULE_MULTIPLE_FAILED,
    })
  }

  handleScheduleMultiple() {
    this.scheduling = true
  }

  handleScheduleMultipleSuccess() {
    this.scheduling = false
  }

  handleScheduleMultipleFailed() {
    this.scheduling = false
  }
}

export default alt.createStore(ScheduleStore)
