import cookie from 'js-cookie'
import moment from 'moment'

import Api from '../utils/ApiCaller'
import { servicesUrl } from '../config'

class ScheduleSource {
  static scheduleSinge(replicaId, scheduleData) {
    return new Promise((resolve, reject) => {
      let projectId = cookie.get('projectId')
      let payload = {
        schedule: {},
        enabled: scheduleData.enabled === null || scheduleData.enabled === undefined ? false : scheduleData.enabled,
        shutdown_instance: scheduleData.shutdown_instances === null || scheduleData.shutdown_instances === undefined ? false : scheduleData.shutdown_instances,
      }

      if (scheduleData.expiration_date) {
        payload.expiration_date = moment(scheduleData.expiration_date).toISOString()
      }

      if (scheduleData.schedule !== null && scheduleData.schedule !== undefined) {
        Object.keys(scheduleData.schedule).forEach(prop => {
          if (scheduleData.schedule[prop] !== null && scheduleData.schedule[prop] !== undefined) {
            payload.schedule[prop] = scheduleData.schedule[prop]
          }
        })
      }

      Api.sendAjaxRequest({
        url: `${servicesUrl.coriolis}/${projectId}/replicas/${replicaId}/schedules`,
        method: 'POST',
        data: payload,
      }).then(response => {
        resolve(response.data.schedule)
      }, reject).catch(reject)
    })
  }

  static scheduleMultiple(replicaId, schedules) {
    return new Promise((resolve, reject) => {
      let createdSchedules = []
      let count = 0
      schedules.forEach(schedule => {
        ScheduleSource.scheduleSinge(replicaId, schedule).then(createdSchedule => {
          count += 1
          createdSchedules.push(createdSchedule)
          if (count === schedules.length) {
            if (createdSchedules.length > 0) {
              resolve(createdSchedules)
            } else {
              reject()
            }
          }
        }, () => { count += 1 })
      })
    })
  }
}

export default ScheduleSource
