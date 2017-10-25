import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import connectToStores from 'alt-utils/lib/connectToStores'

import { MainTemplate, Navigation, FilterList, PageHeader, ConfirmationModal, MainListItem } from 'components'

import replicaItemImage from './images/replica.svg'

import ProjectStore from '../../../stores/ProjectStore'
import UserStore from '../../../stores/UserStore'
import ReplicaStore from '../../../stores/ReplicaStore'
import EndpointStore from '../../../stores/EndpointStore'
import ProjectActions from '../../../actions/ProjectActions'
import ReplicaActions from '../../../actions/ReplicaActions'
import EndpointActions from '../../../actions/EndpointActions'
import UserActions from '../../../actions/UserActions'
import Wait from '../../../utils/Wait'
import NotificationActions from '../../../actions/NotificationActions'
import { requestPollTimeout } from '../../../config'

const Wrapper = styled.div``

const BulkActions = [
  { label: 'Execute', value: 'execute' },
  { label: 'Delete', value: 'delete' },
]

class ReplicasPage extends React.Component {
  static propTypes = {
    projectStore: PropTypes.object,
    replicaStore: PropTypes.object,
    userStore: PropTypes.object,
    endpointStore: PropTypes.object,
  }

  static getStores() {
    return [UserStore, ProjectStore, ReplicaStore, EndpointStore]
  }

  static getPropsFromStores() {
    return {
      userStore: UserStore.getState(),
      projectStore: ProjectStore.getState(),
      replicaStore: ReplicaStore.getState(),
      endpointStore: EndpointStore.getState(),
    }
  }

  constructor() {
    super()

    this.state = {
      showDeleteReplicaConfirmation: false,
      confirmationItems: null,
    }
  }

  componentDidMount() {
    document.title = 'Coriolis Replicas'

    ProjectActions.getProjects()
    ReplicaActions.getReplicas()
    EndpointActions.getEndpoints()

    this.pollData()
    this.pollInterval = setInterval(() => { this.pollData() }, requestPollTimeout)
  }

  componentWillUnmount() {
    clearInterval(this.pollInterval)
  }

  getEndpoint(endpointId) {
    if (!this.props.endpointStore.endpoints || this.props.endpointStore.endpoints === 0) {
      return {}
    }

    return this.props.endpointStore.endpoints.find(endpoint => endpoint.id === endpointId) || {}
  }

  getFilterItems() {
    return [
      { label: 'All', value: 'all' },
      { label: 'Running', value: 'RUNNING' },
      { label: 'Error', value: 'ERROR' },
      { label: 'Completed', value: 'COMPLETED' },
    ]
  }

  handleProjectChange(project) {
    Wait.for(() => this.props.userStore.user.project.id === project.id, () => {
      ProjectActions.getProjects()
      ReplicaActions.getReplicas()
      EndpointActions.getEndpoints()
      this.pollData()
    })

    UserActions.switchProject(project.id)
  }

  handleUserItemClick(item) {
    switch (item.value) {
      case 'signout':
        UserActions.logout()
        return
      case 'profile':
        window.location.href = '/#/profile'
        break
      default:
    }
  }

  handleReloadButtonClick() {
    ProjectActions.getProjects()
    ReplicaActions.getReplicas()
    EndpointActions.getEndpoints()
    this.pollData()
  }

  handleItemClick(item) {
    window.location.href = `/#/replica/${item.id}`
  }

  handleActionChange(items, action) {
    if (action === 'execute') {
      items.forEach(replica => {
        ReplicaActions.execute(replica.id)
      })
      NotificationActions.notify('Executing replicas')
    } else if (action === 'delete') {
      this.setState({
        showDeleteReplicaConfirmation: true,
        confirmationItems: items,
      })
    }
  }

  handleCloseDeleteReplicaConfirmation() {
    this.setState({
      showDeleteReplicaConfirmation: false,
      confirmationItems: null,
    })
  }

  handleDeleteReplicaConfirmation() {
    this.state.confirmationItems.forEach(replica => {
      ReplicaActions.delete(replica.id)
    })
    this.handleCloseDeleteReplicaConfirmation()
  }

  pollData() {
    Wait.for(() => this.props.replicaStore.replicas.length !== 0, () => {
      this.props.replicaStore.replicas.forEach(replica => {
        ReplicaActions.getReplicaExecutions(replica.id)
      })
    })
  }

  itemFilterFunction(item, filterStatus, filterText) {
    let lastExecution = item.executions && item.executions.length ?
      item.executions[item.executions.length - 1] : null
    if ((filterStatus !== 'all' && (!lastExecution || lastExecution.status !== filterStatus)) ||
      (item.instances[0].toLowerCase().indexOf(filterText) === -1)
    ) {
      return false
    }

    return true
  }

  render() {
    return (
      <Wrapper>
        <MainTemplate
          navigationComponent={<Navigation currentPage="replicas" />}
          listComponent={
            <FilterList
              filterItems={this.getFilterItems()}
              selectionLabel="replica"
              loading={this.props.replicaStore.loading}
              items={this.props.replicaStore.replicas}
              onItemClick={item => { this.handleItemClick(item) }}
              onReloadButtonClick={() => { this.handleReloadButtonClick() }}
              actions={BulkActions}
              onActionChange={(items, action) => { this.handleActionChange(items, action) }}
              itemFilterFunction={(...args) => this.itemFilterFunction(...args)}
              renderItemComponent={options =>
                (<MainListItem
                  {...options}
                  image={replicaItemImage}
                  endpointType={id => this.getEndpoint(id).type}
                />)
              }
            />
          }
          headerComponent={
            <PageHeader
              title="Coriolis Replicas"
              projects={this.props.projectStore.projects}
              onProjectChange={project => { this.handleProjectChange(project) }}
              user={this.props.userStore.user}
              onUserItemClick={item => { this.handleUserItemClick(item) }}
            />
          }
        />
        <ConfirmationModal
          isOpen={this.state.showDeleteReplicaConfirmation}
          title="Delete Replicas?"
          message="Are you sure you want to delete the selected replicas?"
          extraMessage="Deleting a Coriolis Replica is permanent!"
          onConfirmation={() => { this.handleDeleteReplicaConfirmation() }}
          onRequestClose={() => { this.handleCloseDeleteReplicaConfirmation() }}
        />
      </Wrapper>
    )
  }
}

export default connectToStores(ReplicasPage)
