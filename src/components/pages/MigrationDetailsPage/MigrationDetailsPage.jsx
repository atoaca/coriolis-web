import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import connectToStores from 'alt-utils/lib/connectToStores'

import {
  DetailsTemplate,
  DetailsPageHeader,
  DetailsContentHeader,
  MigrationDetailsContent,
  ConfirmationModal,
} from 'components'

import MigrationStore from '../../../stores/MigrationStore'
import UserStore from '../../../stores/UserStore'
import UserActions from '../../../actions/UserActions'
import MigrationActions from '../../../actions/MigrationActions'
import EndpointStore from '../../../stores/EndpointStore'
import EndpointActions from '../../../actions/EndpointActions'
import { requestPollTimeout } from '../../../config'

import migrationImage from './images/migration.svg'

const Wrapper = styled.div``

class MigrationDetailsPage extends React.Component {
  static propTypes = {
    match: PropTypes.object,
    migrationStore: PropTypes.object,
    endpointStore: PropTypes.object,
    userStore: PropTypes.object,
  }

  static getStores() {
    return [MigrationStore, EndpointStore, UserStore]
  }

  static getPropsFromStores() {
    return {
      migrationStore: MigrationStore.getState(),
      endpointStore: EndpointStore.getState(),
      userStore: UserStore.getState(),
    }
  }

  constructor() {
    super()

    this.state = {
      showDeleteMigrationConfirmation: false,
    }
  }

  componentDidMount() {
    document.title = 'Migration Details'

    EndpointActions.getEndpoints()
    this.pollData()
    this.pollInterval = setInterval(() => { this.pollData() }, requestPollTimeout)
  }

  componentWillUnmount() {
    clearInterval(this.pollInterval)
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
    window.location.href = '/#/migrations'
  }

  handleDeleteMigrationClick() {
    this.setState({ showDeleteMigrationConfirmation: true })
  }

  handleDeleteMigrationConfirmation() {
    window.location.href = '/#/migrations'
    MigrationActions.delete(this.props.migrationStore.migrationDetails.id)
  }

  handleCloseDeleteMigrationConfirmation() {
    this.setState({ showDeleteMigrationConfirmation: false })
  }

  pollData() {
    MigrationActions.getMigration(this.props.match.params.id)
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
            item={this.props.migrationStore.migrationDetails}
            onBackButonClick={() => { this.handleBackButtonClick() }}
            onActionButtonClick={() => { this.handleDeleteMigrationClick() }}
            typeImage={migrationImage}
            primaryInfoPill
            buttonLabel="Delete"
            alertButton
            hollowButton
          />}
          contentComponent={<MigrationDetailsContent
            item={this.props.migrationStore.migrationDetails}
            endpoints={this.props.endpointStore.endpoints}
            page={this.props.match.params.page || ''}
            onDeleteMigrationClick={() => { this.handleDeleteMigrationClick() }}
          />}
        />
        <ConfirmationModal
          isOpen={this.state.showDeleteMigrationConfirmation}
          title="Delete Migration?"
          message="Are you sure you want to delete this migration?"
          extraMessage="Deleting a Coriolis Migration is permanent!"
          onConfirmation={() => { this.handleDeleteMigrationConfirmation() }}
          onRequestClose={() => { this.handleCloseDeleteMigrationConfirmation() }}
        />
      </Wrapper>
    )
  }
}

export default connectToStores(MigrationDetailsPage)
