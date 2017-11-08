import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import connectToStores from 'alt-utils/lib/connectToStores'

import {
  DetailsTemplate,
  DetailsPageHeader,
  DetailsContentHeader,
  ReplicaDetailsContent,
  Modal,
  ReplicaExecutionOptions,
  AlertModal,
  ReplicaMigrationOptions,
} from 'components'

import Wait from '../../../utils/Wait'
import ReplicaStore from '../../../stores/ReplicaStore'
import UserStore from '../../../stores/UserStore'
import UserActions from '../../../actions/UserActions'
import ReplicaActions from '../../../actions/ReplicaActions'
import MigrationActions from '../../../actions/MigrationActions'
import EndpointStore from '../../../stores/EndpointStore'
import EndpointActions from '../../../actions/EndpointActions'
import { requestPollTimeout } from '../../../config'

import replicaImage from './images/replica.svg'

const Wrapper = styled.div``

class ReplicaDetailsPage extends React.Component {
  static propTypes = {
    match: PropTypes.object,
    replicaStore: PropTypes.object,
    endpointStore: PropTypes.object,
    userStore: PropTypes.object,
  }

  static getStores() {
    return [ReplicaStore, EndpointStore, UserStore]
  }

  static getPropsFromStores() {
    return {
      replicaStore: ReplicaStore.getState(),
      endpointStore: EndpointStore.getState(),
      userStore: UserStore.getState(),
    }
  }

  constructor() {
    super()

    this.state = {
      showOptionsModal: false,
      showMigrationModal: false,
      showDeleteExecutionConfirmation: false,
      showDeleteReplicaConfirmation: false,
      confirmationItem: null,
    }
  }

  componentDidMount() {
    document.title = 'Replica Details'

    ReplicaActions.getReplica(this.props.match.params.id)
    EndpointActions.getEndpoints()
    this.pollData()
    this.pollInterval = setInterval(() => { this.pollData() }, requestPollTimeout)
  }

  componentWillUnmount() {
    clearInterval(this.pollInterval)
  }

  isActionButtonDisabled() {
    let originEndpoint = this.props.endpointStore.endpoints.find(e => e.id === this.props.replicaStore.replicaDetails.origin_endpoint_id)
    let targetEndpoint = this.props.endpointStore.endpoints.find(e => e.id === this.props.replicaStore.replicaDetails.destination_endpoint_id)
    let lastExecution = this.props.replicaStore.replicaDetails.executions && this.props.replicaStore.replicaDetails.executions.length
      && this.props.replicaStore.replicaDetails.executions[this.props.replicaStore.replicaDetails.executions.length - 1]
    let status = lastExecution && lastExecution.status

    return Boolean(!originEndpoint || !targetEndpoint || status === 'RUNNING')
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

  handleBackButtonClick() {
    window.location.href = '/#/replicas'
  }

  handleActionButtonClick() {
    this.setState({ showOptionsModal: true })
  }

  handleCloseOptionsModal() {
    this.setState({ showOptionsModal: false })
  }

  handleCancelExecutionClick(execution) {
    ReplicaActions.cancelExecution(this.props.replicaStore.replicaDetails.id, execution.id)
  }

  handleDeleteExecutionConfirmation() {
    ReplicaActions.deleteExecution(this.props.replicaStore.replicaDetails.id, this.state.confirmationItem.id)
    this.handleCloseExecutionConfirmation()
  }

  handleDeleteExecutionClick(execution) {
    this.setState({
      showDeleteExecutionConfirmation: true,
      confirmationItem: execution,
    })
  }

  handleCloseExecutionConfirmation() {
    this.setState({
      showDeleteExecutionConfirmation: false,
      confirmationItem: null,
    })
  }

  handleDeleteReplicaClick() {
    this.setState({ showDeleteReplicaConfirmation: true })
  }

  handleDeleteReplicaConfirmation() {
    window.location.href = '/#/replicas'
    ReplicaActions.delete(this.props.replicaStore.replicaDetails.id)
  }

  handleCloseDeleteReplicaConfirmation() {
    this.setState({ showDeleteReplicaConfirmation: false })
  }

  handleCloseMigrationModal() {
    this.setState({ showMigrationModal: false })
  }

  handleCreateMigrationClick() {
    this.setState({ showMigrationModal: true })
  }

  migrateReplica(options) {
    MigrationActions.migrateReplica(this.props.replicaStore.replicaDetails.id, options)
    this.handleCloseMigrationModal()
  }

  executeReplica(fields) {
    ReplicaActions.execute(this.props.replicaStore.replicaDetails.id, fields)
    this.handleCloseOptionsModal()
  }

  pollData() {
    Wait.for(() => this.props.replicaStore.replicaDetails.id === this.props.match.params.id,
      () => { ReplicaActions.getReplicaExecutions(this.props.match.params.id) })
  }

  render() {
    return (
      <Wrapper>
        <DetailsTemplate
          pageHeaderComponent={<DetailsPageHeader
            user={this.props.userStore.user}
            onUserItemClick={item => { this.handleUserItemClick(item) }}
          />}
          contentHeaderComponent={<DetailsContentHeader
            item={this.props.replicaStore.replicaDetails}
            onBackButonClick={() => { this.handleBackButtonClick() }}
            onActionButtonClick={() => { this.handleActionButtonClick() }}
            actionButtonDisabled={this.isActionButtonDisabled()}
            typeImage={replicaImage}
            alertInfoPill
            buttonLabel="Execute Now"
          />}
          contentComponent={<ReplicaDetailsContent
            item={this.props.replicaStore.replicaDetails}
            endpoints={this.props.endpointStore.endpoints}
            page={this.props.match.params.page || ''}
            onCancelExecutionClick={execution => { this.handleCancelExecutionClick(execution) }}
            onDeleteExecutionClick={execution => { this.handleDeleteExecutionClick(execution) }}
            onExecuteClick={() => { this.handleActionButtonClick() }}
            onCreateMigrationClick={() => { this.handleCreateMigrationClick() }}
            onDeleteReplicaClick={() => { this.handleDeleteReplicaClick() }}
          />}
        />
        <Modal
          isOpen={this.state.showOptionsModal}
          title="New Execution"
          onRequestClose={() => { this.handleCloseOptionsModal() }}
        >
          <ReplicaExecutionOptions
            onCancelClick={() => { this.handleCloseOptionsModal() }}
            onExecuteClick={fields => { this.executeReplica(fields) }}
          />
        </Modal>
        <Modal
          isOpen={this.state.showMigrationModal}
          title="Create Migration from Replica"
          onRequestClose={() => { this.handleCloseMigrationModal() }}
        >
          <ReplicaMigrationOptions
            onCancelClick={() => { this.handleCloseMigrationModal() }}
            onMigrateClick={options => { this.migrateReplica(options) }}
          />
        </Modal>
        <AlertModal
          isOpen={this.state.showDeleteExecutionConfirmation}
          title="Delete Execution?"
          message="Are you sure you want to delete this execution?"
          extraMessage="Deleting a Coriolis Execution is permanent!"
          onConfirmation={() => { this.handleDeleteExecutionConfirmation() }}
          onRequestClose={() => { this.handleCloseExecutionConfirmation() }}
        />
        <AlertModal
          isOpen={this.state.showDeleteReplicaConfirmation}
          title="Delete Replica?"
          message="Are you sure you want to delete this replica?"
          extraMessage="Deleting a Coriolis Replica is permanent!"
          onConfirmation={() => { this.handleDeleteReplicaConfirmation() }}
          onRequestClose={() => { this.handleCloseDeleteReplicaConfirmation() }}
        />
      </Wrapper>
    )
  }
}

export default connectToStores(ReplicaDetailsPage)
