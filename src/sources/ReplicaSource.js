import cookie from 'js-cookie'
import moment from 'moment'

import Api from '../utils/ApiCaller'

import { servicesUrl } from '../config'

class ReplicaSourceUtils {
  static sortReplicas(replicas) {
    replicas.sort((a, b) => {
      let aLastExecution = a.executions && a.executions.length ?
        a.executions[a.executions.length - 1].updated_at : null
      let bLastExecution = b.executions && b.executions.length ?
        b.executions[b.executions.length - 1].updated_at : null
      let aTime = aLastExecution || a.updated_at || a.created_at
      let bTime = bLastExecution || b.updated_at || b.created_at
      return moment(bTime).diff(moment(aTime))
    })
  }

  static sortExecutions(executions) {
    if (executions) {
      executions.sort((a, b) => a.number - b.number)
    }
  }

  static sortExecutionsAndTaskUpdates(executions) {
    this.sortExecutions(executions)
    executions.forEach(execution => {
      this.sortTaskUpdates(execution)
    })
  }

  static sortTaskUpdates(execution) {
    if (execution.tasks) {
      execution.tasks.forEach(task => {
        if (task.progress_updates) {
          task.progress_updates.sort((a, b) => moment(a.created_at).isBefore(moment(b.created_at)))
        }
      })
    }
  }
}

class ReplicaSource {
  static getReplicas() {
    return new Promise((resolve, reject) => {
      let projectId = cookie.get('projectId')
      Api.sendAjaxRequest({
        url: `${servicesUrl.coriolis}/${projectId}/replicas/detail`,
        method: 'GET',
      }).then(response => {
        let replicas = response.data.replicas
        ReplicaSourceUtils.sortReplicas(response.data.replicas)
        resolve(replicas)
      }, reject).catch(reject)
    })
  }

  static getReplicaExecutions(replicaId) {
    return new Promise((resolve, reject) => {
      let projectId = cookie.get('projectId')
      Api.sendAjaxRequest({
        url: `${servicesUrl.coriolis}/${projectId}/replicas/${replicaId}/executions/detail`,
        method: 'GET',
      }).then((response) => {
        let executions = response.data.executions
        ReplicaSourceUtils.sortExecutionsAndTaskUpdates(executions)

        resolve({ replicaId, executions })
      }, reject).catch(reject)
    })
  }

  static getReplica(replicaId) {
    return new Promise((resolve, reject) => {
      let projectId = cookie.get('projectId')

      Api.sendAjaxRequest({
        url: `${servicesUrl.coriolis}/${projectId}/replicas/${replicaId}`,
        method: 'GET',
      }).then(response => {
        let replica = response.data.replica
        ReplicaSourceUtils.sortExecutions(replica.executions)
        resolve(replica)
      }, reject).catch(reject)
    })
  }

  static execute(replicaId, fields) {
    return new Promise((resolve, reject) => {
      let payload = { execution: { shutdown_instances: false } }
      if (fields) {
        fields.forEach(f => {
          payload.execution[f.name] = f.value || false
        })
      }
      let projectId = cookie.get('projectId')

      Api.sendAjaxRequest({
        url: `${servicesUrl.coriolis}/${projectId}/replicas/${replicaId}/executions`,
        method: 'POST',
        data: payload,
      }).then((response) => {
        let execution = response.data.execution
        ReplicaSourceUtils.sortTaskUpdates(execution)
        resolve({ replicaId, execution })
      }, reject).catch(reject)
    })
  }

  static cancelExecution(replicaId, executionId) {
    return new Promise((resolve, reject) => {
      let projectId = cookie.get('projectId')

      Api.sendAjaxRequest({
        url: `${servicesUrl.coriolis}/${projectId}/replicas/${replicaId}/executions/${executionId}/actions`,
        method: 'POST',
        data: { cancel: null },
      }).then(() => {
        resolve(replicaId, executionId)
      }, reject).catch(reject)
    })
  }

  static deleteExecution(replicaId, executionId) {
    return new Promise((resolve, reject) => {
      let projectId = cookie.get('projectId')

      Api.sendAjaxRequest({
        url: `${servicesUrl.coriolis}/${projectId}/replicas/${replicaId}/executions/${executionId}`,
        method: 'DELETE',
      }).then(() => {
        resolve(replicaId, executionId)
      }, reject).catch(reject)
    })
  }

  static delete(replicaId) {
    return new Promise((resolve, reject) => {
      let projectId = cookie.get('projectId')

      Api.sendAjaxRequest({
        url: `${servicesUrl.coriolis}/${projectId}/replicas/${replicaId}`,
        method: 'DELETE',
      }).then(() => { resolve(replicaId) }, reject).catch(reject)
    })
  }
}

export default ReplicaSource

