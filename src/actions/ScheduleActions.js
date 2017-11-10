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
}

export default alt.createActions(ScheduleActions)
