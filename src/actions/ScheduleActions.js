import alt from '../alt'

import ScheduleSource from '../sources/ScheduleSource'

class ScheduleActions {
  scheduleMultiple(replicaId, schedules) {
    ScheduleSource.scheduleMultiple(replicaId, schedules).then(
      s => { this.scheduleMultipleSuccess(s) },
      response => { this.scheduleMultipleFailed(response) },
    )
    return { replicaId, schedules }
  }

  scheduleMultipleSuccess(schedules) {
    return schedules
  }

  scheduleMultipleFailed(response) {
    return response || true
  }

  getSchedules(replicaId) {
    ScheduleSource.getSchedules(replicaId).then(
      schedules => { this.getSchedulesSuccess(schedules) },
      response => { this.getSchedulesFailed(response) },
    )

    return replicaId
  }

  getSchedulesSuccess(schedules) {
    return schedules
  }

  getSchedulesFailed(response) {
    return response || true
  }

  addSchedule(replicaId) {
    ScheduleSource.addSchedule(replicaId).then(
      schedule => { this.addScheduleSuccess(schedule) },
      response => { this.addScheduleFailed(response) },
    )

    return replicaId
  }

  addScheduleSuccess(schedule) {
    return schedule
  }

  addScheduleFailed(response) {
    return response || true
  }

  removeSchedule(replicaId, scheduleId) {
    ScheduleSource.removeSchedule(replicaId, scheduleId).then(
      () => { this.removeScheduleSuccess() },
      response => { this.removeScheduleFailed(response) },
    )

    return { replicaId, scheduleId }
  }

  removeScheduleSuccess() {
    return true
  }

  removeScheduleFailed(response) {
    return response || true
  }

  updateSchedule(replicaId, scheduleId, data, oldData) {
    ScheduleSource.updateSchedule(replicaId, scheduleId, data, oldData).then(
      schedule => { this.updateScheduleSuccess(schedule) },
      response => { this.updateScheduleFailed(response) },
    )

    return { replicaId, scheduleId, data }
  }

  updateScheduleSuccess(schedule) {
    return schedule
  }

  updateScheduleFailed(response) {
    return response || null
  }
}

export default alt.createActions(ScheduleActions)
