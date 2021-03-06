/*
Copyright (C) 2017  Cloudbase Solutions SRL
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.
You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

// @flow

import cookie from 'js-cookie'
import moment from 'moment'

import Api from '../utils/ApiCaller'
import { servicesUrl } from '../config'
import DateUtils from '../utils/DateUtils'
import type { Schedule } from '../types/Schedule'

class ScheduleSource {
  static scheduleSinge(replicaId: string, scheduleData: Schedule): Promise<Schedule> {
    return new Promise((resolve, reject) => {
      let projectId = cookie.get('projectId')
      let payload = {
        schedule: {},
        expiration_date: null,
        enabled: scheduleData.enabled === null || scheduleData.enabled === undefined ? false : scheduleData.enabled,
        shutdown_instance: scheduleData.shutdown_instances === null || scheduleData.shutdown_instances === undefined ? false : scheduleData.shutdown_instances,
      }

      if (scheduleData.expiration_date) {
        // $FlowIssue
        payload.expiration_date = moment(scheduleData.expiration_date).toISOString()
      }

      if (scheduleData.schedule !== null && scheduleData.schedule !== undefined) {
        Object.keys(scheduleData.schedule).forEach(prop => {
          // $FlowIssue
          if (scheduleData.schedule[prop] !== null && scheduleData.schedule[prop] !== undefined) {
            payload.schedule[prop] = scheduleData.schedule[prop]
          }
        })
      }

      Api.send({
        url: `${servicesUrl.coriolis}/${projectId || 'null'}/replicas/${replicaId}/schedules`,
        method: 'POST',
        data: payload,
      }).then(response => {
        resolve(response.data.schedule)
      }).catch(reject)
    })
  }

  static scheduleMultiple(replicaId: string, schedules: Schedule[]): Promise<Schedule[]> {
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

  static getSchedules(replicaId: string): Promise<Schedule[]> {
    return new Promise((resolve, reject) => {
      let projectId = cookie.get('projectId')

      Api.get(`${servicesUrl.coriolis}/${projectId || 'null'}/replicas/${replicaId}/schedules`).then(response => {
        let schedules = [...response.data.schedules]

        schedules.forEach(s => {
          if (s.expiration_date) {
            s.expiration_date = DateUtils.getLocalTime(s.expiration_date)
          }

          if (s.shutdown_instance) {
            s.shutdown_instances = s.shutdown_instance
          }
        })
        schedules.sort((a, b) => moment(a.created_at).diff(b.created_at))
        resolve(schedules)
      }).catch(reject)
    })
  }

  static addSchedule(replicaId: string, schedule: Schedule): Promise<Schedule> {
    return new Promise((resolve, reject) => {
      let projectId = cookie.get('projectId')
      let payload = {
        schedule: { hour: 0, minute: 0 },
        enabled: false,
      }
      if (schedule && schedule.schedule) {
        payload.schedule = { ...schedule.schedule }
      }

      Api.send({
        url: `${servicesUrl.coriolis}/${projectId || 'null'}/replicas/${replicaId}/schedules`,
        method: 'POST',
        data: payload,
      }).then(response => {
        resolve(response.data.schedule)
      }).catch(reject)
    })
  }

  static removeSchedule(replicaId: string, scheduleId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      let projectId = cookie.get('projectId')
      Api.send({
        url: `${servicesUrl.coriolis}/${projectId || 'null'}/replicas/${replicaId}/schedules/${scheduleId}`,
        method: 'DELETE',
      }).then(() => { resolve() }).catch(reject)
    })
  }

  static updateSchedule(
    replicaId: string,
    scheduleId: string,
    scheduleData: Schedule,
    scheduleOldData: ?Schedule,
    unsavedData: ?Schedule
  ): Promise<Schedule> {
    return new Promise((resolve, reject) => {
      let projectId = cookie.get('projectId')
      let payload = {}
      if (scheduleData.enabled !== null && scheduleData.enabled !== undefined) {
        payload.enabled = scheduleData.enabled
      }
      if (scheduleData.shutdown_instances !== null && scheduleData.shutdown_instances !== undefined) {
        payload.shutdown_instance = scheduleData.shutdown_instances
      }
      if (unsavedData && unsavedData.expiration_date) {
        payload.expiration_date = moment(unsavedData.expiration_date).toISOString()
      }
      if (unsavedData && unsavedData.schedule !== null && unsavedData.schedule !== undefined && Object.keys(unsavedData.schedule).length) {
        if (scheduleOldData) {
          payload.schedule = { ...scheduleOldData.schedule }
        }
        // $FlowIssue
        Object.keys(unsavedData.schedule).forEach(prop => {
          // $FlowIssue
          if (unsavedData.schedule[prop] !== null && unsavedData.schedule[prop] !== undefined) {
            payload.schedule[prop] = unsavedData.schedule[prop]
          } else {
            delete payload.schedule[prop]
          }
        })
      }

      Api.send({
        url: `${servicesUrl.coriolis}/${projectId || 'null'}/replicas/${replicaId}/schedules/${scheduleId}`,
        method: 'PUT',
        data: payload,
      }).then(response => {
        let s = { ...response.data.schedule }
        if (s.expiration_date) {
          s.expiration_date = DateUtils.getLocalTime(s.expiration_date)
        }
        if (s.shutdown_instance) {
          s.shutdown_instances = s.shutdown_instance
        }
        resolve(s)
      }).catch(reject)
    })
  }
}

export default ScheduleSource
