import alt from '../alt'
import ScheduleActions from '../actions/ScheduleActions'

class ScheduleStore {
  constructor() {
    this.loading = false
    this.schedules = []
    this.scheduling = false
    this.adding = false

    this.bindListeners({
      handleScheduleMultiple: ScheduleActions.SCHEDULE_MULTIPLE,
      handleScheduleMultipleSuccess: ScheduleActions.SCHEDULE_MULTIPLE_SUCCESS,
      handleScheduleMultipleFailed: ScheduleActions.SCHEDULE_MULTIPLE_FAILED,
      handleGetSchedules: ScheduleActions.GET_SCHEDULES,
      handleGetSchedulesSuccess: ScheduleActions.GET_SCHEDULES_SUCCESS,
      handleGetSchedulesFailed: ScheduleActions.GET_SCHEDULES_FAILED,
      handleAddSchedule: ScheduleActions.ADD_SCHEDULE,
      handleAddScheduleSuccess: ScheduleActions.ADD_SCHEDULE_SUCCESS,
      handleAddScheduleFailed: ScheduleActions.ADD_SCHEDULE_FAILED,
      handleRemoveSchedule: ScheduleActions.REMOVE_SCHEDULE,
      handleUpdateSchedule: ScheduleActions.UPDATE_SCHEDULE,
      handleUpdateScheduleSuccess: ScheduleActions.UPDATE_SCHEDULE_SUCCESS,
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

  handleGetSchedules() {
    this.loading = true
  }

  handleGetSchedulesSuccess(schedules) {
    this.loading = false
    this.schedules = schedules
  }

  handleGetSchedulesFailed() {
    this.loading = false
  }

  handleAddSchedule() {
    this.adding = true
  }

  handleAddScheduleSuccess(schedule) {
    this.adding = false
    this.schedules = [...this.schedules, schedule]
  }

  handleAddScheduleFailed() {
    this.adding = false
  }

  handleRemoveSchedule({ scheduleId }) {
    this.schedules = this.schedules.filter(s => s.id !== scheduleId)
  }

  handleUpdateSchedule({ scheduleId, data }) {
    this.schedules = this.schedules.map(schedule => {
      if (schedule.id === scheduleId) {
        let newSchedule = { ...schedule }
        if (data.schedule !== null && data.schedule !== undefined && Object.keys(data.schedule).length) {
          newSchedule.schedule = { ...schedule.schedule, ...data.schedule || {} }
        }
        return newSchedule
      }

      return { ...schedule }
    })
  }

  handleUpdateScheduleSuccess(schedule) {
    this.schedules = this.schedules.map(s => {
      if (s.id === schedule.id) {
        return { ...schedule }
      }

      return { ...s }
    })
  }
}

export default alt.createStore(ScheduleStore)
